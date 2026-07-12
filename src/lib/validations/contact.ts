import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.email("Enter a valid email"),
  message: z.string().trim().min(10, "Tell me a bit more about the project").max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;
