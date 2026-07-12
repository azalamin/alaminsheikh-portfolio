import { z } from "zod";
import { checkboxBoolean } from "./shared";

export const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(2000),
  published: checkboxBoolean,
  order: z.coerce.number().int().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
