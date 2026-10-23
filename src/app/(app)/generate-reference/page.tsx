import type { Metadata } from "next";
import { Tags } from "lucide-react";
import Link from "next/link";

import { GenerateReferenceForm } from "@/components/documents/generate-reference-form";
import { Alert } from "@/components/ui/alert";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";
import { listDocumentTypes } from "@/lib/data/document-types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Generate Reference",
};

export default async function GenerateReferencePage() {
  const { data: documentTypes, error } = await listDocumentTypes();
  const now = new Date();

  return (
    <>
      <PageHeader
        title="Generate Reference"
        description="Assign the next controlled reference number and add the document to the register."
      />

      {!isSupabaseConfigured ? (
        <SetupNotice />
      ) : error ? (
        <Alert variant="error" title="Could not load document types">
          {error}
        </Alert>
      ) : documentTypes.length === 0 ? (
        <Alert
          variant="warning"
          title="Create a document type first"
          className="items-start"
        >
          <p>
            Reference numbers use the document type code as their prefix. Add
            at least one document type before generating a reference.
          </p>
          <Link
            href="/document-types/new"
            className={buttonStyles({
              size: "sm",
              className: "mt-3",
            })}
          >
            <Tags className="h-3.5 w-3.5" />
            Create document type
          </Link>
        </Alert>
      ) : (
        <GenerateReferenceForm
          documentTypes={documentTypes}
          year={now.getFullYear()}
          today={now.toISOString().slice(0, 10)}
        />
      )}
    </>
  );
}
