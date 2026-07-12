import { z } from "zod";
import { checkboxBoolean, optionalTrimmedString } from "./shared";

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(1, "Client name is required").max(200),
  clientRole: optionalTrimmedString(200),
  content: z.string().trim().min(1, "Testimonial content is required").max(2000),
  rating: z.coerce.number().int().min(1, "Rating must be 1-5").max(5, "Rating must be 1-5"),
  published: checkboxBoolean,
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
