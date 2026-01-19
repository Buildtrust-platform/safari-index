/**
 * Shared Footer Component
 *
 * Consistent footer across all Vurara Safaris pages.
 * Documentary, operator-grade tone. No promotional language.
 * Includes NAP (Name, Address, Phone) for local SEO signals.
 */

import Link from 'next/link';
import { MapPin, Mail, Phone, Instagram, Facebook, Youtube } from 'lucide-react';

// NAP data for SEO consistency
const COMPANY = {
  name: 'Vurara Safaris',
  address: {
    street: 'De Wetstraat 134',
    city: 'Ridderkerk',
    country: 'Netherlands',
  },
  phone: '+31 6 14855683',
  email: 'hello@vurarasafaris.com',
  socials: {
    instagram: 'https://instagram.com/vurarasafaris',
    facebook: 'https://facebook.com/vurarasafaris',
    youtube: 'https://youtube.com/@vurarasafaris',
    x: 'https://x.com/vurarasafaris',
  },
};

// X (Twitter) icon - not in lucide-react
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface FooterProps {
  /** Tagline variant */
  variant?: 'operator' | 'decision-system';
}

export function Footer({ variant = 'operator' }: FooterProps) {
  const tagline = variant === 'operator'
    ? 'The Truth of the Wild, Revealed'
    : 'Logic-Backed Safari Planning';

  return (
    <footer className="bg-stone-900 text-white py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-editorial text-xl font-semibold">Vurara Safaris</span>
            <p className="text-stone-400 text-sm mt-2 max-w-sm">
              {variant === 'operator'
                ? 'Private safari operator specializing in East and Southern Africa. Logic-backed decisions. Custom-built itineraries.'
                : 'Decision support for safari planning across East and Southern Africa. Clear verdicts. Visible trade-offs.'
              }
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="font-medium text-stone-300 mb-3">Explore</h4>
            <div className="space-y-2">
              <Link href="/trips" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Safaris
              </Link>
              <Link href="/destinations" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Destinations
              </Link>
              <Link href="/activities" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Activities
              </Link>
              <Link href="/when-to-go" className="block text-sm text-stone-400 hover:text-white transition-colors">
                When to Go
              </Link>
            </div>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-medium text-stone-300 mb-3">Resources</h4>
            <div className="space-y-2">
              <Link href="/decisions" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Decisions
              </Link>
              <Link href="/faq" className="block text-sm text-stone-400 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/blog" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Insights
              </Link>
              <Link href="/how-it-works" className="block text-sm text-stone-400 hover:text-white transition-colors">
                How it works
              </Link>
              <Link href="/about" className="block text-sm text-stone-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-sm text-stone-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* NAP Section - Name, Address, Phone for local SEO */}
        <div className="border-t border-stone-800 pt-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-sm text-stone-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-500" />
              <span>{COMPANY.address.street}, {COMPANY.address.city}, {COMPANY.address.country}</span>
            </div>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-stone-500" />
              <span>{COMPANY.email}</span>
            </a>
            <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-stone-500" />
              <span>{COMPANY.phone}</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-stone-500 text-sm">
            Vurara Safaris · {tagline}
          </p>
          <div className="flex items-center gap-6">
            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href={COMPANY.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={COMPANY.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={COMPANY.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-white transition-colors"
                aria-label="Follow us on X"
              >
                <XIcon className="w-5 h-5" />
              </a>
              <a
                href={COMPANY.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-white transition-colors"
                aria-label="Subscribe on YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <span className="text-stone-700">|</span>
            <Link href="/privacy" className="text-sm text-stone-500 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-stone-500 hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
