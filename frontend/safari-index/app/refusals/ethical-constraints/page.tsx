/**
 * Refusal Example: Ethical Constraints
 *
 * Demonstrates how Safari Index refuses plans that involve
 * activities or operators that violate ethical standards.
 *
 * Static educational content. No backend logic.
 */

import Link from 'next/link';
import { Navbar, Footer } from '../../components/layout';
import { ChevronRight, Shield, XCircle, Heart, AlertTriangle, Users } from 'lucide-react';

export const metadata = {
  title: 'Refusal Example: Ethical Constraints | Safari Index',
  description: 'Why Safari Index refused a safari plan requesting activities that harm wildlife or exploit local communities.',
};

export default function EthicalRefusalPage() {
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
            Safari Index refuses plans involving activities or operators
            that harm wildlife, exploit communities, or violate conservation
            principles. Some requests cannot be accommodated regardless of budget.
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
                <Shield className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide">Refusal Type</p>
                <p className="font-medium text-stone-900">Ethical Constraint Violation</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-stone-500 mb-1">What was requested</p>
                <p className="text-stone-900">
                  A family safari including a visit to a facility offering
                  &ldquo;lion cub interactions&rdquo; and walking with elephants
                  at a sanctuary. The client also requested a specific lodge
                  known for problematic labor practices.
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500 mb-1">Why Safari Index refuses</p>
                <p className="text-stone-900">
                  Lion cub interaction facilities are directly linked to the
                  canned hunting industry and cub petting trauma cycles.
                  Elephant walking operations typically involve cruel training
                  methods. The requested lodge has documented exploitation of
                  local staff. These are not judgment calls&mdash;they are
                  well-documented harms that Safari Index will not facilitate.
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
                  <p className="font-medium text-stone-900">Cub interaction facilities</p>
                  <p className="text-sm text-stone-500">
                    Cubs are bred for tourist handling, then sold to canned hunting operations when too large; a documented pipeline
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Elephant walking operations</p>
                  <p className="text-sm text-stone-500">
                    Require &ldquo;breaking&rdquo; wild elephants through isolation and physical domination; trauma-based compliance
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Labor exploitation</p>
                  <p className="text-sm text-stone-500">
                    Documented cases of wage theft, unsafe conditions, and community displacement at the requested property
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">False sanctuary claims</p>
                  <p className="text-sm text-stone-500">
                    Facilities marketed as &ldquo;sanctuaries&rdquo; that actively breed animals for commercial exploitation
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Understanding the harm */}
        <section className="mb-10">
          <h2 className="font-editorial text-xl font-semibold text-stone-900 mb-4">
            Understanding the Harm
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-700" />
                </div>
                <h3 className="font-medium text-stone-900">The cub petting pipeline</h3>
              </div>
              <p className="text-sm text-stone-600">
                Lion cubs are removed from mothers within days of birth to be
                handled by tourists. This creates a cycle: cubs grow too large
                for petting (around 6 months), are replaced by new cubs, and the
                older animals are sold to &ldquo;walking with lions&rdquo;
                programs. When they mature fully, many are sold to canned hunting
                operations where they are shot in enclosed spaces. The tourist
                paying for cub photos is funding this entire chain.
              </p>
            </div>
            <div className="p-4 border-b border-stone-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-700" />
                </div>
                <h3 className="font-medium text-stone-900">Elephant training reality</h3>
              </div>
              <p className="text-sm text-stone-600">
                Wild elephants do not naturally allow humans to ride them or
                walk beside them on command. This behavior is achieved through a
                process called &ldquo;crushing&rdquo;&mdash;isolating young
                elephants, restricting movement, and using physical punishment
                until the animal&apos;s spirit is broken. The calm elephant a
                tourist walks with has typically endured weeks of trauma.
                Legitimate sanctuaries do not offer interactive elephant experiences.
              </p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-red-700" />
                </div>
                <h3 className="font-medium text-stone-900">Community impact</h3>
              </div>
              <p className="text-sm text-stone-600">
                Safari tourism can benefit local communities through employment,
                revenue sharing, and conservation partnerships. However, some
                operators extract value while providing minimal wages, unsafe
                working conditions, or displacing communities from traditional
                lands. Safari Index maintains a list of operators with documented
                ethical violations and will not recommend them regardless of
                their wildlife offerings or price points.
              </p>
            </div>
          </div>
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
                  <Heart className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Replace with ethical wildlife encounters</p>
                  <p className="text-sm text-stone-500 mt-1">
                    Walking safaris with wild animals at a safe distance, game
                    drives in reserves with free-roaming predators, or visits to
                    genuine sanctuaries that do not offer interaction. Wild
                    lion sightings are far more meaningful than cub photos.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Choose verified ethical operators</p>
                  <p className="text-sm text-stone-500 mt-1">
                    Safari Index works with operators who pay fair wages, invest
                    in communities, and maintain transparent conservation
                    practices. Many excellent lodges exist at similar price
                    points without the ethical concerns.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Consider community-owned alternatives</p>
                  <p className="text-sm text-stone-500 mt-1">
                    Community conservancies in Kenya, Namibia, and Tanzania
                    offer excellent wildlife viewing while directly benefiting
                    local populations. These are the properties that deserve
                    tourist support.
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
              These are not gray areas. The harm caused by cub interaction
              facilities, elephant walking operations, and exploitative lodges is
              extensively documented by conservation organizations, investigative
              journalists, and animal welfare experts. Safari Index will not
              facilitate these activities even when clients specifically request
              them. We understand that travelers often don&apos;t know the
              background&mdash;the marketing is designed to obscure it. Our job is
              to provide that context and offer alternatives that create positive
              rather than negative impacts.
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
              href="/decisions/ethical-safari-operators"
              className="block text-amber-700 hover:text-amber-800"
            >
              How to identify ethical safari operators
            </Link>
            <Link
              href="/decisions/community-conservancies"
              className="block text-amber-700 hover:text-amber-800"
            >
              Community conservancies explained
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
