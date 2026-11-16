export function normalize(text: string): string {
  if (!text) return "";
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

