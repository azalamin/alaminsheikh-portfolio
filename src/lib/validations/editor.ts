import { z } from "zod";

export const createEditorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.email(),
});

export type CreateEditorInput = z.infer<typeof createEditorSchema>;
