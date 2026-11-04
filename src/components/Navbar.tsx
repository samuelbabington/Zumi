"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link href="/" className="nav__brand" aria-label="Zumi home">
          <Image src="/zumi/logo.png" alt="" width={60} height={60} priority />
          <span>Zumi</span>
        </Link>

        <nav className="nav__links" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "nav__link is-active" : "nav__link"}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/get-started" className="btn btn--sm">
          Get Started <ArrowRight size={15} strokeWidth={2.5} />
        </Link>
      </div>
    </header>
  );
}
