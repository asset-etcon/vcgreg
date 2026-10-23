"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Alert } from "@/components/ui/alert";
import { buttonStyles } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  createDocumentType,
  updateDocumentType,
} from "@/lib/actions/document-types";
import {
  initialFormState,
  type FormState,
} from "@/lib/actions/types";
import type { DocumentType } from "@/lib/types";

export function DocumentTypeForm({
  documentType,
}: {
  documentType?: DocumentType;
}) {
  const isEdit = Boolean(documentType);
  const action = isEdit ? updateDocumentType : createDocumentType;
  const [state, formAction] = useActionState<FormState, FormData>(
    action,
    initialFormState,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      {isEdit ? (
        <input type="hidden" name="id" value={documentType?.id} />
      ) : null}

      {state.error ? <Alert variant="error">{state.error}</Alert> : null}

      <Field
        label="Name"
        htmlFor="name"
        required
        error={state.fieldErrors?.name}
        hint="A clear description of the document category."
      >
        <Input
          id="name"
          name="name"
          defaultValue={documentType?.name ?? ""}
          placeholder="e.g. Quality Management System"
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={
            state.fieldErrors?.name ? "name-error" : "name-hint"
          }
          required
        />
      </Field>

      <Field
        label="Code"
        htmlFor="code"
        required
        error={state.fieldErrors?.code}
        hint="Used as the reference prefix. Uppercase letters, numbers, and hyphens."
      >
        <Input
          id="code"
          name="code"
          defaultValue={documentType?.code ?? ""}
          placeholder="e.g. QMS"
          className="uppercase"
          maxLength={12}
          aria-invalid={Boolean(state.fieldErrors?.code)}
          aria-describedby={
            state.fieldErrors?.code ? "code-error" : "code-hint"
          }
          required
        />
      </Field>

      <Field
        label="Description"
        htmlFor="description"
        error={state.fieldErrors?.description}
        hint="Optional. Keep it brief."
      >
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={documentType?.description ?? ""}
          placeholder="What this document type covers"
          aria-invalid={Boolean(state.fieldErrors?.description)}
          aria-describedby={
            state.fieldErrors?.description
              ? "description-error"
              : "description-hint"
          }
        />
      </Field>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/document-types"
          className={buttonStyles({ variant: "outline" })}
        >
          Cancel
        </Link>
        <SubmitButton pendingLabel={isEdit ? "Saving…" : "Creating…"}>
          {isEdit ? "Save changes" : "Create document type"}
        </SubmitButton>
      </div>
    </form>
  );
}
