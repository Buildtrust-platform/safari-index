import type { Metadata } from 'next';
import { Navbar, Footer } from '../components/layout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Vurara Safaris - how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar variant="solid" />
      <main className="min-h-screen bg-paper pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-ink-primary mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-stone max-w-none space-y-8">
            <p className="text-ink-body text-lg">
              Last updated: January 2025
            </p>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                Introduction
              </h2>
              <p className="text-ink-body">
                Vurara Safaris (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our safari planning services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                Information We Collect
              </h2>
              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                Personal Information
              </h3>
              <p className="text-ink-body">
                When you inquire about our services or book a safari, we may collect:
              </p>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>Name and contact information (email address, phone number)</li>
                <li>Travel preferences and requirements</li>
                <li>Passport and visa information (when required for bookings)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communication history with our team</li>
              </ul>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                Automatically Collected Information
              </h3>
              <p className="text-ink-body">
                When you visit our website, we may automatically collect:
              </p>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>Device and browser information</li>
                <li>IP address and approximate location</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referral source (how you found us)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                How We Use Your Information
              </h2>
              <p className="text-ink-body">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>Plan and book your safari experience</li>
                <li>Communicate with you about your inquiry or booking</li>
                <li>Process payments and send confirmations</li>
                <li>Provide customer support</li>
                <li>Improve our website and services</li>
                <li>Send relevant updates about your trip (with your consent)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                Information Sharing
              </h2>
              <p className="text-ink-body">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>Safari lodges, camps, and tour operators to fulfill your booking</li>
                <li>Airlines and transfer companies for travel arrangements</li>
                <li>Payment processors for secure transaction handling</li>
                <li>Government authorities when required by law (e.g., visa applications)</li>
              </ul>
              <p className="text-ink-body">
                We do not sell your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                Data Security
              </h2>
              <p className="text-ink-body">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                Your Rights
              </h2>
              <p className="text-ink-body">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                Cookies
              </h2>
              <p className="text-ink-body">
                We use cookies and similar technologies to improve your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                Third-Party Links
              </h2>
              <p className="text-ink-body">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                Changes to This Policy
              </h2>
              <p className="text-ink-body">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a new &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                Contact Us
              </h2>
              <p className="text-ink-body">
                If you have questions about this Privacy Policy or how we handle your personal information, please contact us at:
              </p>
              <p className="text-ink-body">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:info@vurarasafaris.com"
                  className="text-outcome-book-base hover:underline"
                >
                  info@vurarasafaris.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
