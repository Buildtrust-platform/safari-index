import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AttributionTracker from "./components/AttributionTracker";

/**
 * Editorial Font - Source Serif 4
 * Used for: Headings (H1-H3), long-form text, explanations, refusals
 * Rule: If content is READ → use Source Serif 4
 */
const sourceSerif = Source_Serif_4({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * UI Font - Inter
 * Used for: Buttons, labels, meta text, filters, controls, badges
 * Rule: If content is OPERATED → use Inter
 */
const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Safari Index",
    template: "%s | Safari Index",
  },
  description: "A Pan-African decision system for safari travel planning. Issues a verdict or refuses responsibly.",
  metadataBase: new URL(process.env.SITE_ORIGIN || "https://safariindex.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Safari Index",
    title: "Safari Index",
    description: "A Pan-African decision system for safari travel planning.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Safari Index",
    description: "A Pan-African decision system for safari travel planning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSerif.variable} ${inter.variable} antialiased`}
      >
        {/* Attribution tracker - invisible, session-only, never fails */}
        <Suspense fallback={null}>
          <AttributionTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
