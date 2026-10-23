import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export function TableWrapper({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
        <table className="block w-full border-collapse text-left text-sm md:table md:min-w-[720px]">
          {children}
        </table>
      </div>
    </div>
  );
}

export function THead({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "hidden border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 md:table-header-group",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className="block divide-y divide-slate-100 md:table-row-group"
      {...props}
    />
  );
}

export function TR({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "block border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/80 md:table-row md:border-0",
        className,
      )}
      {...props}
    />
  );
}

export function TH({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn("px-4 py-3 font-semibold", className)}
      {...props}
    />
  );
}

export function TD({
  className,
  label,
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { label?: string }) {
  return (
    <td
      className={cn(
        "px-4 py-3.5 align-middle text-slate-700",
        label && "max-md:block max-md:px-4 max-md:py-2.5",
        className,
      )}
      {...props}
    >
      {label ? (
        <div className="flex items-start justify-between gap-3 md:block">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 md:hidden">
            {label}
          </span>
          <div className="min-w-0 max-md:flex-1 max-md:text-right">
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </td>
  );
}

export function TableEmpty({
  colSpan,
  children,
}: {
  colSpan: number;
  children: ReactNode;
}) {
  return (
    <tr className="block md:table-row">
      <td
        colSpan={colSpan}
        className="block px-6 py-10 text-center text-sm text-slate-500 md:table-cell md:py-12"
      >
        {children}
      </td>
    </tr>
  );
}
