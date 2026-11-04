import type { LucideIcon } from "lucide-react";

export type StripItem = { icon: LucideIcon; title: string; text?: string };

/** Row of icon + label items separated by thin dividers. `card` wraps it in the bordered panel (About page). */
export default function FeatureStrip({ items, card = false }: { items: StripItem[]; card?: boolean }) {
  return (
    <ul className={card ? "strip strip--card" : "strip"}>
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className="strip__item">
          <Icon className="strip__icon" size={card ? 44 : 50} strokeWidth={1.8} fill="currentColor" fillOpacity={0.9} />
          <div>
            <p className="strip__title">{title}</p>
            {text && <p className="strip__text">{text}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
