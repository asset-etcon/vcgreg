import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileStack, Plus } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { CodeBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";
import { listAllDocumentTypes } from "@/lib/data/document-types";
import { listDocuments } from "@/lib/data/documents";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "View References" };

export default async function ReferencesPage() {
  const [{ data: types, error: typeError }, { data: documents, error: documentError }] = await Promise.all([
    listAllDocumentTypes(),
    listDocuments(),
  ]);
  const error = typeError ?? documentError;

  return (
    <>
      <PageHeader
        title="View References"
        description="Choose a document type to browse its references."
        actions={<Link href="/generate-reference" className={buttonStyles()}><Plus className="h-4 w-4" />Generate reference</Link>}
      />

      {!isSupabaseConfigured ? <SetupNotice /> : error ? (
        <Alert variant="error" title="Could not load document types">{error}</Alert>
      ) : types.length === 0 ? (
        <Alert variant="info" title="No document types yet">
          Add a document type before you can browse references.
        </Alert>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {types.map((type) => {
            const count = documents.filter((document) => document.document_type_id === type.id).length;
            return (
              <Link
                key={type.id}
                href={`/references/${type.id}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-slate-900 group-hover:text-blue-800">{type.name}</h2>
                    <div className="mt-2"><CodeBadge>{type.code}</CodeBadge></div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
                </div>
                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <FileStack className="h-4 w-4" />
                  <span>{count} {count === 1 ? "reference" : "references"}</span>
                  {!type.is_active ? <span className="ml-auto text-xs">Inactive</span> : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
