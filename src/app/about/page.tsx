import Link from "next/link";
import { ArrowRight, Gamepad2, Trophy, Users } from "lucide-react";
import BlinkingZumi from "@/components/BlinkingZumi";
import FeatureStrip from "@/components/FeatureStrip";
import { Bulb, Sparks } from "@/components/Decor";

export const metadata = { title: "About — Zumi" };

export default function AboutPage() {
  return (
    <section className="hero hero--about">
      <div className="hero__copy">
        <span className="pill">
          <span className="pill__dot" /> About Zumi
        </span>
        <h1 className="headline">
          Learn. Compete.
          <br />
          <span className="grad">Grow Together.</span>
        </h1>
        <p className="lead">
          Zumi is a social learning and gaming platform
          <br className="hide-sm" /> for curious minds.
        </p>
        <Link href="/get-started" className="btn">
          Join the Community <ArrowRight size={18} strokeWidth={2.5} />
        </Link>
      </div>

      <div className="hero__art">
        <Sparks className="sparks--about" />
        <Bulb className="bulb--about" />
        <BlinkingZumi
          open="/zumi/zumi-reading.png"
          closed="/zumi/zumi-reading-closed.png"
          alt="Zumi the pangolin reading a book with headphones on"
          eyes={[50, 45, 30, 12]}
          priority
        />
      </div>

      <div className="hero__strip">
        <FeatureStrip
          card
          items={[
            { icon: Gamepad2, title: "Gamified Learning", text: "Learn by playing." },
            { icon: Users, title: "Social Community", text: "Connect with friends." },
            { icon: Trophy, title: "Rewards & More", text: "Earn as you learn." },
          ]}
        />
      </div>
    </section>
  );
}
