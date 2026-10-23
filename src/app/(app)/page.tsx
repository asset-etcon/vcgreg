import type { Metadata } from "next";
import {
  ArrowRight,
  FileCheck2,
  FilePenLine,
  Files,
  Plus,
  Tags,
} from "lucide-react";
import Link from "next/link";

import { Alert } from "@/components/ui/alert";
import { StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";
import {
  TableEmpty,
  TableWrapper,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui/table";
import { getDashboardSummary } from "@/lib/data/documents";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { data, error } = await getDashboardSummary();

  const stats = [
    {
      label: "Registered documents",
      value: data.totalDocuments,
      icon: Files,
    },
    {
      label: "Document types",
      value: data.totalTypes,
      icon: Tags,
    },
    {
      label: "Drafts",
      value: data.draftCount,
      icon: FilePenLine,
    },
    {
      label: "Issued",
      value: data.issuedCount,
      icon: FileCheck2,
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of controlled document references and the document register."
        actions={
          <Link
            href="/generate-reference"
            className={buttonStyles({ className: "shadow-sm" })}
          >
            <Plus className="h-4 w-4" />
            Generate reference
          </Link>
        }
      />

      {!isSupabaseConfigured ? <SetupNotice /> : null}

      {error ? (
        <Alert variant="error" title="Could not load dashboard data">
          {error}
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                  {stat.label}
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:mt-3 sm:text-3xl">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Recent documents
            </h2>
            <Link
              href="/documents"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-800 hover:text-blue-900"
            >
              View register
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <TableWrapper>
            <THead>
              <tr>
                <TH>Reference</TH>
                <TH>Title</TH>
                <TH>Status</TH>
                <TH>Issue date</TH>
              </tr>
            </THead>
            <TBody>
              {data.recentDocuments.length === 0 ? (
                <TableEmpty colSpan={4}>
                  <p className="font-medium text-slate-700">
                    No documents registered yet.
                  </p>
                  <p className="mt-1">
                    Generate a reference to add the first controlled document.
                  </p>
                  <Link
                    href="/generate-reference"
                    className={buttonStyles({
                      size: "sm",
                      className: "mt-4",
                    })}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Generate reference
                  </Link>
                </TableEmpty>
              ) : (
                data.recentDocuments.map((document) => (
                  <TR key={document.id}>
                    <TD>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs font-medium text-slate-900">
                          {document.reference_number}
                        </span>
                        <CopyButton
                          value={document.reference_number}
                          label="Copy reference number"
                        />
                      </div>
                    </TD>
                    <TD>
                      <Link
                        href={`/documents/${document.id}/edit`}
                        className="font-medium text-slate-900 hover:text-blue-800"
                      >
                        {document.title}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {document.document_types?.name ?? "Unknown type"}
                      </p>
                    </TD>
                    <TD>
                      <StatusBadge status={document.status} />
                    </TD>
                    <TD className="whitespace-nowrap text-sm text-slate-500">
                      {formatDate(document.issue_date)}
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </TableWrapper>
        </section>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Quick actions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Common tasks for maintaining the register.
          </p>
          <div className="mt-4 space-y-2">
            <Link
              href="/generate-reference"
              className={buttonStyles({ className: "w-full justify-start" })}
            >
              <Plus className="h-4 w-4" />
              Generate reference
            </Link>
            <Link
              href="/documents"
              className={buttonStyles({
                variant: "outline",
                className: "w-full justify-start",
              })}
            >
              <Files className="h-4 w-4" />
              Open document register
            </Link>
            <Link
              href="/document-types"
              className={buttonStyles({
                variant: "outline",
                className: "w-full justify-start",
              })}
            >
              <Tags className="h-4 w-4" />
              Manage document types
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
