import type { Metadata } from "next";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { Alert } from "@/components/ui/alert";
import { CodeBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
import { deleteDocumentType } from "@/lib/actions/document-types";
import { listDocumentTypes } from "@/lib/data/document-types";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Document Types",
};

const notices: Record<
  string,
  { message: string; type: "success" | "error" | "info" }
> = {
  created: {
    message: "Document type created.",
    type: "success",
  },
  updated: {
    message: "Document type updated.",
    type: "success",
  },
  deleted: {
    message: "Document type deleted.",
    type: "success",
  },
  "in-use": {
    message:
      "This document type is used by registered documents and cannot be deleted.",
    type: "error",
  },
  "delete-failed": {
    message: "The document type could not be deleted. Please try again.",
    type: "error",
  },
  setup: {
    message: "Supabase is not configured yet.",
    type: "error",
  },
};

export default async function DocumentTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const [{ data: documentTypes, error }, params] = await Promise.all([
    listDocumentTypes(),
    searchParams,
  ]);
  const notice = params.notice ? notices[params.notice] : undefined;

  return (
    <>
      <PageHeader
        title="Document Types"
        description="Manage the document categories used to prefix reference numbers."
        actions={
          <Link
            href="/document-types/new"
            className={buttonStyles()}
          >
            <Plus className="h-4 w-4" />
            New document type
          </Link>
        }
      />

      {error ? (
        <Alert variant="error" title="Could not load document types">
          {error}
        </Alert>
      ) : null}

      <TableWrapper>
        <THead>
          <tr>
            <TH>Document type</TH>
            <TH>Code</TH>
            <TH>Description</TH>
            <TH>Last updated</TH>
            <TH className="text-right">Actions</TH>
          </tr>
        </THead>
        <TBody>
          {documentTypes.length === 0 ? (
            <TableEmpty colSpan={5}>
              <p className="font-medium text-slate-700">
                No document types yet.
              </p>
              <p className="mt-1">
                Create a type to start generating reference numbers.
              </p>
              <Link
                href="/document-types/new"
                className={buttonStyles({ size: "sm", className: "mt-4" })}
              >
                <Plus className="h-3.5 w-3.5" />
                New document type
              </Link>
            </TableEmpty>
          ) : (
            documentTypes.map((type) => (
              <TR key={type.id}>
                <TD>
                  <p className="font-medium text-slate-900">{type.name}</p>
                </TD>
                <TD>
                  <CodeBadge>{type.code}</CodeBadge>
                </TD>
                <TD className="max-w-md">
                  <p className="line-clamp-2 text-sm text-slate-500">
                    {type.description || "—"}
                  </p>
                </TD>
                <TD className="whitespace-nowrap text-xs text-slate-500">
                  {formatDateTime(type.updated_at)}
                </TD>
                <TD>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/document-types/${type.id}/edit`}
                      className={buttonStyles({
                        variant: "ghost",
                        size: "sm",
                      })}
                      aria-label={`Edit ${type.name}`}
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
                      title={`Delete ${type.name}?`}
                      description="This permanently removes the document type. Types already used by documents cannot be deleted."
                      action={deleteDocumentType}
                      hiddenFields={{ id: type.id }}
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
