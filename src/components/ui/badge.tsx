import type { DocumentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<DocumentStatus, string> = {
  issued: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  cancelled: "bg-slate-100 text-slate-500 ring-slate-200",
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
}

export function CodeBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
      {children}
    </span>
  );
}
