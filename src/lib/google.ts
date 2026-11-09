import "server-only";

export const GOOGLE_STATE_COOKIE = "zumi_g_state";
export const GOOGLE_VERIFIER_COOKIE = "zumi_g_verifier";

export function googleConfig(requestUrl: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  const origin = process.env.APP_URL ?? new URL(requestUrl).origin;
  return { clientId, clientSecret, redirectUri: `${origin}/api/auth/google/callback` };
}

export function randomToken(bytes = 32) {
  const buf = crypto.getRandomValues(new Uint8Array(bytes));
  return Buffer.from(buf).toString("base64url");
}

export async function pkceChallenge(verifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return Buffer.from(digest).toString("base64url");
}
