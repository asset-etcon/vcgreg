-- Fresh-install schema for the VCL Document Reference Generator.
create extension if not exists pgcrypto;

create table public.document_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reference_counters (
  document_type_id uuid not null references public.document_types(id) on delete restrict,
  issue_year integer not null check (issue_year between 1 and 9999),
  last_number integer not null check (last_number > 0),
  primary key (document_type_id, issue_year)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  document_type_id uuid not null references public.document_types(id) on delete restrict,
  sequence_number integer not null check (sequence_number > 0),
  issue_year integer not null check (issue_year between 1 and 9999),
  title text,
  description text,
  status text not null default 'issued' check (status in ('issued', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (document_type_id, issue_year, sequence_number)
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger document_types_set_updated_at before update on public.document_types
for each row execute function public.set_updated_at();
create trigger documents_set_updated_at before update on public.documents
for each row execute function public.set_updated_at();

create or replace function public.protect_document_reference()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Issued references cannot be deleted; cancel the document instead' using errcode = '55000';
  end if;
  if new.reference_number is distinct from old.reference_number
     or new.document_type_id is distinct from old.document_type_id
     or new.sequence_number is distinct from old.sequence_number
     or new.issue_year is distinct from old.issue_year then
    raise exception 'An issued reference cannot be changed' using errcode = '55000';
  end if;
  return new;
end;
$$;
create trigger documents_protect_reference before update or delete on public.documents
for each row execute function public.protect_document_reference();

-- The counter increment and document insert share the caller's transaction. Any
-- insert error rolls the counter update back with the function call.
create or replace function public.create_document_reference(
  p_document_type_id uuid,
  p_title text default null,
  p_description text default null
)
returns public.documents
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_type public.document_types%rowtype;
  v_year integer;
  v_number integer;
  v_document public.documents%rowtype;
begin
  select * into v_type from public.document_types
   where id = p_document_type_id and is_active = true for key share;
  if not found then raise exception 'Document type does not exist or is inactive' using errcode = '22023'; end if;

  v_year := extract(year from (statement_timestamp() at time zone 'Africa/Lagos'))::integer;
  insert into public.reference_counters(document_type_id, issue_year, last_number)
  values (p_document_type_id, v_year, 1)
  on conflict (document_type_id, issue_year)
  do update set last_number = public.reference_counters.last_number + 1
  returning last_number into v_number;

  insert into public.documents(reference_number, document_type_id, sequence_number, issue_year, title, description, status)
  values ('VCL/' || v_type.code || '/' || lpad(v_number::text, 3, '0') || '/' || v_year,
          p_document_type_id, v_number, v_year, p_title, p_description, 'issued')
  returning * into v_document;
  return v_document;
end;
$$;

alter table public.document_types enable row level security;
alter table public.reference_counters enable row level security;
alter table public.documents enable row level security;
create policy "Authenticated users can read document types" on public.document_types for select to authenticated using (true);
create policy "Authenticated users can manage document types" on public.document_types for all to authenticated using (true) with check (true);
create policy "Authenticated users can read documents" on public.documents for select to authenticated using (true);
create policy "Authenticated users can update documents" on public.documents for update to authenticated using (true) with check (true);
create policy "Authenticated users can read counters" on public.reference_counters for select to authenticated using (true);
revoke insert, update, delete on public.reference_counters from authenticated;
revoke insert, delete on public.documents from authenticated;
revoke update on public.documents from authenticated;
grant update (title, description, status) on public.documents to authenticated;
revoke delete on public.documents from authenticated;
grant execute on function public.create_document_reference(uuid, text, text) to authenticated;

insert into public.document_types(name, code) values
  ('ScientiFRIKA', 'Sci'), ('RReliability', 'RR'),
  ('Food Safety', 'FS'), ('SmartCity Africa', 'SCA')
on conflict (code) do nothing;
