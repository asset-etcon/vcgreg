import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "error" | "warning";

const variants: Record<
  AlertVariant,
  { styles: string; icon: LucideIcon; iconColor: string }
> = {
  info: {
    styles: "border-blue-200 bg-blue-50 text-blue-950",
    icon: Info,
    iconColor: "text-blue-700",
  },
  success: {
    styles: "border-emerald-200 bg-emerald-50 text-emerald-950",
    icon: CheckCircle2,
    iconColor: "text-emerald-700",
  },
  error: {
    styles: "border-red-200 bg-red-50 text-red-950",
    icon: AlertCircle,
    iconColor: "text-red-700",
  },
  warning: {
    styles: "border-amber-200 bg-amber-50 text-amber-950",
    icon: TriangleAlert,
    iconColor: "text-amber-700",
  },
};

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: string;
};

export function Alert({
  variant = "info",
  title,
  className,
  children,
  ...props
}: AlertProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3 text-sm",
        config.styles,
        className,
      )}
      {...props}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.iconColor)} />
      <div className="space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="text-sm/6">{children}</div> : null}
      </div>
    </div>
  );
}
