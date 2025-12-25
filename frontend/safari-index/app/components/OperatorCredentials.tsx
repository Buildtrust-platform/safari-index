/**
 * Operator Credentials Strip
 *
 * A quiet, factual credential strip establishing Safari Index as a
 * professional safari operator. No marketing slogans. Only facts.
 *
 * Per governance:
 * - Documentary tone
 * - No hype or urgency
 * - Factual statements only
 * - Builds trust through substance, not claims
 */

import { MapPin, Users, Compass, Shield } from 'lucide-react';

interface CredentialItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function CredentialItem({ icon: Icon, label, value }: CredentialItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-stone-500" />
      </div>
      <div>
        <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-stone-900 font-medium">{value}</p>
      </div>
    </div>
  );
}

interface OperatorCredentialsProps {
  /** Display variant - 'compact' for inline, 'full' for standalone section */
  variant?: 'compact' | 'full';
  /** Optional className override */
  className?: string;
}

/**
 * OperatorCredentials - Factual trust signals for Safari Index as operator
 */
export function OperatorCredentials({
  variant = 'full',
  className = '',
}: OperatorCredentialsProps) {
  const credentials = [
    {
      icon: MapPin,
      label: 'Destinations',
      value: 'East & Southern Africa',
    },
    {
      icon: Users,
      label: 'Safari type',
      value: 'Private, custom-built',
    },
    {
      icon: Compass,
      label: 'Operating model',
      value: 'Direct ground operations',
    },
    {
      icon: Shield,
      label: 'Decision support',
      value: 'Logic-backed planning',
    },
  ];

  if (variant === 'compact') {
    return (
      <div
        className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-600 ${className}`}
        data-testid="operator-credentials"
      >
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-stone-400" />
          East & Southern Africa
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-stone-400" />
          Private safaris
        </span>
        <span className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-stone-400" />
          Custom planning
        </span>
      </div>
    );
  }

  return (
    <section
      className={`py-8 ${className}`}
      aria-label="Operator credentials"
      data-testid="operator-credentials"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {credentials.map((cred) => (
          <CredentialItem
            key={cred.label}
            icon={cred.icon}
            label={cred.label}
            value={cred.value}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * OperatorStatement - Brief positioning statement for hero areas
 */
export function OperatorStatement({ className = '' }: { className?: string }) {
  return (
    <p
      className={`text-stone-600 leading-relaxed ${className}`}
      data-testid="operator-statement"
    >
      Safari Index plans and operates private safaris across East and Southern Africa.
      Every trip is custom-built. Every decision is logic-backed.
    </p>
  );
}

/**
 * OperatorBadge - Minimal badge for cards and headers
 */
export function OperatorBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-100 rounded-full ${className}`}
      data-testid="operator-badge"
    >
      <Compass className="w-3 h-3" />
      Safari Index Operated
    </span>
  );
}

export default OperatorCredentials;
