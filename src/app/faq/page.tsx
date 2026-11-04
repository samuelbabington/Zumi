import Image from "next/image";

export const metadata = { title: "FAQ — Zumi" };

const faqs = [
  { q: "What is Zumi?", a: "Zumi is a social learning and gaming platform where you play quizzes, study together and earn rewards as you learn." },
  { q: "Is Zumi free?", a: "Yes, you can start playing and learning for free. Extra rewards and features may come later." },
  { q: "Can I play with my friends?", a: "Absolutely. Invite friends, join study groups and challenge each other in live quiz battles." },
  { q: "How do I track my progress?", a: "Your dashboard shows streaks, scores and badges so you can see how far you've levelled up." },
  { q: "Who is Zumi the pangolin?", a: "Zumi is our curious pangolin mascot who cheers you on, celebrates your wins and helps when you're stuck." },
];

export default function FaqPage() {
  return (
    <section className="faq">
      <div className="faq__head">
        <Image src="/zumi/logo.png" alt="" width={84} height={84} />
        <h1 className="headline headline--md">
          Questions? <span className="grad">We&apos;ve got answers.</span>
        </h1>
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
