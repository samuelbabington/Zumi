import { NextResponse, type NextRequest } from "next/server";
import { GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE, googleConfig, pkceChallenge, randomToken } from "@/lib/google";

/** Starts "Continue with Google": redirects to Google's consent screen. */
export async function GET(req: NextRequest) {
  const cfg = googleConfig(req.url);
  if (!cfg) {
    return NextResponse.redirect(new URL("/sign-up?error=google_not_configured", req.url));
  }

  const state = randomToken();
  const verifier = randomToken(48);

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: await pkceChallenge(verifier),
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  const res = NextResponse.redirect(url);
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };
  res.cookies.set(GOOGLE_STATE_COOKIE, state, opts);
  res.cookies.set(GOOGLE_VERIFIER_COOKIE, verifier, opts);
  return res;
}
