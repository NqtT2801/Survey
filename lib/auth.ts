/**
 * Edge-runtime-safe auth helpers using the Web Crypto API.
 * Used both by Next.js middleware (Edge) and by Node API routes.
 */

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function getSecret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set (>= 16 chars).");
  }
  return s;
}

function bufToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

async function hmacHex(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return bufToHex(sig);
}

function constantTimeStrEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let acc = 0;
  for (let i = 0; i < a.length; i++) {
    acc |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return acc === 0;
}

export async function makeAdminCookieValue(): Promise<string> {
  const payload = `admin.${Date.now()}`;
  const sig = await hmacHex(payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminCookieValue(
  value: string | undefined,
): Promise<boolean> {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [role, ts, sig] = parts;
  if (role !== "admin") return false;
  const expected = await hmacHex(`${role}.${ts}`);
  return constantTimeStrEqual(sig, expected);
}

export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not set.");
  return constantTimeStrEqual(input, expected);
}

export const ADMIN_COOKIE = {
  name: COOKIE_NAME,
  maxAge: COOKIE_MAX_AGE,
};
