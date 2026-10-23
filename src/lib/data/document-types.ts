import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { DocumentType } from "@/lib/types";

export type QueryResult<T> = {
  data: T;
  error: string | null;
};

export async function listDocumentTypes(): Promise<
  QueryResult<DocumentType[]>
> {
  if (!isSupabaseConfigured) {
    return { data: [], error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document_types")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data ?? []) as DocumentType[], error: null };
}

export async function listAllDocumentTypes(): Promise<QueryResult<DocumentType[]>> {
  if (!isSupabaseConfigured) return { data: [], error: null };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document_types")
    .select("*")
    .order("name", { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as DocumentType[], error: null };
}

export async function getDocumentType(
  id: string,
): Promise<QueryResult<DocumentType | null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document_types")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: (data as DocumentType | null) ?? null, error: null };
}
