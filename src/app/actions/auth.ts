"use server";

import { redirect } from "next/navigation";
import { createUser, findUserByLogin, isEmailTaken, isUsernameTaken } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/session";

export type AuthState = {
  error?: string;
  fieldErrors?: Partial<Record<"username" | "email" | "password" | "login", string>>;
  values?: { username?: string; email?: string; login?: string };
};

const USERNAME_RE = /^[a-zA-Z0-9_.]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// used to keep sign-in timing the same whether or not the account exists
const DUMMY_HASH =
  "00000000000000000000000000000000:" + "0".repeat(128);

function str(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const username = str(form, "username");
  const email = str(form, "email").toLowerCase();
  const password = typeof form.get("password") === "string" ? (form.get("password") as string) : "";
  const values = { username, email };
  const fieldErrors: AuthState["fieldErrors"] = {};

  if (!username && !email) {
    return { values, error: "Pick a username, an email, or both." };
  }
  if (username && !USERNAME_RE.test(username)) {
    fieldErrors.username = "3–20 letters, numbers, dots or underscores.";
  } else if (username && isUsernameTaken(username)) {
    fieldErrors.username = "That username is taken.";
  }
  if (email && !EMAIL_RE.test(email)) {
    fieldErrors.email = "That doesn't look like an email.";
  } else if (email && isEmailTaken(email)) {
    fieldErrors.email = "An account with this email already exists.";
  }
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    fieldErrors.password = "At least 8 characters with a letter and a number.";
  }
  if (Object.keys(fieldErrors).length) return { values, fieldErrors };

  let userId: string;
  try {
    const user = createUser({
      username: username || null,
      email: email || null,
      name: username || email.split("@")[0],
      passwordHash: await hashPassword(password),
    });
    userId = user.id;
  } catch {
    // unique constraint race
    return { values, error: "That username or email was just taken. Try another." };
  }

  await createSession(userId);
  redirect("/account");
}

export async function signIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const login = str(form, "login");
  const password = typeof form.get("password") === "string" ? (form.get("password") as string) : "";
  const values = { login };

  if (!login || !password) {
    return { values, error: "Enter your email or username and your password." };
  }

  const user = findUserByLogin(login.includes("@") ? login.toLowerCase() : login);
  const ok = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);

  if (!user || !ok) {
    if (user && !user.password_hash && user.google_sub) {
      return { values, error: "This account uses Google. Use “Continue with Google” instead." };
    }
    return { values, error: "Incorrect email/username or password." };
  }

  await createSession(user.id);
  redirect("/account");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}

/** Live availability check for the sign-up form. */
export async function checkAvailability(kind: "username" | "email", value: string) {
  const v = value.trim();
  if (kind === "username") {
    if (!USERNAME_RE.test(v)) return { ok: false, message: "3–20 letters, numbers, dots or underscores." };
    return isUsernameTaken(v) ? { ok: false, message: "Taken — try another." } : { ok: true, message: "Available!" };
  }
  if (!EMAIL_RE.test(v)) return { ok: false, message: "That doesn't look like an email." };
  return isEmailTaken(v.toLowerCase())
    ? { ok: false, message: "Already registered — sign in instead?" }
    : { ok: true, message: "Looks good!" };
}
