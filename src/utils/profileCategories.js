export const PROFESSIONAL_CATEGORIES = [
  "Technology",
  "Creative & Design",
  "Business",
  "Marketing",
  "Data & Analytics",
  "Writing & Content",
  "Finance",
  "Engineering",
  "Media & Production",
  "Research",
];

export function parseProfileList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}
