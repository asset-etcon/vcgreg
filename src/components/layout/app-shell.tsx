"use client";

import { useState, type ReactNode } from "react";

import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppShell({
  email,
  children,
}: {
  email: string | null;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-50 lg:grid lg:grid-cols-[16rem_1fr]">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-col">
        <Header email={email} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full min-w-0 max-w-6xl space-y-5 sm:space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
