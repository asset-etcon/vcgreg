-- Run against a disposable database after applying schema.sql.
-- Rolls back every generated test record and counter change.
begin;
do $$
declare
  v_sci uuid;
  v_rr uuid;
  v_doc public.documents%rowtype;
  v_count integer;
begin
  select id into strict v_sci from public.document_types where code = 'Sci';
  select id into strict v_rr from public.document_types where code = 'RR';

  v_doc := public.create_document_reference(v_sci, 'test one', null);
  if v_doc.reference_number not like 'VCL/Sci/001/%' or v_doc.sequence_number <> 1 then
    raise exception 'First sequence did not start at 1';
  end if;
  if v_doc.issue_year <> extract(year from (statement_timestamp() at time zone 'Africa/Lagos'))::integer then
    raise exception 'Issue year is not Lagos year';
  end if;

  v_doc := public.create_document_reference(v_rr, 'independent counter', null);
  if v_doc.sequence_number <> 1 then raise exception 'Type counters are not independent'; end if;

  -- Changing the type code cannot mutate references already recorded.
  update public.document_types set code = 'SCI2' where id = v_sci;
  if not exists(select 1 from public.documents where reference_number like 'VCL/Sci/001/%') then
    raise exception 'Existing reference changed after code update';
  end if;

  -- lpad must not truncate sequences above 999.
  insert into public.reference_counters(document_type_id, issue_year, last_number)
  values (v_sci, extract(year from (statement_timestamp() at time zone 'Africa/Lagos'))::integer, 999)
  on conflict (document_type_id, issue_year) do update set last_number = 999;
  v_doc := public.create_document_reference(v_sci, 'four digits', null);
  if v_doc.sequence_number <> 1000 or v_doc.reference_number not like '%/1000/%' then
    raise exception 'Sequence above 999 was truncated';
  end if;

  update public.document_types set is_active = false where id = v_sci;
  begin
    perform public.create_document_reference(v_sci, 'inactive', null);
    raise exception 'Inactive type unexpectedly generated a reference';
  exception when sqlstate '22023' then null;
  end;
  update public.document_types set is_active = true where id = v_sci;

  -- Force a sequence collision, then verify the function's counter increment rolls back.
  insert into public.reference_counters(document_type_id, issue_year, last_number)
  values (v_rr, 2000, 1)
  on conflict (document_type_id, issue_year) do update set last_number = 1;
  insert into public.documents(reference_number, document_type_id, sequence_number, issue_year, title)
  values ('VCL/RR/001/2000', v_rr, 1, 2000, 'collision fixture');
  begin
    perform public.create_document_reference(v_rr, 'must roll back', null);
    raise exception 'Duplicate sequence unexpectedly inserted';
  exception when unique_violation then null;
  end;
  if (select last_number from public.reference_counters where document_type_id = v_rr and issue_year = 2000) <> 1 then
    raise exception 'Counter increment was not rolled back';
  end if;

  -- Duplicate reference numbers are independently rejected by the unique constraint.
  select count(*) into v_count from public.documents;
  begin
    insert into public.documents(reference_number, document_type_id, sequence_number, issue_year, title)
    values ((select reference_number from public.documents limit 1), v_rr, 88, 2000, 'duplicate');
    raise exception 'Duplicate reference unexpectedly inserted';
  exception when unique_violation then null;
  end;
  if (select count(*) from public.documents) <> v_count then raise exception 'Duplicate left a partial row'; end if;
end;
$$;
rollback;
