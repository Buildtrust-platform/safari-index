'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Africa Map Background Component
 *
 * A full-width SVG background featuring:
 * - Simplified geometric outline of Africa (East & Southern focus)
 * - Faint topographic contour lines
 * - Glowing decision nodes at key safari destinations
 * - Logic lines connecting the nodes
 * - Subtle parallax animation on mouse/scroll
 */

interface DecisionNode {
  id: string;
  name: string;
  x: number;
  y: number;
}

// Key safari destination coordinates (relative to viewBox)
const DECISION_NODES: DecisionNode[] = [
  { id: 'kenya', name: 'Kenya', x: 540, y: 280 },
  { id: 'tanzania', name: 'Tanzania', x: 530, y: 320 },
  { id: 'uganda', name: 'Uganda', x: 500, y: 260 },
  { id: 'rwanda', name: 'Rwanda', x: 490, y: 290 },
  { id: 'botswana', name: 'Botswana', x: 440, y: 450 },
  { id: 'south-africa', name: 'South Africa', x: 450, y: 530 },
  { id: 'namibia', name: 'Namibia', x: 380, y: 460 },
  { id: 'zambia', name: 'Zambia', x: 470, y: 400 },
];

// Logic connections between nodes (like Vurara rhino style)
const LOGIC_LINES: [string, string][] = [
  ['kenya', 'tanzania'],
  ['tanzania', 'rwanda'],
  ['rwanda', 'uganda'],
  ['tanzania', 'zambia'],
  ['zambia', 'botswana'],
  ['botswana', 'south-africa'],
  ['botswana', 'namibia'],
  ['zambia', 'namibia'],
];

export function AfricaMapBackground({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset based on mouse position (subtle movement)
      const maxOffset = 15;
      const x = ((e.clientX - centerX) / rect.width) * maxOffset;
      const y = ((e.clientY - centerY) / rect.height) * maxOffset;

      setOffset({ x, y });
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const parallaxY = scrollY * 0.05;
      setOffset(prev => ({ ...prev, y: parallaxY }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getNodeById = (id: string) => DECISION_NODES.find(n => n.id === id);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 700"
        className={`w-full h-full transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradient for node glow */}
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#D97706" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          {/* Subtle glow filter for nodes */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path for Africa outline */}
          <clipPath id="africaClip">
            <path d={AFRICA_OUTLINE} />
          </clipPath>
        </defs>

        {/* Africa continent outline - very faint */}
        <g opacity="0.03">
          <path
            d={AFRICA_OUTLINE}
            fill="none"
            stroke="#1c1917"
            strokeWidth="1"
          />
        </g>

        {/* Topographic contour lines inside Africa */}
        <g clipPath="url(#africaClip)" opacity="0.04">
          {CONTOUR_LINES.map((path, i) => (
            <path
              key={i}
              d={path}
              fill="none"
              stroke="#1c1917"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Logic lines connecting nodes */}
        <g opacity="0.15">
          {LOGIC_LINES.map(([from, to], i) => {
            const fromNode = getNodeById(from);
            const toNode = getNodeById(to);
            if (!fromNode || !toNode) return null;

            return (
              <line
                key={i}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#D97706"
                strokeWidth="0.75"
                strokeDasharray="4 4"
                className="animate-dash"
              />
            );
          })}
        </g>

        {/* Decision nodes with glow */}
        <g>
          {DECISION_NODES.map((node) => (
            <g key={node.id}>
              {/* Outer glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r="12"
                fill="url(#nodeGlow)"
                className="animate-pulse-slow"
              />
              {/* Inner node */}
              <circle
                cx={node.x}
                cy={node.y}
                r="3"
                fill="#D97706"
                opacity="0.5"
                filter="url(#glow)"
              />
              {/* Core */}
              <circle
                cx={node.x}
                cy={node.y}
                r="1.5"
                fill="#D97706"
                opacity="0.8"
              />
            </g>
          ))}
        </g>
      </svg>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -8;
          }
        }
        .animate-dash {
          animation: dash 2s linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Simplified Africa outline path (focused on East & Southern regions)
const AFRICA_OUTLINE = `
  M 350 100
  Q 380 90, 420 95
  Q 480 100, 520 120
  L 560 140
  Q 590 160, 600 200
  L 610 240
  Q 615 260, 610 280
  L 600 300
  Q 580 320, 570 350
  L 560 380
  Q 555 400, 550 420
  L 540 450
  Q 530 480, 510 510
  L 490 540
  Q 470 560, 450 570
  L 420 575
  Q 390 570, 370 555
  L 350 530
  Q 340 500, 345 470
  L 355 440
  Q 365 410, 360 380
  L 350 350
  Q 340 320, 330 290
  L 320 260
  Q 310 230, 300 200
  L 290 170
  Q 300 140, 320 120
  Q 340 105, 350 100
  Z
`;

// Topographic contour lines (concentric, simplified)
const CONTOUR_LINES = [
  // Outer contours
  `M 360 120 Q 400 110, 450 115 Q 500 125, 540 150 L 570 180 Q 585 210, 580 250 L 570 290 Q 555 330, 540 370 L 520 420 Q 500 470, 470 510 L 440 540 Q 410 555, 380 545 L 360 520 Q 350 490, 355 455 L 365 420 Q 375 385, 365 350 L 355 310 Q 345 275, 335 240 L 325 200 Q 330 165, 345 140 Q 355 125, 360 120`,

  // Middle contours
  `M 380 150 Q 420 140, 460 150 Q 490 165, 520 190 L 545 220 Q 555 250, 550 285 L 540 320 Q 525 360, 510 400 L 490 450 Q 470 490, 445 515 L 420 530 Q 400 535, 385 520 L 375 490 Q 370 460, 375 425 L 385 390 Q 390 355, 380 320 L 370 280 Q 365 250, 355 220 L 350 185 Q 360 160, 380 150`,

  // Inner contours
  `M 400 180 Q 430 175, 465 185 Q 485 200, 505 225 L 520 255 Q 525 280, 520 310 L 510 345 Q 495 385, 480 420 L 460 460 Q 445 485, 425 495 L 410 500 Q 400 495, 395 480 L 390 450 Q 390 420, 395 390 L 400 355 Q 400 325, 395 295 L 385 260 Q 385 230, 395 205 Q 400 190, 400 180`,

  // Core contours
  `M 420 210 Q 445 205, 470 220 Q 485 235, 495 260 L 500 290 Q 500 315, 495 340 L 485 375 Q 475 405, 460 430 L 445 455 Q 435 465, 425 460 L 415 440 Q 415 415, 420 385 L 425 350 Q 420 320, 415 290 L 410 255 Q 415 230, 420 210`,

  // Innermost contour
  `M 440 250 Q 460 245, 475 260 Q 480 275, 480 295 L 475 325 Q 465 355, 455 380 L 445 400 Q 440 405, 435 400 L 435 375 Q 440 345, 440 315 L 438 280 Q 440 260, 440 250`,
];

export default AfricaMapBackground;
