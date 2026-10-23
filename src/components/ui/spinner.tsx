import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("h-4 w-4 animate-spin", className)}
      aria-hidden="true"
    />
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-16 text-sm text-slate-500 shadow-sm"
    >
      <Spinner className="h-4 w-4 text-blue-800" />
      <span>{label}</span>
    </div>
  );
}
