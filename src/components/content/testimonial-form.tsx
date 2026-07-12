"use client";

import { useActionState } from "react";
import type { ContentFormState } from "@/actions/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function TestimonialForm({
  action,
  defaultValues,
  submitLabel = "Save",
}: {
  action: (state: ContentFormState, formData: FormData) => Promise<ContentFormState>;
  defaultValues?: {
    clientName: string;
    clientRole: string | null;
    content: string;
    rating: number;
    published: boolean;
  };
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="clientName">Client name</Label>
          <Input
            id="clientName"
            name="clientName"
            defaultValue={defaultValues?.clientName}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="clientRole">Client role / company</Label>
          <Input
            id="clientRole"
            name="clientRole"
            defaultValue={defaultValues?.clientRole ?? undefined}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Testimonial</Label>
        <Textarea
          id="content"
          name="content"
          rows={4}
          defaultValue={defaultValues?.content}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div className="flex flex-col gap-2">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={defaultValues?.rating ?? 5}
            required
          />
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
