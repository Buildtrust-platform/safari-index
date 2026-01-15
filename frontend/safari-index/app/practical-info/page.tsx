/**
 * Practical Info Hub Page
 *
 * Comprehensive guide to safari travel logistics:
 * - Visa requirements by destination
 * - Health and vaccinations
 * - Packing essentials
 * - Flight and luggage info
 * - Safety and insurance
 *
 * Per governance: documentary, calm tone. No hype.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  FileCheck,
  Stethoscope,
  Briefcase,
  Plane,
  Shield,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';

export const metadata: Metadata = {
  title: 'Practical Safari Info | Visa, Health & Packing Guide | Vurara Safaris',
  description:
    'Essential practical information for your African safari: visa requirements, vaccinations, packing lists, luggage restrictions, and safety guidance.',
  alternates: {
    canonical: '/practical-info',
  },
};

// Destination visa summary
const VISA_INFO = [
  {
    country: 'Tanzania',
    requirement: 'E-visa or visa on arrival',
    processing: '2-7 days for e-visa',
    cost: '$50 USD',
    link: '/destinations/tanzania',
  },
  {
    country: 'Kenya',
    requirement: 'E-visa required',
    processing: '2-7 days',
    cost: '$51 USD',
    link: '/destinations/kenya',
  },
  {
    country: 'Botswana',
    requirement: 'Visa-free for most nationalities',
    processing: 'N/A',
    cost: 'Free',
    link: '/destinations/botswana',
  },
  {
    country: 'South Africa',
    requirement: 'Visa-free for most nationalities',
    processing: 'N/A',
    cost: 'Free',
    link: '/destinations/south-africa',
  },
  {
    country: 'Rwanda',
    requirement: 'Visa on arrival or e-visa',
    processing: '1-3 days for e-visa',
    cost: '$30 USD',
    link: '/destinations/rwanda',
  },
  {
    country: 'Uganda',
    requirement: 'E-visa required',
    processing: '2-7 days',
    cost: '$50 USD',
    link: '/destinations/uganda',
  },
  {
    country: 'Namibia',
    requirement: 'Visa-free for most nationalities',
    processing: 'N/A',
    cost: 'Free',
    link: '/destinations/namibia',
  },
  {
    country: 'Zambia',
    requirement: 'E-visa or KAZA UniVisa',
    processing: '2-5 days',
    cost: '$50-80 USD',
    link: '/destinations/zambia',
  },
];

// Packing essentials
const PACKING_CATEGORIES = [
  {
    category: 'Clothing',
    items: [
      'Neutral colors (khaki, olive, beige, brown)',
      'Light layers for temperature changes',
      'Long sleeves and pants for sun/insect protection',
      'Warm fleece or jacket for early morning drives',
      'Wide-brimmed hat',
      'Comfortable walking shoes',
      'Sandals for camp',
    ],
  },
  {
    category: 'Gear',
    items: [
      'Binoculars (essential for wildlife viewing)',
      'Camera with zoom lens',
      'Extra memory cards and batteries',
      'Headlamp or flashlight',
      'Reusable water bottle',
      'Power bank for charging',
      'Universal adapter',
    ],
  },
  {
    category: 'Health & Safety',
    items: [
      'Prescription medications (in original containers)',
      'Insect repellent (DEET-based)',
      'Sunscreen (SPF 30+)',
      'Hand sanitizer',
      'Basic first aid kit',
      'Malaria prophylaxis (if prescribed)',
      'Personal toiletries',
    ],
  },
  {
    category: 'Documents',
    items: [
      'Passport (valid 6+ months)',
      'Visa documents if required',
      'Travel insurance details',
      'Vaccination certificates',
      'Copies of reservations',
      'Emergency contact numbers',
      'Credit cards and small amount of cash',
    ],
  },
];

export default function PracticalInfoPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      {/* Hero */}
      <div className="bg-stone-900 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Vurara Safaris
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Practical Info</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-4">
            Practical Safari Information
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            Everything you need to know before your trip: visas, health requirements,
            packing essentials, and travel logistics.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Quick jump links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
          {[
            { icon: FileCheck, label: 'Visas', href: '#visas' },
            { icon: Stethoscope, label: 'Health', href: '#health' },
            { icon: Briefcase, label: 'Packing', href: '#packing' },
            { icon: Plane, label: 'Flights', href: '#flights' },
            { icon: Shield, label: 'Safety', href: '#safety' },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-sm transition-all text-center"
            >
              <Icon className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-stone-700">{label}</span>
            </a>
          ))}
        </div>

        {/* Visa Requirements Section */}
        <section id="visas" className="mb-12 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-amber-700" />
            </div>
            <h2 className="font-editorial text-2xl font-semibold text-stone-900">
              Visa Requirements
            </h2>
          </div>
          <p className="text-stone-600 mb-6">
            Requirements vary by nationality. The information below applies to US, UK, EU,
            and most Commonwealth passport holders. Always verify current requirements with
            the relevant embassy or consulate.
          </p>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="text-left px-4 py-3 font-medium text-stone-700">Country</th>
                    <th className="text-left px-4 py-3 font-medium text-stone-700">Requirement</th>
                    <th className="text-left px-4 py-3 font-medium text-stone-700 hidden sm:table-cell">Processing</th>
                    <th className="text-left px-4 py-3 font-medium text-stone-700 hidden md:table-cell">Cost</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {VISA_INFO.map((visa) => (
                    <tr key={visa.country} className="hover:bg-stone-50">
                      <td className="px-4 py-3 font-medium text-stone-900">{visa.country}</td>
                      <td className="px-4 py-3 text-stone-600">{visa.requirement}</td>
                      <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{visa.processing}</td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{visa.cost}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={visa.link}
                          className="text-amber-700 hover:text-amber-800 text-xs font-medium"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">Important</p>
                <p className="text-amber-700">
                  Passport must be valid for at least 6 months from entry date with 2+ blank pages.
                  Apply for visas at least 2-4 weeks before travel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Health & Vaccinations Section */}
        <section id="health" className="mb-12 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-green-700" />
            </div>
            <h2 className="font-editorial text-2xl font-semibold text-stone-900">
              Health & Vaccinations
            </h2>
          </div>
          <p className="text-stone-600 mb-6">
            Consult a travel medicine specialist 6-8 weeks before your trip.
            Requirements depend on your destinations and personal health history.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-3">Recommended Vaccinations</h3>
              <ul className="space-y-2 text-sm">
                {[
                  'Yellow Fever (required for some countries)',
                  'Hepatitis A & B',
                  'Typhoid',
                  'Tetanus-Diphtheria',
                  'Routine vaccinations up to date',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-stone-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-3">Malaria Prevention</h3>
              <p className="text-sm text-stone-600 mb-3">
                Most safari areas have malaria risk. Your doctor may prescribe:
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  'Malarone (atovaquone-proguanil)',
                  'Doxycycline',
                  'Mefloquine (Lariam)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-stone-600">
                    <span className="text-amber-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-500 mt-3">
                Also use insect repellent, sleep under mosquito nets, and wear long sleeves at dusk.
              </p>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Yellow Fever Certificate:</strong> Required for entry to Tanzania, Kenya,
              Uganda, and Rwanda if traveling from a yellow fever endemic country. Some camps in
              these areas may require proof regardless of origin.
            </p>
          </div>
        </section>

        {/* Packing List Section */}
        <section id="packing" className="mb-12 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-700" />
            </div>
            <h2 className="font-editorial text-2xl font-semibold text-stone-900">
              Packing Essentials
            </h2>
          </div>
          <p className="text-stone-600 mb-6">
            Pack light in soft-sided bags. Most camps have laundry service.
            Focus on practical, neutral-colored clothing.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {PACKING_CATEGORIES.map((category) => (
              <div
                key={category.category}
                className="bg-white rounded-xl border border-stone-200 p-5"
              >
                <h3 className="font-medium text-stone-900 mb-3">{category.category}</h3>
                <ul className="space-y-1.5 text-sm">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-stone-600">
                      <span className="text-stone-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">Luggage Restrictions</p>
                <p className="text-blue-700">
                  Bush planes typically allow 15-20kg (33-44lbs) per person in soft-sided bags only.
                  Hard suitcases are not permitted. Camera equipment usually counts as hand luggage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Flights & Transfers Section */}
        <section id="flights" className="mb-12 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Plane className="w-5 h-5 text-purple-700" />
            </div>
            <h2 className="font-editorial text-2xl font-semibold text-stone-900">
              Flights & Transfers
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-2">International Flights</h3>
              <p className="text-sm text-stone-600">
                Most clients book international flights independently to use miles or preferred airlines.
                Main gateways: Nairobi (NBO), Kilimanjaro (JRO), Johannesburg (JNB), or Addis Ababa (ADD)
                for connections. We advise on routing and coordinate arrival times with your safari.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-2">Internal Flights</h3>
              <p className="text-sm text-stone-600">
                We arrange all internal transfers: bush planes between camps, regional flights, and
                road transfers. Bush planes are small (typically 6-12 seats) and fly at lower altitudes
                with spectacular views. Most have strict luggage limits.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-2">Road Transfers</h3>
              <p className="text-sm text-stone-600">
                Some routes use 4x4 vehicles with experienced drivers. Transfer times can be long
                (3-6 hours) but often include wildlife viewing opportunities. All vehicles have
                charging ports and cold drinks.
              </p>
            </div>
          </div>
        </section>

        {/* Safety & Insurance Section */}
        <section id="safety" className="mb-12 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-700" />
            </div>
            <h2 className="font-editorial text-2xl font-semibold text-stone-900">
              Safety & Insurance
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-2">Safari Safety</h3>
              <p className="text-sm text-stone-600 mb-3">
                Safari travel has an excellent safety record. Camps and lodges are secure, guides are
                highly trained, and wildlife encounters are managed professionally. Follow your guide's
                instructions at all times.
              </p>
              <ul className="space-y-1.5 text-sm">
                {[
                  'Stay in vehicle during game drives unless instructed otherwise',
                  'Never approach wildlife on foot without a qualified guide',
                  'Use flashlights when walking at night in camps',
                  'Keep tent zipped at night',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-stone-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-medium text-stone-900 mb-2">Travel Insurance</h3>
              <p className="text-sm text-stone-600 mb-3">
                Comprehensive travel insurance with medical evacuation coverage is essential.
                Standard policies often exclude safari activities - confirm your coverage includes:
              </p>
              <ul className="space-y-1.5 text-sm">
                {[
                  'Medical evacuation by air ambulance',
                  'Trip cancellation and interruption',
                  'Baggage loss and delay',
                  'Safari activities and wildlife encounters',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-stone-600">
                    <span className="text-amber-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800 mb-1">Medical Evacuation</p>
                <p className="text-red-700">
                  Many safari areas are remote. Medical evacuation insurance is not optional -
                  evacuation costs can exceed $50,000. We can recommend providers if needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-xl border border-amber-200/50 p-6 text-center">
          <h3 className="font-medium text-stone-900 mb-2">
            Ready to start planning?
          </h3>
          <p className="text-stone-600 text-sm mb-4">
            We handle all the logistics - you just need to pack and show up.
          </p>
          <Link
            href="/inquire"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
          >
            Plan Your Safari
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
