import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Get Started — Zumi" };

// Placeholder: sign-up / onboarding will be built in the functional phase.
export default function GetStartedPage() {
  return (
    <section className="faq faq--center">
      <Image src="/zumi/logo.png" alt="" width={120} height={120} />
      <h1 className="headline headline--md">
        Sign-up is <span className="grad">coming soon.</span>
      </h1>
      <p className="lead">Zumi is getting ready for you. Check back shortly!</p>
      <Link href="/" className="btn">Back to Home</Link>
    </section>
  );
}
