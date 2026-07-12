"use client";

import { useActionState } from "react";
import type { VideoProjectFormState } from "@/actions/video-projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Editor = { id: string; name: string; email: string };

export function VideoProjectForm({
  action,
  editors,
  defaultValues,
  submitLabel = "Save",
}: {
  action: (
    state: VideoProjectFormState,
    formData: FormData
  ) => Promise<VideoProjectFormState>;
  editors: Editor[];
  defaultValues?: {
    title: string;
    description: string;
    amount: string;
    deadline: string;
    editorId: string | null;
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
          defaultValue={defaultValues?.description}
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="amount">Agreed amount (USD)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.amount}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            defaultValue={defaultValues?.deadline}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="editorId">Assign to editor</Label>
        <Select name="editorId" defaultValue={defaultValues?.editorId ?? undefined}>
          <SelectTrigger id="editorId" className="w-full">
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            {editors.map((editor) => (
              <SelectItem key={editor.id} value={editor.id}>
                {editor.name} ({editor.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
