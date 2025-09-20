// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import ScrollTriggerProvider from "@/components/ScrollTriggerProvider";

export const metadata: Metadata = {
  title: "1:9 by Eraya",
  description: "Next.js + Three.js + Auth + Prisma + Vercel",
};

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} bg-[#000000]`}
    >
      <body>
        <ScrollTriggerProvider>
          <Providers>
            <Preloader>
              <Navbar />
              <main className="mx-0 max-w-full relative z-10">{children}</main>
              <Footer />
              <Analytics />
            </Preloader>
          </Providers>
        </ScrollTriggerProvider>
      </body>
    </html>
  );
}