

Implement the database schema and reference-number generation logic for VCGL Document Reference Generator.

## Database tables

### 1. document_types
Fields:
- id: UUID primary key
- name: required document type name
- code: required short code
- is_active: boolean, default true
- created_at
- updated_at

### 2. reference_counters
Maintain a separate sequence counter for each document type and year.

Fields:
- document_type_id
- issue_year
- last_number

Use a composite unique or primary key on document_type_id and issue_year.

### 3. documents
Fields:
- id: UUID primary key
- reference_number: unique and required
- document_type_id: foreign key
- sequence_number: integer
- issue_year: integer
- title: optional
- description: optional
- status: issued or cancelled
- created_at
- updated_at

Preserve issued references permanently. Cancellation must not delete a record or release its sequence number.

## Reference format

`VCL/{TYPE_CODE}/{SEQUENCE}/{YEAR}`

Examples:
- VCL/Sci/001/2026
- VCL/Sci/002/2026
- VCL/RR/001/2026
- VCL/FS/001/2026
- VCL/SCA/001/2026

Pad sequence numbers to at least three digits. For example, 1000 must display as 1000, not 000 or a truncated number.

## Critical generation requirements

1. Generate references on the server through a PostgreSQL function or equivalent atomic database transaction.
2. Lock or atomically update the counter so simultaneous requests cannot generate duplicate references.
3. Determine the year using the Africa/Lagos timezone.
4. Use the active document type's current code when creating the reference.
5. Never trust a reference number or sequence number supplied by the browser.
6. Add a unique database constraint on reference_number.
7. Validate that the selected document type exists and is active.
8. If saving the document fails, the transaction must not leave an inconsistent counter or partial record.
9. Changing a document type's code later must not alter existing reference numbers.
10. Create migrations and seed the initial document types:
    - ScientiFRIKA — Sci
    - RReliability — RR
    - Food Safety — FS
    - SmartCity Africa — SCA

## Testing
Test independent counters for each type, year changes, concurrent generation, duplicate prevention, inactive document types, transaction rollback, and sequence numbers above 999.

Provide SQL migrations and document the database function. Do not implement the generator as a browser-side counter.