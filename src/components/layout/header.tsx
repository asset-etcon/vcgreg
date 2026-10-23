"use client";

import { Menu } from "lucide-react";

import { AccountMenu } from "./account-menu";

export function Header({
  email,
  onMenuClick,
}: {
  email: string | null;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-slate-200 bg-white/95 px-3 backdrop-blur sm:gap-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="-ml-1 shrink-0 rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-900 sm:text-base">
            VCL Document Reference Generator
          </p>
          <p className="hidden text-xs text-slate-500 sm:block">
            Controlled document register
          </p>
        </div>
      </div>

      <AccountMenu email={email} />
    </header>
  );
}
