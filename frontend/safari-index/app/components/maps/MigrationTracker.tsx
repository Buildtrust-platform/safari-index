/**
 * Migration Tracker Map Component
 *
 * Interactive SVG map showing the Great Migration's position
 * throughout the year. Allows users to see where the herds
 * are during their planned travel month.
 *
 * Per governance: documentary, calm, safari-native tone.
 */

'use client';

import { useState, useMemo } from 'react';
import { Calendar, MapPin, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../ui/utils';

const MONTHS = [
  { value: 1, name: 'January', short: 'Jan' },
  { value: 2, name: 'February', short: 'Feb' },
  { value: 3, name: 'March', short: 'Mar' },
  { value: 4, name: 'April', short: 'Apr' },
  { value: 5, name: 'May', short: 'May' },
  { value: 6, name: 'June', short: 'Jun' },
  { value: 7, name: 'July', short: 'Jul' },
  { value: 8, name: 'August', short: 'Aug' },
  { value: 9, name: 'September', short: 'Sep' },
  { value: 10, name: 'October', short: 'Oct' },
  { value: 11, name: 'November', short: 'Nov' },
  { value: 12, name: 'December', short: 'Dec' },
] as const;

/**
 * Migration position data by month
 * Coordinates are relative to the Serengeti-Mara ecosystem SVG
 */
interface MigrationPhase {
  month: number;
  location: string;
  region: string;
  description: string;
  x: number;
  y: number;
  highlight: string;
  event?: string;
}

const MIGRATION_PHASES: MigrationPhase[] = [
  {
    month: 1,
    location: 'Southern Serengeti',
    region: 'Ndutu & Ngorongoro border',
    description: 'The herds gather on the short-grass plains for calving season. Over 8,000 calves born daily at peak.',
    x: 55,
    y: 85,
    highlight: 'Calving season begins',
    event: 'calving-season',
  },
  {
    month: 2,
    location: 'Southern Serengeti',
    region: 'Ndutu area',
    description: 'Peak calving with predator activity at its highest. Cheetah and lion congregate for easy hunting.',
    x: 52,
    y: 82,
    highlight: 'Peak calving, predator action',
    event: 'calving-season',
  },
  {
    month: 3,
    location: 'Southern/Central Serengeti',
    region: 'Ndutu to Seronera',
    description: 'Rains begin, herds start moving northwest. Last chance for calving viewing.',
    x: 48,
    y: 72,
    highlight: 'Herds begin moving north',
  },
  {
    month: 4,
    location: 'Central Serengeti',
    region: 'Seronera Valley',
    description: 'Long rains, herds spread across central Serengeti. Less predictable but dramatic skies.',
    x: 45,
    y: 60,
    highlight: 'Scattered across central plains',
  },
  {
    month: 5,
    location: 'Central/Western Serengeti',
    region: 'Western Corridor',
    description: 'Herds move toward the Western Corridor. Grumeti River crossings possible in late May.',
    x: 35,
    y: 50,
    highlight: 'Western Corridor movement',
  },
  {
    month: 6,
    location: 'Western Serengeti',
    region: 'Grumeti River',
    description: 'Dramatic Grumeti River crossings. Crocodiles await. Fewer tourists than Mara crossings.',
    x: 28,
    y: 42,
    highlight: 'Grumeti River crossings',
  },
  {
    month: 7,
    location: 'Northern Serengeti / Masai Mara',
    region: 'Kogatende & Lamai',
    description: 'Herds push north toward Kenya. First Mara River crossings of the season.',
    x: 38,
    y: 28,
    highlight: 'Mara River crossings begin',
    event: 'migration-crossing',
  },
  {
    month: 8,
    location: 'Masai Mara / Northern Serengeti',
    region: 'Mara Triangle & North Serengeti',
    description: 'Peak river crossing season. Dramatic wildlife spectacle with crocodiles and big cats.',
    x: 45,
    y: 18,
    highlight: 'Peak crossing season',
    event: 'migration-crossing',
  },
  {
    month: 9,
    location: 'Masai Mara',
    region: 'Mara Conservancies',
    description: 'Herds scattered across the Mara. Multiple crossing points active. Excellent predator viewing.',
    x: 50,
    y: 12,
    highlight: 'Mara crossings continue',
    event: 'migration-crossing',
  },
  {
    month: 10,
    location: 'Masai Mara / Northern Serengeti',
    region: 'Border region',
    description: 'Short rains trigger southward movement. Last crossings of the season.',
    x: 48,
    y: 22,
    highlight: 'Herds return south',
    event: 'migration-south',
  },
  {
    month: 11,
    location: 'Central Serengeti',
    region: 'Seronera & Naabi',
    description: 'Herds move through central Serengeti following the rains south.',
    x: 50,
    y: 55,
    highlight: 'Southward migration',
    event: 'migration-south',
  },
  {
    month: 12,
    location: 'Southern Serengeti',
    region: 'Approaching Ndutu',
    description: 'Herds arrive on the southern plains as grasses regenerate. Cycle prepares to restart.',
    x: 55,
    y: 75,
    highlight: 'Arriving at calving grounds',
  },
];

/**
 * Key locations on the migration map
 */
const LANDMARKS = [
  { id: 'mara', name: 'Masai Mara', x: 48, y: 8, country: 'kenya' },
  { id: 'lamai', name: 'Lamai Wedge', x: 42, y: 20, country: 'tanzania' },
  { id: 'kogatende', name: 'Kogatende', x: 52, y: 25, country: 'tanzania' },
  { id: 'grumeti', name: 'Grumeti', x: 25, y: 40, country: 'tanzania' },
  { id: 'seronera', name: 'Seronera', x: 45, y: 55, country: 'tanzania' },
  { id: 'ndutu', name: 'Ndutu', x: 55, y: 80, country: 'tanzania' },
  { id: 'ngorongoro', name: 'Ngorongoro', x: 70, y: 75, country: 'tanzania' },
];

interface MigrationTrackerProps {
  initialMonth?: number;
  className?: string;
  compact?: boolean;
}

export function MigrationTracker({
  initialMonth,
  className = '',
  compact = false,
}: MigrationTrackerProps) {
  const currentMonth = initialMonth || new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const phase = useMemo(
    () => MIGRATION_PHASES.find((p) => p.month === selectedMonth) || MIGRATION_PHASES[0],
    [selectedMonth]
  );

  const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
  const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;

  const handlePrevMonth = () => setSelectedMonth(prevMonth);
  const handleNextMonth = () => setSelectedMonth(nextMonth);

  return (
    <div className={cn('bg-white rounded-xl border border-stone-200 overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            <h3 className="font-medium text-stone-900">Great Migration Tracker</h3>
          </div>
          {/* Month selector */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-2 py-1 text-sm bg-white border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleNextMonth}
              className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className={cn('flex', compact ? 'flex-col' : 'flex-col lg:flex-row')}>
        {/* Map */}
        <div className={cn('relative', compact ? 'p-4' : 'p-6 lg:w-2/3')}>
          <svg
            viewBox="0 0 100 100"
            className="w-full"
            style={{ maxHeight: compact ? '250px' : '400px' }}
            role="img"
            aria-label={`Migration map showing herds in ${phase.location} during ${MONTHS[selectedMonth - 1].name}`}
          >
            {/* Background gradient for terrain */}
            <defs>
              <linearGradient id="terrain" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e7e5e4" />
                <stop offset="100%" stopColor="#d6d3d1" />
              </linearGradient>
              <linearGradient id="water" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>

            {/* Kenya background */}
            <path
              d="M 0 0 L 100 0 L 100 20 Q 80 18 60 20 Q 40 22 20 20 L 0 18 Z"
              fill="#fef3c7"
              opacity="0.5"
            />
            <text x="85" y="10" fontSize="4" fill="#78716c" fontWeight="500">
              KENYA
            </text>

            {/* Tanzania background */}
            <path
              d="M 0 18 Q 20 20 40 22 Q 60 20 80 18 L 100 20 L 100 100 L 0 100 Z"
              fill="#d9f99d"
              opacity="0.3"
            />
            <text x="85" y="90" fontSize="4" fill="#78716c" fontWeight="500">
              TANZANIA
            </text>

            {/* Border line */}
            <path
              d="M 0 18 Q 20 20 40 22 Q 60 20 80 18 L 100 20"
              fill="none"
              stroke="#78716c"
              strokeWidth="0.5"
              strokeDasharray="2 1"
            />

            {/* Mara River */}
            <path
              d="M 30 15 Q 45 20 60 18"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <text x="45" y="24" fontSize="3" fill="#3b82f6">
              Mara River
            </text>

            {/* Grumeti River */}
            <path
              d="M 15 38 Q 25 42 35 40"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <text x="18" y="36" fontSize="2.5" fill="#3b82f6">
              Grumeti
            </text>

            {/* Serengeti outline */}
            <path
              d="M 20 30 Q 30 25 50 28 Q 70 30 75 45 Q 78 65 70 80 Q 60 90 40 88 Q 20 85 18 70 Q 15 50 20 30"
              fill="none"
              stroke="#a3e635"
              strokeWidth="0.5"
              strokeDasharray="3 2"
              opacity="0.7"
            />
            <text x="40" y="65" fontSize="3" fill="#65a30d" opacity="0.7">
              SERENGETI
            </text>

            {/* Migration path (dashed line showing full route) */}
            <path
              d="M 55 85 Q 50 70 45 60 Q 35 50 28 42 Q 35 30 45 18 Q 48 12 50 8"
              fill="none"
              stroke="#d97706"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.4"
            />

            {/* Landmarks */}
            {LANDMARKS.map((landmark) => (
              <g key={landmark.id}>
                <circle cx={landmark.x} cy={landmark.y} r="1.5" fill="#78716c" opacity="0.5" />
                <text
                  x={landmark.x + 3}
                  y={landmark.y + 1}
                  fontSize="2.5"
                  fill="#57534e"
                  opacity="0.8"
                >
                  {landmark.name}
                </text>
              </g>
            ))}

            {/* Current migration position */}
            <g>
              {/* Pulsing outer circle */}
              <circle cx={phase.x} cy={phase.y} r="6" fill="#f59e0b" opacity="0.2">
                <animate
                  attributeName="r"
                  values="5;8;5"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.1;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Main marker */}
              <circle
                cx={phase.x}
                cy={phase.y}
                r="4"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="1"
              />
              {/* Wildebeest icon (simplified) */}
              <text x={phase.x} y={phase.y + 1.5} textAnchor="middle" fontSize="4">
                🦬
              </text>
            </g>

            {/* Direction arrow */}
            {selectedMonth < 6 && (
              <path
                d={`M ${phase.x} ${phase.y - 6} L ${phase.x - 2} ${phase.y - 8} L ${phase.x} ${phase.y - 10} L ${phase.x + 2} ${phase.y - 8} Z`}
                fill="#f59e0b"
                opacity="0.7"
              />
            )}
            {selectedMonth >= 6 && selectedMonth <= 9 && (
              <path
                d={`M ${phase.x} ${phase.y - 6} L ${phase.x - 2} ${phase.y - 8} L ${phase.x} ${phase.y - 10} L ${phase.x + 2} ${phase.y - 8} Z`}
                fill="#f59e0b"
                opacity="0.7"
              />
            )}
            {selectedMonth >= 10 && (
              <path
                d={`M ${phase.x} ${phase.y + 6} L ${phase.x - 2} ${phase.y + 8} L ${phase.x} ${phase.y + 10} L ${phase.x + 2} ${phase.y + 8} Z`}
                fill="#f59e0b"
                opacity="0.7"
              />
            )}
          </svg>
        </div>

        {/* Info panel */}
        <div className={cn('bg-stone-50 border-t lg:border-t-0 lg:border-l border-stone-200', compact ? 'p-4' : 'p-6 lg:w-1/3')}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-stone-500">
              {MONTHS[selectedMonth - 1].name}
            </span>
          </div>

          <h4 className="font-medium text-stone-900 mb-1">{phase.location}</h4>
          <p className="text-sm text-stone-500 mb-3">{phase.region}</p>

          <p className="text-sm text-stone-600 mb-4">{phase.description}</p>

          {/* Highlight badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="text-amber-600">★</span>
            <span className="text-sm text-amber-800">{phase.highlight}</span>
          </div>

          {/* Quick tips */}
          {!compact && (
            <div className="mt-6 pt-4 border-t border-stone-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-stone-500">
                  Migration timing varies by 2-4 weeks based on rainfall. For precise positioning,
                  plan with a specialist operator who monitors herd movements.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Month timeline */}
      <div className="px-4 py-3 bg-stone-900 border-t border-stone-200">
        <div className="flex items-center justify-between gap-1">
          {MONTHS.map((month) => {
            const isSelected = month.value === selectedMonth;
            const monthPhase = MIGRATION_PHASES.find((p) => p.month === month.value);
            const hasEvent = monthPhase?.event;

            return (
              <button
                key={month.value}
                onClick={() => setSelectedMonth(month.value)}
                className={cn(
                  'flex-1 py-2 text-xs font-medium rounded transition-colors',
                  isSelected
                    ? 'bg-amber-500 text-white'
                    : hasEvent
                    ? 'bg-stone-700 text-amber-400 hover:bg-stone-600'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                )}
              >
                {month.short}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MigrationTracker;
