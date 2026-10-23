import type { Metadata } from "next";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { Alert } from "@/components/ui/alert";
import { CodeBadge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CopyButton } from "@/components/ui/copy-button";
import { Notification } from "@/components/ui/notification";
import { PageHeader } from "@/components/ui/page-header";
import {
  TableEmpty,
  TableWrapper,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui/table";
import { deleteDocument } from "@/lib/actions/documents";
import { listDocuments } from "@/lib/data/documents";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Document Register",
};

const notices: Record<
  string,
  { message: string; type: "success" | "error" | "info" }
> = {
  updated: {
    message: "Document updated.",
    type: "success",
  },
  deleted: {
    message: "Document removed from the register.",
    type: "success",
  },
  "delete-failed": {
    message: "The document could not be deleted. Please try again.",
    type: "error",
  },
  setup: {
    message: "Supabase is not configured yet.",
    type: "error",
  },
};

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; reference?: string }>;
}) {
  const [{ data: documents, error }, params] = await Promise.all([
    listDocuments(),
    searchParams,
  ]);

  const notice =
    params.notice === "created" && params.reference
      ? {
          message: `Reference ${params.reference} generated and added to the register.`,
          type: "success" as const,
        }
      : params.notice
        ? notices[params.notice]
        : undefined;

  return (
    <>
      <PageHeader
        title="Document Register"
        description="The controlled register of documents and their reference numbers."
        actions={
          <Link
            href="/generate-reference"
            className={buttonStyles()}
          >
            <Plus className="h-4 w-4" />
            Generate reference
          </Link>
        }
      />

      {error ? (
        <Alert variant="error" title="Could not load the document register">
          {error}
        </Alert>
      ) : null}

      <TableWrapper>
        <THead>
          <tr>
            <TH>Reference</TH>
            <TH>Document</TH>
            <TH>Type</TH>
            <TH>Version</TH>
            <TH>Status</TH>
            <TH>Issue date</TH>
            <TH className="text-right">Actions</TH>
          </tr>
        </THead>
        <TBody>
          {documents.length === 0 ? (
            <TableEmpty colSpan={7}>
              <p className="font-medium text-slate-700">
                No documents in the register yet.
              </p>
              <p className="mt-1">
                Generate a reference to add the first controlled document.
              </p>
              <Link
                href="/generate-reference"
                className={buttonStyles({ size: "sm", className: "mt-4" })}
              >
                <Plus className="h-3.5 w-3.5" />
                Generate reference
              </Link>
            </TableEmpty>
          ) : (
            documents.map((document) => (
              <TR key={document.id}>
                <TD>
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap font-mono text-xs font-semibold text-slate-900">
                      {document.reference_number}
                    </span>
                    <CopyButton value={document.reference_number} />
                  </div>
                </TD>
                <TD className="max-w-xs">
                  <Link
                    href={`/documents/${document.id}/edit`}
                    className="line-clamp-2 font-medium text-slate-900 hover:text-blue-800"
                  >
                    {document.title}
                  </Link>
                  {document.owner ? (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {document.owner}
                    </p>
                  ) : null}
                </TD>
                <TD>
                  <div className="flex items-center gap-2">
                    <CodeBadge>
                      {document.document_types?.code ?? "—"}
                    </CodeBadge>
                    <span className="hidden max-w-[140px] truncate text-xs text-slate-500 xl:inline">
                      {document.document_types?.name ?? "Unknown type"}
                    </span>
                  </div>
                </TD>
                <TD className="whitespace-nowrap text-sm text-slate-600">
                  {document.version}
                </TD>
                <TD>
                  <StatusBadge status={document.status} />
                </TD>
                <TD className="whitespace-nowrap text-sm text-slate-500">
                  {formatDate(document.issue_date)}
                </TD>
                <TD>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/documents/${document.id}/edit`}
                      className={buttonStyles({
                        variant: "ghost",
                        size: "sm",
                      })}
                      aria-label={`Edit ${document.reference_number}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <ConfirmDialog
                      trigger={
                        <>
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </>
                      }
                      triggerVariant="ghost"
                      triggerClassName="text-red-600 hover:bg-red-50 hover:text-red-700"
                      title={`Delete ${document.reference_number}?`}
                      description={`This permanently removes "${document.title}" from the register. This action cannot be undone.`}
                      action={deleteDocument}
                      hiddenFields={{ id: document.id }}
                    />
                  </div>
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </TableWrapper>

      {notice ? (
        <Notification message={notice.message} type={notice.type} />
      ) : null}
    </>
  );
}
