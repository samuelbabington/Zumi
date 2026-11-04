import Link from "next/link";
import { ArrowRight, BookOpen, Gamepad2, Trophy, Users } from "lucide-react";
import BlinkingZumi from "@/components/BlinkingZumi";
import FeatureStrip from "@/components/FeatureStrip";
import { Bulb, Sparks } from "@/components/Decor";

export default function HomePage() {
  return (
    <section className="hero hero--about">
      <div className="hero__copy">
        <span className="pill">
          <span className="pill__dot" /> Meet Zumi
        </span>
        <h1 className="headline">
          Play. Learn.
          <br />
          <span className="grad">Level Up.</span>
        </h1>
        <p className="lead">
          Quizzes, study tools and friends — all in one place
          <br className="hide-sm" /> with Zumi the pangolin by your side.
        </p>
        <Link href="/get-started" className="btn">
          Get Started <ArrowRight size={18} strokeWidth={2.5} />
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
          items={[
            { icon: Gamepad2, title: "Quiz Games" },
            { icon: BookOpen, title: "Study Tools" },
            { icon: Users, title: "Play with Friends" },
            { icon: Trophy, title: "Track Progress" },
          ]}
        />
      </div>
    </section>
  );
}
