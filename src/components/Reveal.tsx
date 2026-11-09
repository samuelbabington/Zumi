"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Fades + lifts its content into view the first time it scrolls on screen. */
export default function Reveal({ children, id }: { children: ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} className={visible ? "reveal is-visible" : "reveal"}>
      {children}
    </div>
  );
}
