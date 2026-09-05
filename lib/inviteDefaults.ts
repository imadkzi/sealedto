/** Shared invite constants — safe to import from client components. */

export const DEFAULT_TEMPLATE_ID = "editorial";
export const DEFAULT_INTRO_LINE = "Together with their families";
export const DEFAULT_EVENT_LINE = "the wedding of";
export const DEFAULT_SAVE_THE_DATE_EVENT_LINE = "to save the date for";

export function defaultEventLine(mode?: "wedding" | "save_the_date") {
  return mode === "save_the_date"
    ? DEFAULT_SAVE_THE_DATE_EVENT_LINE
    : DEFAULT_EVENT_LINE;
}
