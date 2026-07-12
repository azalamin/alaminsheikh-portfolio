"use client";

import { useActionState } from "react";
import type { ContentFormState } from "@/actions/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function ServiceForm({
  action,
  defaultValues,
  submitLabel = "Save",
}: {
  action: (state: ContentFormState, formData: FormData) => Promise<ContentFormState>;
  defaultValues?: {
    title: string;
    description: string;
    published: boolean;
    order: number;
  };
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-xl">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={defaultValues?.title} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div className="flex flex-col gap-2">
          <Label htmlFor="order">Order</Label>
          <Input id="order" name="order" type="number" defaultValue={defaultValues?.order ?? 0} />
        </div>
        <Label htmlFor="published" className="flex items-center gap-2 font-normal pb-2">
          <Checkbox id="published" name="published" defaultChecked={defaultValues?.published} />
          Published
        </Label>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
