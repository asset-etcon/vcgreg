"use client";

import {
  FilePlus2,
  Files,
  LayoutDashboard,
  Plus,
  Tags,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate-reference", label: "Generate Reference", icon: FilePlus2 },
  { href: "/references", label: "View References", icon: Files },
  { href: "/document-types", label: "Document Types", icon: Tags },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col bg-slate-900 text-slate-300 transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <Image
              src="/icon.jpeg"
              alt="Vethan Concepts logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-md object-contain bg-white"
              priority
            />
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-white">
                Vethan Concepts
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-slate-400">
                Document Reference
              </span>
            </span>
          </Link>
          <button
            type="button"
            className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-5">
          <Link
            href="/generate-reference"
            onClick={onClose}
            className={cn(
              buttonStyles({ variant: "primary", className: "w-full" }),
              "bg-amber-400 text-slate-950 hover:bg-amber-300 focus-visible:ring-amber-300 active:bg-amber-500",
            )}
          >
            <Plus className="h-4 w-4" />
            Generate reference
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-amber-400 bg-white/10 text-white"
                    : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <p className="text-[11px] uppercase tracking-widest text-slate-500">
            Internal use only
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Vethan Concepts Limited
          </p>
        </div>
      </aside>
    </>
  );
}
