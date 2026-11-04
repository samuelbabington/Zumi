import { BookOpen, Gamepad2, Trophy, Users } from "lucide-react";
import BlinkingZumi from "@/components/BlinkingZumi";
import FeatureStrip from "@/components/FeatureStrip";
import { Sparks } from "@/components/Decor";

export const metadata = { title: "Features — Zumi" };

export default function FeaturesPage() {
  return (
    <section className="hero hero--features">
      <div className="hero__copy">
        <h1 className="headline headline--xl">
          Everything you
          <br />
          need to le<span className="grad-tail">vel up.</span>
        </h1>
        <p className="lead">Play quizzes, learn together, and track your progress.</p>
      </div>

      <div className="hero__art">
        <Sparks className="sparks--features" />
        <BlinkingZumi
          open="/zumi/zumi-quiz.png"
          closed="/zumi/zumi-quiz-closed.png"
          alt="Zumi the pangolin tapping answer B on a holographic quiz card"
          eyes={[58, 38, 21, 12]}
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
