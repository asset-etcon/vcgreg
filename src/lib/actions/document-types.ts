"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { documentTypeSchema, idSchema } from "@/lib/validation";

import {
  fieldErrorsFromZod,
  friendlyDbError,
  type FormState,
} from "./types";

function parseDocumentType(formData: FormData) {
  return documentTypeSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    code: String(formData.get("code") ?? "")
      .trim()
      .toUpperCase(),
    description: String(formData.get("description") ?? ""),
  });
}

export async function createDocumentType(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured) {
    return {
      error:
        "Supabase is not configured. Add your project URL and anon key to .env.local.",
    };
  }

  await requireUser();

  const parsed = parseDocumentType(formData);

  if (!parsed.success) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("document_types")
    .insert(parsed.data);

  if (error) {
    return { error: friendlyDbError(error) };
  }

  revalidatePath("/document-types");
  revalidatePath("/generate-reference");
  revalidatePath("/");
  redirect("/document-types?notice=created");
}

export async function updateDocumentType(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured) {
    return {
      error:
        "Supabase is not configured. Add your project URL and anon key to .env.local.",
    };
  }

  await requireUser();

  const id = idSchema.safeParse(String(formData.get("id") ?? ""));

  if (!id.success) {
    return { error: "Invalid document type." };
  }

  const parsed = parseDocumentType(formData);

  if (!parsed.success) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("document_types")
    .update(parsed.data)
    .eq("id", id.data);

  if (error) {
    return { error: friendlyDbError(error) };
  }

  revalidatePath("/document-types");
  revalidatePath("/generate-reference");
  revalidatePath("/");
  redirect("/document-types?notice=updated");
}

export async function deleteDocumentType(formData: FormData) {
  if (!isSupabaseConfigured) {
    redirect("/document-types?notice=setup");
  }

  await requireUser();

  const id = idSchema.safeParse(String(formData.get("id") ?? ""));

  if (!id.success) {
    redirect("/document-types?notice=delete-failed");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("document_types")
    .delete()
    .eq("id", id.data);

  if (error) {
    redirect(
      error.code === "23503"
        ? "/document-types?notice=in-use"
        : "/document-types?notice=delete-failed",
    );
  }

  revalidatePath("/document-types");
  revalidatePath("/generate-reference");
  revalidatePath("/");
  redirect("/document-types?notice=deleted");
}
