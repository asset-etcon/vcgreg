"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Alert } from "@/components/ui/alert";
import { buttonStyles } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateDocument } from "@/lib/actions/documents";
import {
  initialFormState,
  type FormState,
} from "@/lib/actions/types";
import {
  DOCUMENT_STATUSES,
  type DocumentRecord,
  type DocumentType,
} from "@/lib/types";

export function DocumentForm({
  document,
  documentTypes,
}: {
  document: DocumentRecord;
  documentTypes: Pick<DocumentType, "id" | "name" | "code">[];
}) {
  const [state, formAction] = useActionState<FormState, FormData>(
    updateDocument,
    initialFormState,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <input type="hidden" name="id" value={document.id} />

      {state.error ? <Alert variant="error">{state.error}</Alert> : null}

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Reference number
        </p>
        <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
          {document.reference_number}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Reference numbers are assigned at creation and cannot be changed.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Document type"
          htmlFor="document_type_id"
          required
          error={state.fieldErrors?.document_type_id}
          className="sm:col-span-2"
        >
          <Select
            id="document_type_id"
            name="document_type_id"
            defaultValue={document.document_type_id}
            aria-invalid={Boolean(state.fieldErrors?.document_type_id)}
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
            defaultValue={document.title ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.title)}
            required
          />
        </Field>

        <Field
          label="Version"
          htmlFor="version"
          required
          error={state.fieldErrors?.version}
        >
          <Input
            id="version"
            name="version"
            defaultValue={document.version}
            aria-invalid={Boolean(state.fieldErrors?.version)}
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
            defaultValue={document.status}
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
        >
          <Input
            id="owner"
            name="owner"
            defaultValue={document.owner ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.owner)}
          />
        </Field>

        <Field
          label="Issue date"
          htmlFor="issue_date"
          error={state.fieldErrors?.issue_date}
        >
          <Input
            id="issue_date"
            name="issue_date"
            type="date"
            defaultValue={document.issue_date ?? ""}
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
            defaultValue={document.notes ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.notes)}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/documents"
          className={buttonStyles({ variant: "outline" })}
        >
          Cancel
        </Link>
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  );
}
