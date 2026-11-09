"use client";

import Image from "next/image";
import { useId } from "react";

export type ZumiMood = "wave" | "shy" | "happy" | "oops";

/** One pangolin paw + forearm, drawn to match the 3D renders. */
function Paw({ className }: { className: string }) {
  const id = useId();
  return (
    <svg className={`paw ${className}`} viewBox="0 0 60 120" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}arm`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9485f" />
          <stop offset="0.5" stopColor="#ff6f7f" />
          <stop offset="1" stopColor="#d93c56" />
        </linearGradient>
        <radialGradient id={`${id}palm`} cx="0.45" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffd9bd" />
          <stop offset="1" stopColor="#f1a982" />
        </radialGradient>
      </defs>
      {/* scaly forearm */}
      <rect x="15" y="34" width="30" height="86" rx="14" fill={`url(#${id}arm)`} />
      <g fill="none" stroke="#c4334d" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round">
        <path d="M18 62q6 6 12 0q6 6 12 0" />
        <path d="M18 78q6 6 12 0q6 6 12 0" />
        <path d="M18 94q6 6 12 0q6 6 12 0" />
      </g>
      {/* toes + palm */}
      <g fill={`url(#${id}palm)`}>
        <circle cx="13" cy="22" r="7.5" />
        <circle cx="23.5" cy="12.5" r="7.5" />
        <circle cx="36.5" cy="12.5" r="7.5" />
        <circle cx="47" cy="22" r="7.5" />
        <ellipse cx="30" cy="34" rx="21" ry="18" />
      </g>
      <g fill="#ec8a86" opacity="0.85">
        <ellipse cx="30" cy="38" rx="9" ry="6.5" />
        <circle cx="14" cy="23" r="3" />
        <circle cx="24" cy="14" r="3" />
        <circle cx="36" cy="14" r="3" />
        <circle cx="46" cy="23" r="3" />
      </g>
    </svg>
  );
}

/**
 * Zumi peeking over the top edge of the auth card and waving.
 * Renders three layers (head behind the card, paws + bubble in front);
 * the parent `.auth-stage` stacks them around the card with z-index.
 */
export default function WavingZumi({ mood, message }: { mood: ZumiMood; message: string }) {
  return (
    <div className={`peek peek--${mood}`}>
      <div className="peek__head">
        <Image src="/zumi/zumi-head.png" alt="Zumi the pangolin peeking over the card and waving" width={640} height={528} priority />
      </div>
      <div className="peek__paws">
        <Paw className="paw--left" />
        <Paw className="paw--right" />
      </div>
      <p className="peek__bubble" aria-live="polite">
        <span key={message}>{message}</span>
      </p>
    </div>
  );
}
