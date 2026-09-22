import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET ?? "global-date-dev-secret";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24;

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be configured in production.");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derivedKey}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  if (!storedHash) return false;

  const parts = storedHash.split(":");
  if (parts[0] === "scrypt" && parts.length === 3) {
    const [, salt, expectedHash] = parts;
    const actualHash = scryptSync(password, salt, 64).toString("hex");
    const expected = Buffer.from(expectedHash, "hex");
    const actual = Buffer.from(actualHash, "hex");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }

  // Legacy development hashes are accepted only so existing local accounts can migrate.
  if (parts.length === 2) {
    const [salt, expectedHash] = parts;
    const actualHash = scryptSync(password, salt, 64).toString("hex");
    return timingSafeEqual(Buffer.from(expectedHash, "hex"), Buffer.from(actualHash, "hex"));
  }

  return false;
}

export function createToken(payload: Record<string, unknown>) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  const signature = createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function parseToken(token: string) {
  const parts = token?.split(".") ?? [];
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSignature = createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64url");

  try {
    const actual = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as Record<string, unknown>;
    if (typeof decoded.exp !== "number" || decoded.exp <= Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : null;
}
