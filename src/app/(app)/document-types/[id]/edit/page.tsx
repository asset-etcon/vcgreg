import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocumentTypeForm } from "@/components/document-types/document-type-form";
import { Alert } from "@/components/ui/alert";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";
import { getDocumentType } from "@/lib/data/document-types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Edit Document Type",
};

export default async function EditDocumentTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: documentType, error } = await getDocumentType(id);

  if (isSupabaseConfigured && !error && !documentType) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit document type"
        description="Update the category name, code, or description."
        actions={
          <Link
            href="/document-types"
            className={buttonStyles({ variant: "outline" })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to document types
          </Link>
        }
      />

      {!isSupabaseConfigured ? (
        <SetupNotice />
      ) : error ? (
        <Alert variant="error" title="Could not load document type">
          {error}
        </Alert>
      ) : documentType ? (
        <div className="max-w-2xl">
          <DocumentTypeForm documentType={documentType} />
        </div>
      ) : null}
    </>
  );
}
