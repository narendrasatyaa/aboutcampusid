import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getAdminDashboardKey() {
  return process.env.ADMIN_DASHBOARD_KEY || "";
}

function signPayload(payload) {
  const key = getAdminDashboardKey();
  if (!key) return "";
  return crypto.createHmac("sha256", key).update(payload).digest("hex");
}

function safeEqual(a, b) {
  const left = Buffer.from(a || "");
  const right = Buffer.from(b || "");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function verifyAdminKeyValue(rawKey) {
  const envKey = getAdminDashboardKey();
  if (!envKey) {
    return { ok: false, message: "ADMIN_DASHBOARD_KEY belum diatur" };
  }

  if (!rawKey || rawKey !== envKey) {
    return { ok: false, message: "Admin key tidak valid" };
  }

  return { ok: true };
}

export function createAdminSessionToken() {
  const issuedAt = Date.now().toString();
  const signature = signPayload(issuedAt);
  return `${issuedAt}.${signature}`;
}

export function verifyAdminSessionToken(token) {
  const envKey = getAdminDashboardKey();
  if (!envKey) return false;
  if (!token || !token.includes(".")) return false;

  const [issuedAtRaw, signature] = token.split(".");
  if (!issuedAtRaw || !signature) return false;

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;

  const tokenAgeSeconds = Math.floor((Date.now() - issuedAt) / 1000);
  if (tokenAgeSeconds < 0 || tokenAgeSeconds > ADMIN_SESSION_MAX_AGE_SECONDS) {
    return false;
  }

  const expected = signPayload(issuedAtRaw);
  return safeEqual(signature, expected);
}

export function getAdminSessionCookieConfig() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}
