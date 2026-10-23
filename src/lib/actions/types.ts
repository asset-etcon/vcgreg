import type { ZodError } from "zod";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export const initialFormState: FormState = {};

export function fieldErrorsFromZod(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];

    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

type PostgrestLikeError = {
  code?: string;
  message: string;
};

export function friendlyDbError(error: PostgrestLikeError): string {
  switch (error.code) {
    case "23505":
      return "That value is already in use. Choose a different one.";
    case "23503":
      return "This record is still referenced by other records.";
    case "42P01":
    case "PGRST205":
      return "Database tables were not found. Apply supabase/schema.sql in your Supabase project.";
    case "42501":
      return "You do not have permission to perform this action.";
    default:
      return error.message;
  }
}
