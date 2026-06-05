/**
 * Converts a Zod SafeParseError result into a flat field-error map.
 *
 * Usage:
 *   const result = schema.safeParse(formData);
 *   if (!result.success) {
 *     setFieldErrors(parseZodErrors(result));
 *     return;
 *   }
 *
 * @param {import("zod").SafeParseError<any>} zodResult
 * @returns {{ [fieldKey: string]: string }}
 */
export function parseZodErrors(zodResult) {
  const errors = {};
  zodResult.error.issues.forEach((issue) => {
    errors[issue.path[0]] = issue.message;
  });
  return errors;
}
