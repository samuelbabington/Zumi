import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export const metadata = { title: "Your account — Zumi" };

export default function AccountPage() {
  return (
    <section className="account">
      <Suspense fallback={<div className="account__card account__card--loading" />}>
        <AccountCard />
      </Suspense>
    </section>
  );
}

async function AccountCard() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const display = user.name ?? user.username ?? user.email ?? "friend";

  return (
    <div className="account__card">
      <div className="account__avatar">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />
        ) : (
          <Image src="/zumi/zumi-head.png" alt="" width={120} height={99} />
        )}
      </div>
      <h1 className="headline headline--md">
        Hey, <span className="grad">{display}!</span>
      </h1>
      <p className="lead">You&apos;re signed in. Zumi saved you a seat.</p>

      <dl className="account__details">
        {user.username && (
          <>
            <dt>Username</dt>
            <dd>@{user.username}</dd>
          </>
        )}
        {user.email && (
          <>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </>
        )}
        <dt>Google</dt>
        <dd>{user.hasGoogle ? "Connected" : "Not connected"}</dd>
      </dl>

      <form action={signOut}>
        <button type="submit" className="btn btn--ghost">
          <LogOut size={18} /> Sign out
        </button>
      </form>
    </div>
  );
}
