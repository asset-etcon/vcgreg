import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { DocumentRecord, DocumentType } from "@/lib/types";

import type { QueryResult } from "./document-types";

export type DashboardSummary = {
  totalDocuments: number;
  totalTypes: number;
  draftCount: number;
  issuedCount: number;
  recentDocuments: DocumentRecord[];
};

export async function listDocuments(): Promise<QueryResult<DocumentRecord[]>> {
  if (!isSupabaseConfigured) {
    return { data: [], error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*, document_types(name, code)")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data ?? []) as DocumentRecord[], error: null };
}

export async function getDocument(
  id: string,
): Promise<QueryResult<DocumentRecord | null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*, document_types(name, code)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: (data as DocumentRecord | null) ?? null, error: null };
}

export async function getDashboardSummary(): Promise<
  QueryResult<DashboardSummary>
> {
  const empty: DashboardSummary = {
    totalDocuments: 0,
    totalTypes: 0,
    draftCount: 0,
    issuedCount: 0,
    recentDocuments: [],
  };

  if (!isSupabaseConfigured) {
    return { data: empty, error: null };
  }

  const supabase = await createClient();
  const [documentsResult, typesResult] = await Promise.all([
    supabase
      .from("documents")
      .select("*, document_types(name, code)")
      .order("created_at", { ascending: false }),
    supabase.from("document_types").select("id"),
  ]);

  if (documentsResult.error) {
    return { data: empty, error: documentsResult.error.message };
  }

  if (typesResult.error) {
    return { data: empty, error: typesResult.error.message };
  }

  const documents = (documentsResult.data ?? []) as DocumentRecord[];

  return {
    data: {
      totalDocuments: documents.length,
      totalTypes: (typesResult.data ?? []).length,
      draftCount: documents.filter((item) => item.status === "cancelled").length,
      issuedCount: documents.filter((item) => item.status === "issued").length,
      recentDocuments: documents.slice(0, 5),
    },
    error: null,
  };
}

export type DocumentTypeOption = Pick<DocumentType, "id" | "name" | "code">;
