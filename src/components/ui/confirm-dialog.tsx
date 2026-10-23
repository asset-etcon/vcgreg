"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Button, type ButtonVariant } from "./button";
import { SubmitButton } from "./submit-button";

type ConfirmDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  action: (formData: FormData) => void | Promise<void>;
  hiddenFields?: Record<string, string>;
  triggerVariant?: ButtonVariant;
  triggerClassName?: string;
};

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Delete",
  action,
  hiddenFields,
  triggerVariant = "ghost",
  triggerClassName,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        className={triggerClassName}
        onClick={() => setOpen(true)}
      >
        {trigger}
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-slate-900/50"
            aria-label="Close dialog"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2
              id="confirm-dialog-title"
              className="text-lg font-semibold text-slate-900"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>

            <form action={action} className="mt-6">
              {Object.entries(hiddenFields ?? {}).map(([name, value]) => (
                <input key={name} type="hidden" name={name} value={value} />
              ))}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <SubmitButton variant="danger" pendingLabel="Deleting…">
                  {confirmLabel}
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
