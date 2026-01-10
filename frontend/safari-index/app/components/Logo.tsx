/**
 * Vurara Safaris Logo Component
 *
 * Renders the rhino logo with wordmark for various contexts.
 * Supports different color variants and sizes.
 *
 * Usage:
 * - Navbar: <Logo variant="dark" /> or <Logo variant="light" />
 * - Footer: <Logo variant="light" size="lg" />
 */

import Image from 'next/image';
import { cn } from '../ui/utils';

interface LogoProps {
  /** Color variant for different backgrounds */
  variant?: 'dark' | 'light' | 'sandstone';
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the wordmark or just the rhino icon */
  showWordmark?: boolean;
  /** Additional className */
  className?: string;
}

const sizeClasses = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
};

export function Logo({
  variant = 'dark',
  size = 'md',
  showWordmark = true,
  className,
}: LogoProps) {
  const logoSrc = {
    dark: '/logo.svg',
    light: '/logo-white.svg',
    sandstone: '/logo-sandstone.svg',
  }[variant];

  const iconSrc = '/icon.svg';

  if (!showWordmark) {
    // Icon-only version (rhino mark)
    return (
      <Image
        src={iconSrc}
        alt="Vurara Safaris"
        width={100}
        height={50}
        className={cn(sizeClasses[size], 'w-auto', className)}
        priority
      />
    );
  }

  return (
    <Image
      src={logoSrc}
      alt="Vurara Safaris"
      width={200}
      height={133}
      className={cn(sizeClasses[size], 'w-auto', className)}
      priority
    />
  );
}

/**
 * Logo Mark - Just the rhino icon without wordmark
 * Useful for favicons, small spaces, and loading states
 */
export function LogoMark({
  variant = 'dark',
  size = 'md',
  className,
}: Omit<LogoProps, 'showWordmark'>) {
  return <Logo variant={variant} size={size} showWordmark={false} className={className} />;
}

export default Logo;
