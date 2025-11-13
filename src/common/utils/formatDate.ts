export function formatDate(input: string | Date) {
  const value = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(value);
}
