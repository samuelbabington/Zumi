import { NextResponse, type NextRequest } from "next/server";
import { createUser, findUserByEmail, findUserByGoogleSub, linkGoogle } from "@/lib/db";
import { GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE, googleConfig } from "@/lib/google";
import { sessionCookie } from "@/lib/session";

type GoogleProfile = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

function fail(req: NextRequest, reason: string) {
  const res = NextResponse.redirect(new URL(`/sign-in?error=${reason}`, req.url));
  res.cookies.delete(GOOGLE_STATE_COOKIE);
  res.cookies.delete(GOOGLE_VERIFIER_COOKIE);
  return res;
}

/** Google redirects back here with ?code&state. */
export async function GET(req: NextRequest) {
  const cfg = googleConfig(req.url);
  if (!cfg) return fail(req, "google_not_configured");

  const params = req.nextUrl.searchParams;
  const code = params.get("code");
  const state = params.get("state");
  const savedState = req.cookies.get(GOOGLE_STATE_COOKIE)?.value;
  const verifier = req.cookies.get(GOOGLE_VERIFIER_COOKIE)?.value;

  if (params.get("error")) return fail(req, "google_cancelled");
  if (!code || !state || !savedState || state !== savedState || !verifier) return fail(req, "google_state");

  // exchange the code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      redirect_uri: cfg.redirectUri,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });
  if (!tokenRes.ok) return fail(req, "google_token");
  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  if (!access_token) return fail(req, "google_token");

  // fetch the profile straight from Google over TLS
  const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profileRes.ok) return fail(req, "google_profile");
  const profile = (await profileRes.json()) as GoogleProfile;
  if (!profile.sub) return fail(req, "google_profile");

  const email = profile.email_verified && profile.email ? profile.email.toLowerCase() : null;

  let user = findUserByGoogleSub(profile.sub);
  if (!user && email) {
    // same verified email as an existing account → link them
    const existing = findUserByEmail(email);
    if (existing) {
      linkGoogle(existing.id, profile.sub, profile.picture ?? null);
      user = existing;
    }
  }
  if (!user) {
    user = createUser({
      email,
      name: profile.name ?? email?.split("@")[0] ?? "Zumi learner",
      avatarUrl: profile.picture ?? null,
      googleSub: profile.sub,
    });
  }

  const session = await sessionCookie(user.id);
  const res = NextResponse.redirect(new URL("/account", req.url));
  res.cookies.set(session.name, session.value, session.options);
  res.cookies.delete(GOOGLE_STATE_COOKIE);
  res.cookies.delete(GOOGLE_VERIFIER_COOKIE);
  return res;
}
