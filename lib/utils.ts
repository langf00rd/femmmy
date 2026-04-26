/**
 * returns a readable date string from an ISO date string
 * eg April 1, 2026
 * @param isoDate
 */
export function isoToReadable(
  isoDate: string | null,
  opts?: {
    format?: "mm-yy" | "mm-dd";
  },
): string {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  if (opts?.format === "mm-yy") {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  if (opts?.format === "mm-dd") {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
