/** Small decorative accents from the mockups. */

export function Sparks({ className }: { className?: string }) {
  return (
    <svg className={`sparks ${className ?? ""}`} viewBox="0 0 60 60" aria-hidden="true">
      <rect x="30" y="2" width="9" height="30" rx="4.5" transform="rotate(20 34 17)" fill="#ff3d71" />
      <rect x="4" y="26" width="9" height="22" rx="4.5" transform="rotate(-50 8 37)" fill="#ff3d71" />
    </svg>
  );
}

export function Bulb({ className }: { className?: string }) {
  return (
    <svg
      className={`bulb ${className ?? ""}`}
      viewBox="0 0 64 64"
      fill="none"
      stroke="#e85cff"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M32 14a14 14 0 0 0-8 25.5c1.6 1.2 2.5 3 2.5 5V47h11v-2.5c0-2 .9-3.8 2.5-5A14 14 0 0 0 32 14Z" />
      <path d="M27 52h10M28.5 57h7" />
      <path d="M28 33l4 4 4-4M32 37v10" />
      <path d="M32 3v5M12 10l3.5 3.5M52 10l-3.5 3.5M5 27h5M54 27h5" />
    </svg>
  );
}
