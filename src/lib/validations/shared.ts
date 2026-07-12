import { z } from "zod";

/** HTML checkboxes are omitted from FormData when unchecked. */
export const checkboxBoolean = z.preprocess(
  (value) => value === "on" || value === true,
  z.boolean()
);

/** Optional text inputs submit "" rather than omitting the field. */
export function optionalTrimmedString(max: number) {
  return z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.string().trim().max(max).optional()
  );
}

export function optionalUrl() {
  return z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.url("Enter a valid URL").optional()
  );
}
