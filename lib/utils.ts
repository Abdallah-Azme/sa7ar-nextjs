import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { decode } from "he"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Strip HTML tags and decode entities (e.g. &quot; → ") for plain-text display. */
export function htmlToPlainText(html: string): string {
  const stripped = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  return decode(stripped)
}
