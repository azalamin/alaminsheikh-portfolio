import { z } from "zod";
import { checkboxBoolean, optionalUrl } from "./shared";

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  summary: z.string().trim().min(1, "Summary is required").max(500),
  content: z.string().trim().min(1, "Content is required"),
  coverImage: optionalUrl(),
  techStack: z.preprocess(
    (value) =>
      typeof value === "string"
        ? value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : value,
    z.array(z.string())
  ),
  liveUrl: optionalUrl(),
  featured: checkboxBoolean,
  published: checkboxBoolean,
  order: z.coerce.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;
