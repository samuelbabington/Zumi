"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AtSign, Check, Eye, EyeOff, Loader2, Lock, Mail, User, X } from "lucide-react";
import { checkAvailability, signIn, signUp, type AuthState } from "@/app/actions/auth";
import WavingZumi, { type ZumiMood } from "@/components/WavingZumi";

type Mode = "signup" | "signin";
type Field = "username" | "email" | "password" | "login" | null;
type Check = { state: "idle" | "checking" | "ok" | "bad"; message?: string };

const GOOGLE_ERRORS: Record<string, string> = {
  google_not_configured: "Google sign-in isn't set up yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local.",
  google_cancelled: "Google sign-in was cancelled.",
  google_state: "That Google sign-in link expired. Please try again.",
  google_token: "Google couldn't verify the sign-in. Please try again.",
  google_profile: "We couldn't read your Google profile. Please try again.",
};

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) s++;
  else if (/\d/.test(pw)) s += 0.5;
  return Math.min(4, Math.floor(s));
}
const STRENGTH_LABEL = ["Too short", "Weak", "Okay", "Strong", "Super strong"];

/** Debounced live availability check for username / email. */
function useAvailability(kind: "username" | "email", value: string, enabled: boolean): Check {
  const [result, setResult] = useState<{ value: string; ok: boolean; message: string } | null>(null);
  const v = value.trim();

  useEffect(() => {
    if (!enabled || !v) return;
    let live = true;
    const t = setTimeout(async () => {
      const r = await checkAvailability(kind, v);
      if (live) setResult({ value: v, ok: r.ok, message: r.message });
    }, 450);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [kind, v, enabled]);

  if (!enabled || !v) return { state: "idle" };
  if (!result || result.value !== v) return { state: "checking" };
  return { state: result.ok ? "ok" : "bad", message: result.message };
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function Status({ check }: { check: Check }) {
  if (check.state === "idle") return null;
  if (check.state === "checking") return <Loader2 className="field__status is-spin" size={18} />;
  return check.state === "ok" ? (
    <Check className="field__status is-ok" size={18} strokeWidth={3} />
  ) : (
    <X className="field__status is-bad" size={18} strokeWidth={3} />
  );
}

export default function AuthForm({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [focus, setFocus] = useState<Field>(null);
  const [showPw, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [googlePending, setGooglePending] = useState(false);

  // reset the Google spinner if the user comes back with the browser's back button
  useEffect(() => {
    const reset = () => setGooglePending(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const [upState, upAction, upPending] = useActionState<AuthState, FormData>(signUp, {});
  const [inState, inAction, inPending] = useActionState<AuthState, FormData>(signIn, {});
  const state = mode === "signup" ? upState : inState;
  const pending = (mode === "signup" ? upPending : inPending) || googlePending;

  const params = useSearchParams();
  const googleError = GOOGLE_ERRORS[params.get("error") ?? ""];

  const userCheck = useAvailability("username", username, mode === "signup");
  const emailCheck = useAvailability("email", email, mode === "signup");

  const firstInput = useRef<HTMLInputElement>(null);

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setPassword("");
    setShowPw(false);
    window.history.replaceState(null, "", next === "signup" ? "/sign-up" : "/sign-in");
    requestAnimationFrame(() => firstInput.current?.focus());
  }

  // --- Zumi's reactions -------------------------------------------------
  const hasError = !!(state.error || (state.fieldErrors && Object.keys(state.fieldErrors).length));
  let mood: ZumiMood = "wave";
  let message = mode === "signup" ? "Hi, I'm Zumi! Let's get you set up." : "Welcome back, friend!";

  if (pending) {
    mood = "happy";
    message = mode === "signup" ? "Woohoo! Making your account…" : "Opening the door…";
  } else if (focus === "password" && !showPw) {
    mood = "shy";
    message = "I'm not looking, promise!";
  } else if (focus === "password" && showPw) {
    mood = "happy";
    message = "Peekaboo! Make it a strong one.";
  } else if (hasError || googleError) {
    mood = "oops";
    message = "Oops! Let's fix that together.";
  } else if (focus === "username" && username) {
    mood = userCheck.state === "bad" ? "oops" : "happy";
    message = userCheck.state === "bad" ? "Hmm, try another name?" : `@${username}? Love it!`;
  } else if (focus === "email") {
    message = "I'll never spam you. Pinky promise.";
  } else if (focus === "login" && login) {
    mood = "happy";
    message = "Ooh, I think I remember you!";
  }

  const pwStrength = strength(password);
  const fe = state.fieldErrors ?? {};

  return (
    <div className="auth-stage">
      <WavingZumi mood={mood} message={message} />

      <div className="auth-card">
        <div className="auth-tabs" role="tablist" data-mode={mode}>
          <span className="auth-tabs__thumb" aria-hidden="true" />
          <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => switchMode("signup")}>
            Sign up
          </button>
          <button type="button" role="tab" aria-selected={mode === "signin"} onClick={() => switchMode("signin")}>
            Sign in
          </button>
        </div>

        <a
          href="/api/auth/google"
          className={`btn-google ${googlePending ? "is-pending" : ""}`}
          onClick={() => setGooglePending(true)}
        >
          {googlePending ? <Loader2 className="is-spin" size={20} /> : <GoogleIcon />}
          Continue with Google
        </a>

        <div className="auth-divider">
          <span>or {mode === "signup" ? "sign up" : "sign in"} with {mode === "signup" ? "username / email" : "your details"}</span>
        </div>

        {(state.error || googleError) && (
          <p className="auth-alert" role="alert">
            {state.error ?? googleError}
          </p>
        )}

        <form key={mode} action={mode === "signup" ? upAction : inAction} className="auth-form" noValidate>
          {mode === "signup" ? (
            <>
              <label className={`field ${fe.username || userCheck.state === "bad" ? "is-invalid" : ""}`}>
                <span className="field__label">Username</span>
                <span className="field__box">
                  <AtSign className="field__icon" size={18} />
                  <input
                    ref={firstInput}
                    name="username"
                    autoComplete="username"
                    placeholder="zumi_fan"
                    value={username}
                    maxLength={20}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                    onFocus={() => setFocus("username")}
                    onBlur={() => setFocus(null)}
                  />
                  <Status check={userCheck} />
                </span>
                <span className="field__hint">
                  {fe.username ?? (userCheck.state !== "idle" && userCheck.state !== "checking" ? userCheck.message : "")}
                </span>
              </label>

              <label className={`field ${fe.email || emailCheck.state === "bad" ? "is-invalid" : ""}`}>
                <span className="field__label">Email</span>
                <span className="field__box">
                  <Mail className="field__icon" size={18} />
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocus("email")}
                    onBlur={() => setFocus(null)}
                  />
                  <Status check={emailCheck} />
                </span>
                <span className="field__hint">
                  {fe.email ?? (emailCheck.state !== "idle" && emailCheck.state !== "checking" ? emailCheck.message : "")}
                </span>
              </label>
              <p className="auth-note">Use a username, an email, or both — you can sign in with either.</p>
            </>
          ) : (
            <label className={`field ${fe.login ? "is-invalid" : ""}`}>
              <span className="field__label">Email or username</span>
              <span className="field__box">
                <User className="field__icon" size={18} />
                <input
                  ref={firstInput}
                  name="login"
                  autoComplete="username"
                  placeholder="you@example.com or zumi_fan"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  onFocus={() => setFocus("login")}
                  onBlur={() => setFocus(null)}
                />
              </span>
              <span className="field__hint">{fe.login}</span>
            </label>
          )}

          <label className={`field ${fe.password ? "is-invalid" : ""}`}>
            <span className="field__label">Password</span>
            <span className="field__box">
              <Lock className="field__icon" size={18} />
              <input
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder={mode === "signup" ? "8+ characters, a letter & a number" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocus("password")}
                onBlur={() => setFocus(null)}
              />
              <button
                type="button"
                className="field__peek"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
            {mode === "signup" && (
              <span className="meter" data-level={password ? pwStrength : -1} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <b>{password ? STRENGTH_LABEL[pwStrength] : ""}</b>
              </span>
            )}
            <span className="field__hint">{fe.password}</span>
          </label>

          <button type="submit" className="btn auth-submit" disabled={pending}>
            {pending ? <Loader2 className="is-spin" size={20} /> : null}
            {mode === "signup" ? "Create my account" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "signup" ? "Already have an account? " : "New to Zumi? "}
          <button type="button" onClick={() => switchMode(mode === "signup" ? "signin" : "signup")}>
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}
