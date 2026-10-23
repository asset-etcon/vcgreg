# VCL Document Reference Generator

Internal web application for Vethan Concepts Limited. It generates consistent
controlled document reference numbers and maintains a searchable document
register.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4
- Supabase PostgreSQL and Supabase Auth
- Lucide icons
- Zod form validation

## Features

- Responsive dashboard shell with sidebar, header, and administrator menu
- Supabase email/password authentication with a protected application area
- Dashboard with register counts and recent documents
- Document Types CRUD
- Document Register (create via Generate Reference, edit details, cancel without deletion)
- Automatic reference numbers in the format `VCL/CODE/NNN/YYYY`
- Reusable buttons, form fields, tables, confirmation dialogs, loading states,
  and notifications
- Graceful setup mode until Supabase environment variables are configured

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Apply [`supabase/migrations/20261023000000_document_reference_generator.sql`](supabase/migrations/20261023000000_document_reference_generator.sql) in the SQL editor. For a fresh manual setup, run [`supabase/schema.sql`](supabase/schema.sql).
3. In **Authentication > Users**, create the administrator account.
4. Disable public sign-ups under **Authentication > Providers > Email** if you
   want the app to remain internal only.

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values from **Project
Settings > API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Only the public URL and anon key are used. The service role key is never
needed and must not be exposed to the browser.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the
administrator account.

> Environment values are read when the app starts. Restart the dev server (or
> rebuild) after changing `.env.local`.

## Scripts

```bash
npm run dev        # Start the development server
npm run build      # Production build
npm run start      # Start the production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript without emitting files
```

## Reference format

References are issued atomically by the PostgreSQL `create_document_reference`
function. It locks the per type and Lagos calendar year counter, reads the
active type code, and inserts the document in the same transaction. A failed
insert rolls the counter back. Browsers cannot supply reference or sequence
values, and issued rows are cancelled by status instead of deleted.

```text
VCL/Sci/001/2026
VCL/Sci/002/2026
VCL/RR/001/2026
```

The database enforces uniqueness on the full reference number.

The SQL verification scenarios are in `supabase/tests/reference_generation.sql`.
Run them against a disposable Supabase database after applying the schema. To
check concurrency, issue multiple `create_document_reference` RPC calls at
once for the same type and confirm the returned sequence values are unique.

## Project structure

```text
src/
  app/
    (app)/                    Protected application pages
      page.tsx                Dashboard
      generate-reference/     Reference generation workflow
      documents/              Document Register list and edit
      document-types/         Document Types list, create, edit
    login/                    Administrator sign in
  components/
    layout/                   Sidebar, header, account menu, app shell
    documents/                Document forms
    document-types/           Document type form
    ui/                       Reusable UI primitives
  lib/
    actions/                  Server actions for CRUD and auth
    data/                     Server-side Supabase queries
    supabase/                 Browser, server, and proxy clients
    auth.ts                   Session helpers
    references.ts             Reference number generation
    validation.ts             Zod schemas
  proxy.ts                    Session refresh and route protection
supabase/schema.sql           Database tables, triggers, and RLS policies
```

## Security notes

- Server components and server actions access Supabase with the authenticated
  user session; no secret keys reach browser code.
- Row Level Security is enabled. Only authenticated users can read or modify
  records.
- The app has a single administrator role by design. Staff management,
  approval workflows, and analytics are intentionally out of scope.
