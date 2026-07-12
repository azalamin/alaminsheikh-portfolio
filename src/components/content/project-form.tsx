"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ContentFormState } from "@/actions/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function ProjectForm({
  action,
  defaultValues,
  submitLabel = "Save",
  successMessage = "Project saved.",
}: {
  action: (state: ContentFormState, formData: FormData) => Promise<ContentFormState>;
  defaultValues?: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    coverImage: string | null;
    techStack: string[];
    liveUrl: string | null;
    featured: boolean;
    published: boolean;
    order: number;
  };
  submitLabel?: string;
  successMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const router = useRouter();

  useEffect(() => {
    if (!state) return;
    if ("error" in state) {
      toast.error(state.error);
    } else if (state.success) {
      toast.success(successMessage);
      router.push("/admin/projects");
    }
  }, [state, router, successMessage]);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={defaultValues?.title} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="real-estate-management-system"
            defaultValue={defaultValues?.slug}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          rows={2}
          defaultValue={defaultValues?.summary}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Content (Markdown)</Label>
        <Textarea
          id="content"
          name="content"
          rows={10}
          defaultValue={defaultValues?.content}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="coverImage">Cover image URL</Label>
          <Input
            id="coverImage"
            name="coverImage"
            type="url"
            defaultValue={defaultValues?.coverImage ?? undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            name="liveUrl"
            type="url"
            defaultValue={defaultValues?.liveUrl ?? undefined}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="techStack">Tech stack (comma-separated)</Label>
        <Input
          id="techStack"
          name="techStack"
          placeholder="Next.js, Prisma, PostgreSQL"
          defaultValue={defaultValues?.techStack.join(", ")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div className="flex flex-col gap-2">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={defaultValues?.order ?? 0}
          />
        </div>
        <div className="flex gap-6 pb-2">
          <Label htmlFor="featured" className="flex items-center gap-2 font-normal">
            <Checkbox id="featured" name="featured" defaultChecked={defaultValues?.featured} />
            Featured
          </Label>
          <Label htmlFor="published" className="flex items-center gap-2 font-normal">
            <Checkbox id="published" name="published" defaultChecked={defaultValues?.published} />
            Published
          </Label>
        </div>
      </div>

      {state && "error" in state && (
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
