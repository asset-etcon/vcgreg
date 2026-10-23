"use client";

import { FileDigit } from "lucide-react";
import { useActionState, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { createDocument } from "@/lib/actions/documents";
import {
  initialFormState,
  type FormState,
} from "@/lib/actions/types";
import { DOCUMENT_STATUSES, type DocumentType } from "@/lib/types";

export function GenerateReferenceForm({
  documentTypes,
  year,
  today,
}: {
  documentTypes: Pick<DocumentType, "id" | "name" | "code">[];
  year: number;
  today: string;
}) {
  const [documentTypeId, setDocumentTypeId] = useState(
    documentTypes[0]?.id ?? "",
  );
  const [state, formAction] = useActionState<FormState, FormData>(
    createDocument,
    initialFormState,
  );

  const selectedType = documentTypes.find(
    (item) => item.id === documentTypeId,
  );
  const previewCode = selectedType?.code ?? "CODE";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <form
        action={formAction}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        {state.error ? <Alert variant="error">{state.error}</Alert> : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Document type"
            htmlFor="document_type_id"
            required
            error={state.fieldErrors?.document_type_id}
            hint="Determines the reference prefix."
            className="sm:col-span-2"
          >
            <Select
              id="document_type_id"
              name="document_type_id"
              value={documentTypeId}
              onChange={(event) => setDocumentTypeId(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.document_type_id)}
              aria-describedby={
                state.fieldErrors?.document_type_id
                  ? "document_type_id-error"
                  : "document_type_id-hint"
              }
              required
            >
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.code})
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Document title"
            htmlFor="title"
            required
            error={state.fieldErrors?.title}
            className="sm:col-span-2"
          >
            <Input
              id="title"
              name="title"
              placeholder="e.g. Quality Manual"
              aria-invalid={Boolean(state.fieldErrors?.title)}
              aria-describedby={
                state.fieldErrors?.title ? "title-error" : undefined
              }
              required
            />
          </Field>

          <Field
            label="Version"
            htmlFor="version"
            required
            error={state.fieldErrors?.version}
            hint="For example 1.0 or Rev B."
          >
            <Input
              id="version"
              name="version"
              defaultValue="1.0"
              maxLength={20}
              aria-invalid={Boolean(state.fieldErrors?.version)}
              aria-describedby={
                state.fieldErrors?.version ? "version-error" : "version-hint"
              }
              required
            />
          </Field>

          <Field
            label="Status"
            htmlFor="status"
            required
            error={state.fieldErrors?.status}
          >
            <Select
              id="status"
              name="status"
              defaultValue="Draft"
              aria-invalid={Boolean(state.fieldErrors?.status)}
            >
              {DOCUMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Document owner"
            htmlFor="owner"
            error={state.fieldErrors?.owner}
            hint="Optional. Person or department responsible."
          >
            <Input
              id="owner"
              name="owner"
              placeholder="e.g. Quality Assurance"
              aria-invalid={Boolean(state.fieldErrors?.owner)}
            />
          </Field>

          <Field
            label="Issue date"
            htmlFor="issue_date"
            error={state.fieldErrors?.issue_date}
            hint="Optional."
          >
            <Input
              id="issue_date"
              name="issue_date"
              type="date"
              defaultValue={today}
              aria-invalid={Boolean(state.fieldErrors?.issue_date)}
            />
          </Field>

          <Field
            label="Notes"
            htmlFor="notes"
            error={state.fieldErrors?.notes}
            className="sm:col-span-2"
          >
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Optional notes for the register"
              aria-invalid={Boolean(state.fieldErrors?.notes)}
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <SubmitButton pendingLabel="Generating…">
            Generate &amp; save document
          </SubmitButton>
        </div>
      </form>

      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <FileDigit className="h-4 w-4 text-blue-800" />
          Reference preview
        </div>
        <p className="mt-4 break-all rounded-lg border border-dashed border-blue-200 bg-blue-50 px-3 py-4 text-center font-mono text-lg font-semibold text-blue-950">
          VCL/{previewCode}/###/{year}
        </p>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          The next sequence number is assigned automatically when you save. The
          format is VCL, document code, sequence, and year.
        </p>
      </aside>
    </div>
  );
}
