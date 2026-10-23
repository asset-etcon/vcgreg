import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { CodeBadge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";
import { TableEmpty, TableWrapper, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { getDocumentType } from "@/lib/data/document-types";
import { listDocuments } from "@/lib/data/documents";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function generateMetadata({ params }: { params: Promise<{ typeId: string }> }): Promise<Metadata> {
  const { typeId } = await params;
  const { data } = await getDocumentType(typeId);
  return { title: data ? `${data.name} References` : "References" };
}

export default async function DocumentTypeReferencesPage({
  params,
}: {
  params: Promise<{ typeId: string }>;
}) {
  const { typeId } = await params;
  const [{ data: type, error: typeError }, { data: allDocuments, error: documentsError }] = await Promise.all([
    getDocumentType(typeId),
    listDocuments(),
  ]);
  const error = typeError ?? documentsError;
  const documents = allDocuments
    .filter((document) => document.document_type_id === typeId)
    .sort((a, b) => b.issue_year - a.issue_year || b.sequence_number - a.sequence_number);

  return (
    <>
      <PageHeader
        title={type ? `${type.name} References` : "Document Type References"}
        description={type ? `References issued under ${type.name}.` : "References for the selected document type."}
        actions={
          <div className="flex gap-2">
            <Link href="/references" className={buttonStyles({ variant: "outline" })}><ArrowLeft className="h-4 w-4" />All types</Link>
            <Link href="/generate-reference" className={buttonStyles()}><Plus className="h-4 w-4" />Generate reference</Link>
          </div>
        }
      />

      {!isSupabaseConfigured ? <SetupNotice /> : error ? (
        <Alert variant="error" title="Could not load references">{error}</Alert>
      ) : !type ? (
        <Alert variant="warning" title="Document type not found">
          This type may have been removed. Return to the list and choose another type.
        </Alert>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2"><CodeBadge>{type.code}</CodeBadge><span className="text-sm text-slate-500">{documents.length} {documents.length === 1 ? "reference" : "references"}</span></div>
          <TableWrapper>
            <THead><tr><TH>Reference</TH><TH>Title</TH><TH>Year</TH><TH>Status</TH><TH className="text-right">Details</TH></tr></THead>
            <TBody>
              {documents.length === 0 ? (
                <TableEmpty colSpan={5}><p className="font-medium text-slate-700">No references for this type yet.</p><p className="mt-1">Generate one to add it here.</p></TableEmpty>
              ) : documents.map((document) => (
                <TR key={document.id}>
                  <TD><div className="flex items-center gap-1"><span className="whitespace-nowrap font-mono text-xs font-semibold">{document.reference_number}</span><CopyButton value={document.reference_number} /></div></TD>
                  <TD>{document.title || "—"}</TD>
                  <TD>{document.issue_year}</TD>
                  <TD><StatusBadge status={document.status} /></TD>
                  <TD className="text-right"><Link href={`/documents/${document.id}/edit`} className="text-sm font-medium text-blue-800 hover:underline">View details</Link></TD>
                </TR>
              ))}
            </TBody>
          </TableWrapper>
        </>
      )}
    </>
  );
}
