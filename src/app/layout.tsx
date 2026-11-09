import { ViewTransition } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Backdrop from "@/components/Backdrop";
import "./globals.css";
import "./auth.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zumi — Learn. Compete. Grow Together.",
  description: "Zumi is a social learning and gaming platform for curious minds.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        {/* apply the saved theme before first paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("zumi-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <Backdrop />
        <Navbar />
        <main className="main">
          <ViewTransition default="page">{children}</ViewTransition>
        </main>
      </body>
    </html>
  );
}
