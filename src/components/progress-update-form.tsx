"use client";

import { useActionState } from "react";
import { postProgressUpdateAction } from "@/actions/progress-updates";
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
import type { VideoStatus } from "@/generated/prisma/enums";

const statusOptions: { value: VideoStatus; label: string }[] = [
  { value: "NOT_STARTED", label: "Not started" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "COMPLETED", label: "Completed" },
];

export function ProgressUpdateForm({
  videoProjectId,
  currentStatus,
  currentProgress,
  currentEstCompletion,
}: {
  videoProjectId: string;
  currentStatus: VideoStatus;
  currentProgress: number;
  currentEstCompletion: Date | null;
}) {
  const [state, formAction, pending] = useActionState(
    postProgressUpdateAction.bind(null, videoProjectId),
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={currentStatus}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            name="progress"
            type="number"
            min={0}
            max={100}
            defaultValue={currentProgress}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="estCompletion">Estimated completion</Label>
        <Input
          id="estCompletion"
          name="estCompletion"
          type="date"
          defaultValue={currentEstCompletion?.toISOString().slice(0, 10)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="note">Progress note</Label>
        <Textarea
          id="note"
          name="note"
          rows={3}
          placeholder="e.g. Color grading done, sound design remaining"
          required
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Posting…" : "Post update"}
      </Button>
    </form>
  );
}
