import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import AttributionTracker from "./components/AttributionTracker";
import { CookieConsent } from "./components/CookieConsent";
import { ReCaptchaProvider } from "./components/ReCaptcha";
// Chat widget disabled - requires ANTHROPIC_API_KEY
// import { ChatWidget } from "./components/ChatWidget";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Vurara Safaris | Tailor-Made African Safari Trips",
    template: "%s | Vurara Safaris",
  },
  description: "The truth of the wild, revealed. Logic-backed safari planning across East and Southern Africa.",
  metadataBase: new URL(process.env.SITE_ORIGIN || "https://www.vurarasafaris.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Vurara Safaris",
    title: "Vurara Safaris",
    description: "The truth of the wild, revealed. Logic-backed safari planning across East and Southern Africa.",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vurara Safaris",
    description: "The truth of the wild, revealed. Logic-backed safari planning across East and Southern Africa.",
    images: ["/logo.svg"],
  },
};

/**
 * Organization JSON-LD structured data
 * Helps search engines understand Vurara Safaris as a business entity
 *
 * Required fields for TravelAgency (LocalBusiness subtype):
 * - name, address, image (for rich results)
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": "https://www.vurarasafaris.com/#organization",
  name: "Vurara Safaris",
  description: "The truth of the wild, revealed. Logic-backed safari planning across East and Southern Africa.",
  url: "https://www.vurarasafaris.com",
  logo: {
    "@type": "ImageObject",
    url: "https://www.vurarasafaris.com/logo.svg",
    width: 200,
    height: 60,
  },
  image: "https://www.vurarasafaris.com/images/heroes/home-hero.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "De Wetstraat 134",
    addressLocality: "Ridderkerk",
    addressCountry: "NL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.8728,
    longitude: 4.6003,
  },
  telephone: "+31614855683",
  email: "hello@vurarasafaris.com",
  sameAs: [
    "https://instagram.com/vurarasafaris",
    "https://facebook.com/vurarasafaris",
    "https://x.com/vurarasafaris",
    "https://youtube.com/@vurarasafaris",
  ],
  areaServed: {
    "@type": "Continent",
    name: "Africa",
  },
  priceRange: "$$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="XQ6HoEli8QA8YJyZOr_XxkNItorp_XRRDKbKptVb0kQ" />
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MS3K7TND');`}
        </Script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4JP1TZ5R65"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4JP1TZ5R65');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body
        className={`${sourceSerif.variable} ${inter.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MS3K7TND"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Attribution tracker - invisible, session-only, never fails */}
        <Suspense fallback={null}>
          <AttributionTracker />
        </Suspense>
        <ReCaptchaProvider>
          {children}
        </ReCaptchaProvider>
        {/* Cookie consent banner */}
        <CookieConsent />
      </body>
    </html>
  );
}
