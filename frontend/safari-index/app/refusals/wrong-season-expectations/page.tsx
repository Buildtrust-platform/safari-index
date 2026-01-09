/**
 * Refusal Example: Wrong Season Expectations
 *
 * Demonstrates how Safari Index refuses plans where seasonal
 * timing makes the requested experience impossible.
 *
 * Static educational content. No backend logic.
 */

import Link from 'next/link';
import { Navbar, Footer } from '../../components/layout';
import { ChevronRight, Calendar, XCircle, CloudRain, Sun, Thermometer } from 'lucide-react';

export const metadata = {
  title: 'Refusal Example: Wrong Season | Safari Index',
  description: 'Why Safari Index refused a safari plan requesting dry season wildlife concentrations during peak green season.',
};

export default function WrongSeasonRefusalPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar variant="solid" />

      {/* Header */}
      <div className="bg-stone-900 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Safari Index
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/how-it-works" className="hover:text-white transition-colors">
              How it works
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-stone-300">Refusal example</span>
          </div>

          {/* Refusal badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-900/30 border border-red-700/50 rounded-full text-red-300 text-sm mb-4">
            <XCircle className="w-4 h-4" />
            <span>Plan Refused</span>
          </div>

          <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-white mb-4">
            Why this safari plan was refused
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            Safari Index refuses plans when seasonal conditions make the
            requested wildlife experience impossible. Booking against the
            seasons wastes money and creates disappointment.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">

        {/* Refusal Summary */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Refusal Summary
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="border-b border-stone-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide">Refusal Type</p>
                <p className="font-medium text-stone-900">Seasonal Timing Mismatch</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-stone-500 mb-1">What was requested</p>
                <p className="text-stone-900">
                  A Tanzania safari in April focused on seeing large predator
                  concentrations and dramatic wildlife interactions at waterholes.
                  The client wanted &ldquo;David Attenborough scenes&rdquo; with
                  lions hunting at water sources.
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500 mb-1">Why it fails under real conditions</p>
                <p className="text-stone-900">
                  April is peak green season in Tanzania. Water is everywhere.
                  Animals disperse across the landscape because they don&apos;t need
                  to concentrate at waterholes. Grass is tall, reducing visibility.
                  Many camps close or offer reduced activities. The dramatic
                  waterhole scenes the client wants only occur in the dry season
                  (July-October) when water scarcity forces animals together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Constraints Breakdown */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Constraints Violated
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Water distribution</p>
                  <p className="text-sm text-stone-500">
                    April rainfall creates temporary water sources everywhere; animals have no reason to concentrate
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Vegetation density</p>
                  <p className="text-sm text-stone-500">
                    Tall grass (1-2 meters) obscures wildlife; even large predators become difficult to spot
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Predator hunting patterns</p>
                  <p className="text-sm text-stone-500">
                    Lions hunt at night in green season when prey is dispersed; no daytime waterhole ambushes
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Camp accessibility</p>
                  <p className="text-sm text-stone-500">
                    Many premium camps close during long rains; those open have limited game drive routes
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Seasonal comparison */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Seasonal Reality
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left p-3 font-medium text-stone-700">Factor</th>
                  <th className="text-center p-3 font-medium text-stone-700">April (Green)</th>
                  <th className="text-center p-3 font-medium text-stone-700">September (Dry)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="p-3 text-stone-900 flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-stone-400" />
                    Rainfall
                  </td>
                  <td className="p-3 text-center text-red-600">150-200mm</td>
                  <td className="p-3 text-center text-green-600">0-10mm</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-stone-400" />
                    Visibility
                  </td>
                  <td className="p-3 text-center text-red-600">Poor (tall grass)</td>
                  <td className="p-3 text-center text-green-600">Excellent</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Wildlife concentration</td>
                  <td className="p-3 text-center text-red-600">Dispersed</td>
                  <td className="p-3 text-center text-green-600">At water sources</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Predator activity</td>
                  <td className="p-3 text-center text-red-600">Nocturnal</td>
                  <td className="p-3 text-center text-green-600">Daytime hunting</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-900">Camp availability</td>
                  <td className="p-3 text-center text-red-600">Limited (30-50%)</td>
                  <td className="p-3 text-center text-green-600">Full (100%)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-stone-500 mt-3">
            Data represents typical conditions in northern Tanzania (Serengeti, Ngorongoro, Tarangire).
          </p>
        </section>

        {/* What would make this viable */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            What would make this viable
          </h2>
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Move to dry season (July-October)</p>
                  <p className="text-sm text-stone-500 mt-1">
                    For waterhole drama and predator action, the dry season is essential.
                    September-October offers peak concentration as water becomes scarce.
                    This is when documentary crews film those dramatic hunting scenes.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <CloudRain className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Embrace green season for what it offers</p>
                  <p className="text-sm text-stone-500 mt-1">
                    April has its own rewards: dramatic skies, birthing season for many
                    species, migratory birds, lush landscapes, fewer tourists. If the
                    client adjusts expectations, green season can be excellent&mdash;just
                    not for waterhole predator action.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Thermometer className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Consider southern hemisphere alternatives</p>
                  <p className="text-sm text-stone-500 mt-1">
                    If April is the only available time, consider destinations where
                    April falls in the dry season: parts of Namibia, certain Zimbabwe
                    regions, or early dry season in Zambia&apos;s South Luangwa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Safari Index refuses */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Why Safari Index refuses instead of guessing
          </h2>
          <div className="bg-stone-100 rounded-xl border border-stone-200 p-6">
            <p className="text-stone-700 leading-relaxed">
              Many operators would book this April safari with vague promises about
              &ldquo;anything can happen on safari.&rdquo; Technically true, but
              statistically misleading. The client would spend significant money
              hoping to see something that almost never happens in April. Safari
              Index refuses to sell hope when the conditions don&apos;t support the
              expectation. Seasonal realities are predictable. Ignoring them is
              negligent, not optimistic.
            </p>
          </div>
        </section>

        {/* Related links */}
        <section className="border-t border-stone-200 pt-8">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">
            Related
          </h3>
          <div className="space-y-2">
            <Link
              href="/decisions/best-time-to-visit-tanzania"
              className="block text-amber-700 hover:text-amber-800"
            >
              Best time to visit Tanzania
            </Link>
            <Link
              href="/decisions/green-season-safari-worth-it"
              className="block text-amber-700 hover:text-amber-800"
            >
              Is a green season safari worth it?
            </Link>
            <Link
              href="/how-it-works"
              className="block text-amber-700 hover:text-amber-800"
            >
              How Safari Index makes decisions
            </Link>
          </div>
        </section>

      </div>

      <Footer variant="decision-system" />
    </main>
  );
}
