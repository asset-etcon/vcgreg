"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type NotificationType = "success" | "error" | "info";

const config: Record<
  NotificationType,
  { styles: string; icon: typeof CheckCircle2; iconColor: string }
> = {
  success: {
    styles: "border-emerald-200 bg-white text-slate-900",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
  },
  error: {
    styles: "border-red-200 bg-white text-slate-900",
    icon: AlertCircle,
    iconColor: "text-red-600",
  },
  info: {
    styles: "border-blue-200 bg-white text-slate-900",
    icon: Info,
    iconColor: "text-blue-600",
  },
};

export function Notification({
  message,
  type = "success",
}: {
  message: string;
  type?: NotificationType;
}) {
  return <Toast key={`${type}-${message}`} message={message} type={type} />;
}

function Toast({
  message,
  type,
}: {
  message: string;
  type: NotificationType;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 6000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  const { styles, icon: Icon, iconColor } = config[type];

  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg",
        styles,
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconColor)} />
      <p className="flex-1 text-sm text-slate-700">{message}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="rounded p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
