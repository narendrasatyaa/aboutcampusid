export const FOLLOW_TARGET_ACCOUNT = "aboutcampus";
export const REQUIRED_FOLLOW_COUNT = 25;
export const REQUIRED_LIKE_COUNT = 20;

export function parsePastedList(input) {
  return (input || "")
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeInstagramHandle(value) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\/instagram\.com\//, "")
    .replace(/^@+/, "")
    .replace(/\/$/, "")
    .trim();
}
