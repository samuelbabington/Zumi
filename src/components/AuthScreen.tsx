import { Suspense } from "react";
import { Gamepad2, Sparkles, Trophy, Users } from "lucide-react";
import AuthForm from "@/components/AuthForm";

const perks = [
  { icon: Gamepad2, text: "Quiz games on any topic" },
  { icon: Users, text: "Study and battle with friends" },
  { icon: Trophy, text: "Streaks, badges and rewards" },
];

export default function AuthScreen({ mode }: { mode: "signup" | "signin" }) {
  return (
    <section className="auth">
      <div className="auth__copy">
        <span className="pill">
          <span className="pill__dot" /> {mode === "signup" ? "Join Zumi" : "Welcome back"}
        </span>
        <h1 className="headline">
          Your adventure
          <br />
          <span className="grad">starts here.</span>
        </h1>
        <p className="lead">
          Create a free account to save your progress
          <br className="hide-sm" /> and level up with Zumi.
        </p>
        <ul className="auth__perks">
          {perks.map(({ icon: Icon, text }) => (
            <li key={text}>
              <Icon size={20} />
              {text}
            </li>
          ))}
          <li>
            <Sparkles size={20} />
            Free to start, no card needed
          </li>
        </ul>
      </div>

      <Suspense fallback={<div className="auth-stage auth-stage--loading" />}>
        <AuthForm initialMode={mode} />
      </Suspense>
    </section>
  );
}
