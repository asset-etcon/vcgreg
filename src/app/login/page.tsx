import type { Metadata } from "next";
import { FileCheck2, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";

import { LoginForm } from "@/components/layout/login-form";
import { SetupNotice } from "@/components/ui/setup-notice";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  if (isSupabaseConfigured) {
    const user = await getCurrentUser();

    if (user) {
      redirect("/");
    }
  }

  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-10 lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-800/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <Image src="/icon.jpeg" alt="Vethan Concepts logo" width={44} height={44} className="h-11 w-11 rounded-md bg-white object-contain" priority />
          <div>
            <p className="text-sm font-semibold text-white">
              Vethan Concepts Limited
            </p>
            <p className="text-[11px] uppercase tracking-widest text-slate-400">
              Document Reference Generator
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-3xl font-semibold leading-tight text-white">
            Controlled document references, recorded with confidence.
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Generate consistent reference numbers, maintain the document
            register, and keep document types organised in one internal
            workspace.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-3">
              <FileCheck2 className="h-4 w-4 text-amber-400" />
              Automatic, sequential reference numbering
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Private access for authorised administrators
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-slate-500">
          Internal use only · Vethan Concepts Limited
        </p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Image src="/icon.jpeg" alt="Vethan Concepts logo" width={40} height={40} className="h-10 w-10 rounded-md bg-white object-contain" priority />
            <h1 className="mt-4 text-xl font-semibold text-slate-900">
              Document Reference Generator
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Vethan Concepts Limited
            </p>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-slate-900">
              Administrator sign in
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Use the administrator account created in Supabase.
            </p>
          </div>

          <div className="mt-6">
            {isSupabaseConfigured ? (
              <LoginForm />
            ) : (
              <div className="space-y-4">
                <SetupNotice compact />
                <p className="text-sm text-slate-500">
                  Once Supabase is configured, reload this page to sign in with
                  the administrator account.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
