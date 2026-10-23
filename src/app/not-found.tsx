import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <FileQuestion className="mx-auto h-10 w-10 text-slate-400" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The page or record you are looking for does not exist.
        </p>
        <Link
          href="/"
          className={buttonStyles({ className: "mt-6" })}
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
