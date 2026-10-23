import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { DocumentTypeForm } from "@/components/document-types/document-type-form";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "New Document Type",
};

export default function NewDocumentTypePage() {
  return (
    <>
      <PageHeader
        title="New document type"
        description="Add a controlled category for grouping documents and prefixes."
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
      ) : (
        <div className="max-w-2xl">
          <DocumentTypeForm />
        </div>
      )}
    </>
  );
}
