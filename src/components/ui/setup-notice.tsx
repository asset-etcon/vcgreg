import { Database, KeyRound, UserRound } from "lucide-react";

export function SetupNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Supabase is not configured. Add your project URL and anon key to{" "}
        <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-xs">
          .env.local
        </code>{" "}
        to enable authentication and data storage.
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <Database className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <h2 className="text-base font-semibold text-amber-950">
            Connect Supabase to get started
          </h2>
          <p className="mt-1 text-sm text-amber-900">
            The interface is ready. Complete these three steps to turn on
            authentication and document storage.
          </p>
          <ol className="mt-4 space-y-3 text-sm text-amber-950">
            <li className="flex gap-3">
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <span>
                Copy{" "}
                <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-xs">
                  .env.example
                </code>{" "}
                to{" "}
                <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-xs">
                  .env.local
                </code>{" "}
                and add your Supabase project URL and anon key.
              </span>
            </li>
            <li className="flex gap-3">
              <Database className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <span>
                Run{" "}
                <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-xs">
                  supabase/schema.sql
                </code>{" "}
                in the Supabase SQL editor.
              </span>
            </li>
            <li className="flex gap-3">
              <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <span>
                Create the administrator account under Authentication &gt;
                Users, then sign in.
              </span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
