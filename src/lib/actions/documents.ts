"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { documentSchema, idSchema } from "@/lib/validation";

import {
  fieldErrorsFromZod,
  friendlyDbError,
  type FormState,
} from "./types";

function parseDocument(formData: FormData) {
  return documentSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    document_type_id: String(formData.get("document_type_id") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
}

export async function createDocument(
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

  const parsed = parseDocument(formData);

  if (!parsed.success) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_document_reference", {
    p_document_type_id: parsed.data.document_type_id,
    p_title: parsed.data.title,
    p_description: parsed.data.description,
  });
  if (error) return { error: friendlyDbError(error) };
  const row = Array.isArray(data) ? data[0] : data;
  const reference = row?.reference_number as string | undefined;
  if (!reference) return { error: "The database did not return a reference number." };

  revalidatePath("/documents");
  revalidatePath("/");
  redirect(
    `/documents?notice=created&reference=${encodeURIComponent(reference)}`,
  );
}

export async function updateDocument(
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
    return { error: "Invalid document." };
  }

  const parsed = parseDocument(formData);

  if (!parsed.success) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("documents").update({
    title: parsed.data.title,
    description: parsed.data.description,
  }).eq("id", id.data);

  if (error) {
    return { error: friendlyDbError(error) };
  }

  revalidatePath("/documents");
  revalidatePath("/");
  redirect("/documents?notice=updated");
}

export async function deleteDocument(formData: FormData) {
  if (!isSupabaseConfigured) {
    redirect("/documents?notice=setup");
  }

  await requireUser();

  const id = idSchema.safeParse(String(formData.get("id") ?? ""));

  if (!id.success) {
    redirect("/documents?notice=delete-failed");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("documents")
    .update({ status: "cancelled" }).eq("id", id.data);

  if (error) {
    redirect("/documents?notice=delete-failed");
  }

  revalidatePath("/documents");
  revalidatePath("/");
  redirect("/documents?notice=deleted");
}
