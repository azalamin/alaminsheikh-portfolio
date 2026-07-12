"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Fires a server action, then toasts the result. For actions that never redirect. */
export function ActionButton({
  action,
  successMessage,
  errorMessage = "Something went wrong. Please try again.",
  children,
  ...buttonProps
}: {
  action: () => Promise<void>;
  successMessage: string;
  errorMessage?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Button>, "onClick" | "disabled">) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      {...buttonProps}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            await action();
            toast.success(successMessage);
          } catch {
            toast.error(errorMessage);
          }
        });
      }}
    >
      {children}
    </Button>
  );
}
