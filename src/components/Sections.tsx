import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, Gamepad2, Trophy, Users } from "lucide-react";
import BlinkingZumi from "@/components/BlinkingZumi";
import FeatureStrip from "@/components/FeatureStrip";
import Reveal from "@/components/Reveal";
import { Bulb, Sparks } from "@/components/Decor";

type SectionProps = { next?: string; primary?: boolean };

function ScrollCue({ to }: { to: string }) {
  return (
    <a href={`#${to}`} className="scroll-cue" aria-label={`Scroll to ${to}`}>
      <ChevronDown size={22} strokeWidth={2.5} />
    </a>
  );
}

export function HomeHero({ next, primary }: SectionProps) {
  const H = primary ? "h1" : "h2";
  return (
    <section className="hero hero--about hero--full">
      <div className="hero__copy">
        <span className="pill">
          <span className="pill__dot" /> Meet Zumi
        </span>
        <H className="headline">
          Play. Learn.
          <br />
          <span className="grad">Level Up.</span>
        </H>
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
          open="/zumi/zumi-reading-cut.png"
          closed="/zumi/zumi-reading-closed-cut.png"
          alt="Zumi the pangolin reading a book with headphones on"
          eyes={[50, 45, 30, 12]}
          priority={primary}
        />
      </div>

      <div className="hero__strip">
        <FeatureStrip
          items={[
            { icon: Gamepad2, title: "Quiz Games", text: "Quick, fun rounds on any topic." },
            { icon: BookOpen, title: "Study Tools", text: "Flashcards, notes & smart review." },
            { icon: Users, title: "Play with Friends", text: "Team up or battle live." },
            { icon: Trophy, title: "Track Progress", text: "Streaks, scores and badges." },
          ]}
        />
      </div>

      {next && <ScrollCue to={next} />}
    </section>
  );
}

export function FeaturesHero({ next, primary }: SectionProps) {
  const H = primary ? "h1" : "h2";
  return (
    <section className="hero hero--features hero--full">
      <div className="hero__copy">
        <H className="headline headline--xl">
          Everything you
          <br />
          need to le<span className="grad-tail">vel up.</span>
        </H>
        <p className="lead">Play quizzes, learn together, and track your progress.</p>
      </div>

      <div className="hero__art">
        <Sparks className="sparks--features" />
        <BlinkingZumi
          open="/zumi/zumi-quiz-cut.png"
          closed="/zumi/zumi-quiz-closed-cut.png"
          alt="Zumi the pangolin tapping answer B on a holographic quiz card"
          eyes={[58, 38, 21, 12]}
          priority={primary}
        />
      </div>

      <div className="hero__strip">
        <FeatureStrip
          items={[
            { icon: Gamepad2, title: "Quiz Games", text: "Beat the clock in quiz battles." },
            { icon: BookOpen, title: "Study Tools", text: "Everything you need to revise." },
            { icon: Users, title: "Play with Friends", text: "Invite friends and study groups." },
            { icon: Trophy, title: "Track Progress", text: "See how far you've levelled up." },
          ]}
        />
      </div>

      {next && <ScrollCue to={next} />}
    </section>
  );
}

export function AboutHero({ next, primary }: SectionProps) {
  const H = primary ? "h1" : "h2";
  return (
    <section className="hero hero--about hero--full">
      <div className="hero__copy">
        <span className="pill">
          <span className="pill__dot" /> About Zumi
        </span>
        <H className="headline">
          Learn. Compete.
          <br />
          <span className="grad">Grow Together.</span>
        </H>
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
          open="/zumi/zumi-reading-cut.png"
          closed="/zumi/zumi-reading-closed-cut.png"
          alt="Zumi the pangolin reading a book with headphones on"
          eyes={[50, 45, 30, 12]}
          priority={primary}
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

      {next && <ScrollCue to={next} />}
    </section>
  );
}

const faqs = [
  { q: "What is Zumi?", a: "Zumi is a social learning and gaming platform where you play quizzes, study together and earn rewards as you learn." },
  { q: "Is Zumi free?", a: "Yes, you can start playing and learning for free. Extra rewards and features may come later." },
  { q: "Can I play with my friends?", a: "Absolutely. Invite friends, join study groups and challenge each other in live quiz battles." },
  { q: "How do I track my progress?", a: "Your dashboard shows streaks, scores and badges so you can see how far you've levelled up." },
  { q: "Who is Zumi the pangolin?", a: "Zumi is our curious pangolin mascot who cheers you on, celebrates your wins and helps when you're stuck." },
];

export function FaqSection({ primary }: SectionProps) {
  const H = primary ? "h1" : "h2";
  return (
    <section className="faq">
      <div className="faq__head">
        <Image src="/zumi/logo.png" alt="" width={84} height={84} />
        <H className="headline headline--md">
          Questions? <span className="grad">We&apos;ve got answers.</span>
        </H>
      </div>
      <div className="faq__list">
        {faqs.map((f) => (
          <details key={f.q} className="faq__item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

const flow = [
  { id: "home", Section: HomeHero },
  { id: "features", Section: FeaturesHero },
  { id: "about", Section: AboutHero },
  { id: "faq", Section: FaqSection },
] as const;

type SectionId = (typeof flow)[number]["id"];

/**
 * Renders the page's own section first, then every following page in nav
 * order so visitors can keep scrolling down into the next page.
 */
export default function PageFlow({ start }: { start: SectionId }) {
  const sections = flow.slice(flow.findIndex((s) => s.id === start));

  return (
    <>
      {sections.map(({ id, Section }, i) => {
        const next = sections[i + 1]?.id;
        return i === 0 ? (
          <Section key={id} next={next} primary />
        ) : (
          <Reveal key={id} id={id}>
            <Section next={next} />
          </Reveal>
        );
      })}
    </>
  );
}
