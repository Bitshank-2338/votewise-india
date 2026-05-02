export function sanitize(text: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/\0/g, "")      // Remove null bytes
    .trim();
}
