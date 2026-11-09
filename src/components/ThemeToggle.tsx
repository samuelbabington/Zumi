"use client";

import { Moon, Sun } from "lucide-react";
import type { MouseEvent } from "react";

const KEY = "zumi-theme";

/**
 * Flips between dark and light by setting `data-theme` on <html>.
 * The icon swap is pure CSS, so there is no hydration mismatch; the choice
 * is remembered in localStorage and applied before paint by the inline
 * script in the root layout. Where supported, the new theme spreads out
 * from the button as a circle.
 */
export default function ThemeToggle() {
  function toggle(e: MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";

    const apply = () => {
      root.dataset.theme = next;
      root.style.colorScheme = next;
      try {
        localStorage.setItem(KEY, next);
      } catch {}
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      apply();
      return;
    }

    const { clientX: x, clientY: y } = e;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    root.classList.add("theme-switching");
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
    vt.finished.finally(() => root.classList.remove("theme-switching"));
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle light and dark mode">
      <Sun className="theme-toggle__sun" size={19} strokeWidth={2.2} />
      <Moon className="theme-toggle__moon" size={18} strokeWidth={2.2} />
    </button>
  );
}
