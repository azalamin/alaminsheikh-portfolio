import { z } from "zod";
import { VideoStatus } from "@/generated/prisma/enums";

const videoStatusValues = Object.values(VideoStatus) as [string, ...string[]];

export const videoProjectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(5000),
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(99_999_999.99, "Amount is too large"),
  deadline: z.coerce.date("Enter a valid deadline"),
  editorId: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.string().trim().min(1).optional()
  ),
});

export type VideoProjectInput = z.infer<typeof videoProjectSchema>;

export const progressUpdateSchema = z.object({
  status: z.enum(videoStatusValues as [VideoStatus, ...VideoStatus[]]),
  progress: z.coerce.number().int().min(0).max(100),
  estCompletion: z.preprocess(
    (value) => (value === "" || value == null ? null : value),
    z.coerce.date("Enter a valid date").nullable()
  ),
  note: z.string().trim().min(1, "Add a note about this update").max(2000),
});

export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;
