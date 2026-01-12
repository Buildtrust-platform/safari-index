import type { Metadata } from 'next';
import { Navbar, Footer } from '../components/layout';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Vurara Safaris - the terms and conditions governing your use of our safari planning services.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar variant="solid" />
      <main className="min-h-screen bg-paper pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-ink-primary mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-stone max-w-none space-y-8">
            <p className="text-ink-body text-lg">
              Last updated: January 2025
            </p>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                1. Agreement to Terms
              </h2>
              <p className="text-ink-body">
                By accessing or using the Vurara Safaris website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
              <p className="text-ink-body">
                Vurara Safaris operates as a safari travel planning and booking service, connecting travelers with safari operators, lodges, and related service providers across East and Southern Africa.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                2. Our Role as an Intermediary
              </h2>
              <p className="text-ink-body">
                Vurara Safaris acts as an intermediary between you (the traveler) and third-party service providers including, but not limited to:
              </p>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>Safari lodges, camps, and accommodations</li>
                <li>Safari tour operators and guides</li>
                <li>Transportation providers (airlines, transfer companies, car rentals)</li>
                <li>National parks and conservation areas</li>
                <li>Travel insurance providers</li>
              </ul>
              <p className="text-ink-body">
                While we carefully select and recommend reputable service providers, we do not own, operate, or control these third-party services. Each service provider has their own terms, conditions, and policies that will apply to your booking.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                3. Booking and Payment Terms
              </h2>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                3.1 Booking Process
              </h3>
              <p className="text-ink-body">
                A booking is confirmed only when you receive written confirmation from Vurara Safaris and any required deposits have been received. Until confirmation is issued, no contract exists between you and Vurara Safaris or the service providers.
              </p>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                3.2 Pricing and Payments
              </h3>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>All prices are quoted in USD unless otherwise specified</li>
                <li>Prices are subject to change until a booking is confirmed</li>
                <li>A deposit (typically 20-30% of the total cost) is required to secure your booking</li>
                <li>Final payment is typically due 60-90 days before departure</li>
                <li>Late payments may result in cancellation of your booking</li>
              </ul>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                3.3 Price Changes
              </h3>
              <p className="text-ink-body">
                After booking confirmation, prices may only change due to factors beyond our control, including but not limited to: currency fluctuations exceeding 3%, increases in park fees, government taxes, or fuel surcharges. We will notify you of any such changes as soon as possible.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                4. Cancellation and Refund Policy
              </h2>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                4.1 Cancellation by You
              </h3>
              <p className="text-ink-body">
                If you need to cancel your booking, the following cancellation fees apply (calculated as a percentage of the total booking cost):
              </p>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>More than 90 days before departure: Loss of deposit only</li>
                <li>60-90 days before departure: 50% of total cost</li>
                <li>30-59 days before departure: 75% of total cost</li>
                <li>Less than 30 days before departure: 100% of total cost (no refund)</li>
              </ul>
              <p className="text-ink-body">
                Some service providers (particularly high-end lodges and peak-season bookings) may have stricter cancellation policies. These will be communicated to you at the time of booking.
              </p>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                4.2 Cancellation by Us
              </h3>
              <p className="text-ink-body">
                We reserve the right to cancel a booking due to circumstances beyond our control (force majeure), including but not limited to: natural disasters, political instability, health emergencies, or service provider insolvency. In such cases, we will offer alternative arrangements or a full refund of payments made to us.
              </p>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                4.3 Changes to Your Booking
              </h3>
              <p className="text-ink-body">
                Requests to change your booking (dates, accommodations, itinerary) are subject to availability and may incur amendment fees from service providers. We will communicate any applicable fees before processing changes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                5. Travel Requirements and Responsibilities
              </h2>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                5.1 Travel Documents
              </h3>
              <p className="text-ink-body">
                You are responsible for ensuring you have valid travel documents including:
              </p>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>A passport valid for at least 6 months beyond your travel dates</li>
                <li>Appropriate visas for all countries you will visit</li>
                <li>Any required vaccination certificates (e.g., Yellow Fever)</li>
                <li>Travel permits where required</li>
              </ul>
              <p className="text-ink-body">
                While we may provide general guidance, it is your responsibility to verify current entry requirements with relevant embassies or consulates. We accept no liability for denied entry due to inadequate documentation.
              </p>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                5.2 Health and Fitness
              </h3>
              <p className="text-ink-body">
                Safari travel can be physically demanding. You must disclose any medical conditions, mobility limitations, or special requirements that may affect your ability to participate in activities. Some activities may have age, health, or fitness restrictions.
              </p>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                5.3 Travel Insurance
              </h3>
              <p className="text-ink-body">
                <strong>Comprehensive travel insurance is mandatory for all bookings.</strong> Your policy must cover:
              </p>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>Trip cancellation and interruption</li>
                <li>Medical expenses and emergency evacuation (minimum $100,000 coverage recommended)</li>
                <li>Personal liability</li>
                <li>Loss of luggage and personal belongings</li>
              </ul>
              <p className="text-ink-body">
                We strongly recommend insurance that includes &quot;cancel for any reason&quot; coverage. Proof of insurance may be required before departure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                6. Limitation of Liability
              </h2>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                6.1 Third-Party Services
              </h3>
              <p className="text-ink-body">
                We are not liable for any loss, damage, injury, or death arising from services provided by third-party operators, including but not limited to: accommodation issues, transportation delays or cancellations, wildlife encounters, accidents during activities, or any other incidents beyond our direct control.
              </p>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                6.2 Inherent Risks of Safari Travel
              </h3>
              <p className="text-ink-body">
                Safari travel involves inherent risks including exposure to wildlife, remote locations with limited medical facilities, unpredictable weather, rough terrain, and other hazards. By booking with us, you acknowledge and accept these risks.
              </p>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                6.3 Maximum Liability
              </h3>
              <p className="text-ink-body">
                To the maximum extent permitted by law, Vurara Safaris&apos; total liability for any claim arising from your booking shall not exceed the total amount paid to us for that booking. This limitation does not apply to liability for death or personal injury caused by our negligence.
              </p>

              <h3 className="font-editorial text-xl font-medium text-ink-primary">
                6.4 No Guarantee of Wildlife Sightings
              </h3>
              <p className="text-ink-body">
                While we design itineraries to maximize wildlife viewing opportunities, we cannot guarantee specific animal sightings. Wildlife behavior is unpredictable, and no refunds will be given for missed sightings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                7. Conduct and Compliance
              </h2>
              <p className="text-ink-body">
                You agree to:
              </p>
              <ul className="list-disc list-inside text-ink-body space-y-2">
                <li>Follow all instructions from guides, lodge staff, and park authorities</li>
                <li>Respect wildlife and maintain safe distances as directed</li>
                <li>Comply with local laws and national park regulations</li>
                <li>Behave respectfully toward local communities and cultures</li>
                <li>Not engage in any illegal activities, including wildlife poaching or trafficking</li>
              </ul>
              <p className="text-ink-body">
                We reserve the right to terminate your trip without refund if your behavior endangers yourself, others, wildlife, or damages our reputation or relationships with service providers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                8. Intellectual Property
              </h2>
              <p className="text-ink-body">
                All content on the Vurara Safaris website, including text, images, logos, itineraries, and design elements, is owned by or licensed to Vurara Safaris. You may not reproduce, distribute, or use our content for commercial purposes without written permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                9. Disputes and Complaints
              </h2>
              <p className="text-ink-body">
                If you have any complaints during your trip, please notify your guide or lodge manager immediately so issues can be addressed promptly. For post-trip complaints, please contact us in writing within 28 days of your return.
              </p>
              <p className="text-ink-body">
                We will investigate all complaints fairly and respond within a reasonable timeframe. If we cannot resolve a dispute, you may pursue mediation or other remedies available under applicable law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                10. Governing Law
              </h2>
              <p className="text-ink-body">
                These Terms of Service are governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your booking shall be subject to the exclusive jurisdiction of the appropriate courts.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                11. Changes to These Terms
              </h2>
              <p className="text-ink-body">
                We may update these Terms of Service from time to time. Material changes will be posted on this page with an updated &quot;Last updated&quot; date. Your continued use of our services after changes constitutes acceptance of the revised terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-ink-primary">
                12. Contact Us
              </h2>
              <p className="text-ink-body">
                If you have questions about these Terms of Service, please contact us:
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

            <section className="space-y-4 border-t border-stone-200 pt-8 mt-8">
              <p className="text-ink-muted text-sm">
                <strong>Disclaimer:</strong> These terms are provided as a general framework for safari travel planning services. They do not constitute legal advice. We recommend consulting with a qualified legal professional to ensure these terms are appropriate for your specific business circumstances and comply with all applicable laws and regulations in your jurisdiction.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
