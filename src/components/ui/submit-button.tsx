"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button, type ButtonVariant } from "./button";
import { Spinner } from "./spinner";

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "primary",
  className,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: ButtonVariant;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      className={className}
      disabled={pending}
    >
      {pending ? <Spinner /> : null}
      {pending ? pendingLabel : children}
    </Button>
  );
}
