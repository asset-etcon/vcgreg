import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocumentForm } from "@/components/documents/document-form";
import { Alert } from "@/components/ui/alert";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";
import { listDocumentTypes } from "@/lib/data/document-types";
import { getDocument } from "@/lib/data/documents";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Edit Document",
};

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data: document, error }, typesResult] = await Promise.all([
    getDocument(id),
    listDocumentTypes(),
  ]);

  if (isSupabaseConfigured && !error && !document) {
    notFound();
  }

  const loadError = error ?? typesResult.error;

  return (
    <>
      <PageHeader
        title="Edit document"
        description="Update the register entry. Reference numbers are fixed at creation."
        actions={
          <Link
            href="/documents"
            className={buttonStyles({ variant: "outline" })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to register
          </Link>
        }
      />

      {!isSupabaseConfigured ? (
        <SetupNotice />
      ) : loadError ? (
        <Alert variant="error" title="Could not load the document">
          {loadError}
        </Alert>
      ) : document ? (
        <div className="max-w-3xl">
          <DocumentForm document={document} documentTypes={typesResult.data} />
        </div>
      ) : null}
    </>
  );
}
