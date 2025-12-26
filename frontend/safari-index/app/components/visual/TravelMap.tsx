/**
 * Travel Map Component
 *
 * SVG-based route visualization for safari itineraries.
 * Shows destination points connected by travel paths.
 *
 * Design principles:
 * - Documentary, minimal aesthetic
 * - No external mapping library dependency
 * - Responsive and accessible
 * - Matches stone/amber color palette
 */

'use client';

import { useState } from 'react';
import { Plane, Car } from 'lucide-react';

/**
 * Destination coordinates for safari regions
 * Approximate positions for visualization (not GPS-accurate)
 * Coordinates are relative to Africa bounding box for SVG rendering
 */
const DESTINATION_COORDS: Record<string, { x: number; y: number; label: string }> = {
  // Tanzania
  'arusha': { x: 310, y: 195, label: 'Arusha' },
  'tarangire': { x: 305, y: 205, label: 'Tarangire' },
  'serengeti': { x: 280, y: 185, label: 'Serengeti' },
  'ngorongoro': { x: 290, y: 195, label: 'Ngorongoro' },
  'selous': { x: 320, y: 250, label: 'Selous' },
  'ruaha': { x: 295, y: 240, label: 'Ruaha' },
  'nyerere': { x: 320, y: 255, label: 'Nyerere' },
  'katavi': { x: 260, y: 225, label: 'Katavi' },
  'dar-es-salaam': { x: 335, y: 240, label: 'Dar es Salaam' },
  'zanzibar': { x: 345, y: 230, label: 'Zanzibar' },

  // Kenya
  'nairobi': { x: 310, y: 175, label: 'Nairobi' },
  'masai-mara': { x: 290, y: 175, label: 'Masai Mara' },
  'amboseli': { x: 310, y: 185, label: 'Amboseli' },
  'samburu': { x: 320, y: 155, label: 'Samburu' },
  'laikipia': { x: 315, y: 160, label: 'Laikipia' },
  'lewa': { x: 318, y: 158, label: 'Lewa' },
  'mombasa': { x: 335, y: 205, label: 'Mombasa' },

  // Botswana
  'maun': { x: 195, y: 305, label: 'Maun' },
  'okavango': { x: 185, y: 295, label: 'Okavango Delta' },
  'moremi': { x: 190, y: 290, label: 'Moremi' },
  'chobe': { x: 205, y: 280, label: 'Chobe' },
  'savuti': { x: 200, y: 285, label: 'Savuti' },
  'makgadikgadi': { x: 210, y: 305, label: 'Makgadikgadi' },
  'nxai-pan': { x: 208, y: 298, label: 'Nxai Pan' },
  'kalahari': { x: 180, y: 330, label: 'Central Kalahari' },
  'kasane': { x: 208, y: 275, label: 'Kasane' },

  // Namibia
  'windhoek': { x: 140, y: 325, label: 'Windhoek' },
  'etosha': { x: 135, y: 295, label: 'Etosha' },
  'sossusvlei': { x: 125, y: 340, label: 'Sossusvlei' },
  'swakopmund': { x: 110, y: 325, label: 'Swakopmund' },
  'skeleton-coast': { x: 105, y: 300, label: 'Skeleton Coast' },
  'damaraland': { x: 120, y: 305, label: 'Damaraland' },
  'caprivi': { x: 185, y: 280, label: 'Caprivi Strip' },

  // South Africa
  'johannesburg': { x: 225, y: 345, label: 'Johannesburg' },
  'cape-town': { x: 145, y: 400, label: 'Cape Town' },
  'kruger': { x: 250, y: 335, label: 'Kruger' },
  'sabi-sands': { x: 248, y: 338, label: 'Sabi Sands' },
  'timbavati': { x: 252, y: 332, label: 'Timbavati' },
  'garden-route': { x: 175, y: 395, label: 'Garden Route' },
  'durban': { x: 250, y: 375, label: 'Durban' },

  // Rwanda
  'kigali': { x: 260, y: 185, label: 'Kigali' },
  'volcanoes': { x: 255, y: 180, label: 'Volcanoes NP' },
  'musanze': { x: 255, y: 178, label: 'Musanze' },
  'nyungwe': { x: 255, y: 195, label: 'Nyungwe' },
  'akagera': { x: 265, y: 185, label: 'Akagera' },

  // Uganda
  'entebbe': { x: 255, y: 170, label: 'Entebbe' },
  'kampala': { x: 258, y: 168, label: 'Kampala' },
  'bwindi': { x: 248, y: 178, label: 'Bwindi' },
  'queen-elizabeth': { x: 245, y: 170, label: 'Queen Elizabeth' },
  'murchison': { x: 250, y: 155, label: 'Murchison Falls' },
  'kibale': { x: 245, y: 168, label: 'Kibale' },

  // Zambia/Zimbabwe
  'victoria-falls': { x: 210, y: 280, label: 'Victoria Falls' },
  'livingstone': { x: 212, y: 282, label: 'Livingstone' },
  'south-luangwa': { x: 255, y: 270, label: 'South Luangwa' },
  'lower-zambezi': { x: 245, y: 285, label: 'Lower Zambezi' },
  'hwange': { x: 215, y: 290, label: 'Hwange' },
};

/**
 * Fuzzy match location to coordinates
 */
function getCoordinates(location: string): { x: number; y: number; label: string } | null {
  const normalized = location.toLowerCase().replace(/\s+/g, '-');

  // Direct match
  if (DESTINATION_COORDS[normalized]) {
    return DESTINATION_COORDS[normalized];
  }

  // Partial match
  for (const [key, coords] of Object.entries(DESTINATION_COORDS)) {
    if (normalized.includes(key) || key.includes(normalized.split('/')[0])) {
      return coords;
    }
  }

  // Region-based fallback
  if (normalized.includes('serengeti')) return DESTINATION_COORDS['serengeti'];
  if (normalized.includes('mara')) return DESTINATION_COORDS['masai-mara'];
  if (normalized.includes('delta') || normalized.includes('okavango')) return DESTINATION_COORDS['okavango'];
  if (normalized.includes('crater') || normalized.includes('ngorongoro')) return DESTINATION_COORDS['ngorongoro'];
  if (normalized.includes('kruger') || normalized.includes('greater')) return DESTINATION_COORDS['kruger'];
  if (normalized.includes('gorilla') || normalized.includes('volcan')) return DESTINATION_COORDS['volcanoes'];
  if (normalized.includes('chimpanzee') || normalized.includes('kibale')) return DESTINATION_COORDS['kibale'];
  if (normalized.includes('etosha')) return DESTINATION_COORDS['etosha'];
  if (normalized.includes('sossusvlei') || normalized.includes('namib')) return DESTINATION_COORDS['sossusvlei'];
  if (normalized.includes('cape')) return DESTINATION_COORDS['cape-town'];

  return null;
}

/**
 * Get region bounding box for focused view
 */
function getRegionBounds(region: string): { minX: number; minY: number; maxX: number; maxY: number } {
  const bounds: Record<string, { minX: number; minY: number; maxX: number; maxY: number }> = {
    'tanzania': { minX: 250, minY: 170, maxX: 360, maxY: 280 },
    'kenya': { minX: 270, minY: 140, maxX: 360, maxY: 220 },
    'botswana': { minX: 160, minY: 260, maxX: 240, maxY: 350 },
    'namibia': { minX: 90, minY: 270, maxX: 200, maxY: 380 },
    'south-africa': { minX: 120, minY: 300, maxX: 280, maxY: 420 },
    'uganda-rwanda': { minX: 230, minY: 145, maxX: 290, maxY: 210 },
    'zambia': { minX: 190, minY: 250, maxX: 280, maxY: 310 },
  };

  return bounds[region] || { minX: 80, minY: 130, maxX: 370, maxY: 430 };
}

interface MapPoint {
  id: string;
  location: string;
  order: number;
  nights: number | number[];
  travelMode?: 'flight' | 'road';
}

interface TravelMapProps {
  segments: MapPoint[];
  region: string;
  className?: string;
}

export function TravelMap({ segments, region, className = '' }: TravelMapProps) {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // Get coordinates for each segment
  const points = segments
    .map((segment) => {
      const coords = getCoordinates(segment.location);
      if (!coords) return null;
      return {
        ...segment,
        ...coords,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (points.length < 2) {
    return null; // Not enough points to show a map
  }

  // Get region bounds for viewBox
  const bounds = getRegionBounds(region);
  const padding = 30;
  const viewBox = `${bounds.minX - padding} ${bounds.minY - padding} ${bounds.maxX - bounds.minX + padding * 2} ${bounds.maxY - bounds.minY + padding * 2}`;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={viewBox}
        className="w-full h-auto"
        style={{ maxHeight: '400px' }}
        role="img"
        aria-label={`Travel map showing route through ${points.map(p => p.label).join(', ')}`}
      >
        {/* Background */}
        <rect
          x={bounds.minX - padding}
          y={bounds.minY - padding}
          width={bounds.maxX - bounds.minX + padding * 2}
          height={bounds.maxY - bounds.minY + padding * 2}
          fill="#fafaf9"
          rx="8"
        />

        {/* Grid pattern for texture */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e7e5e4" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect
          x={bounds.minX - padding}
          y={bounds.minY - padding}
          width={bounds.maxX - bounds.minX + padding * 2}
          height={bounds.maxY - bounds.minY + padding * 2}
          fill="url(#grid)"
        />

        {/* Travel paths */}
        {points.slice(0, -1).map((point, idx) => {
          const nextPoint = points[idx + 1];
          const isHovered = hoveredPoint === point.id || hoveredPoint === nextPoint.id;
          const isFlight = nextPoint.travelMode === 'flight';

          // Calculate control point for curved path
          const midX = (point.x + nextPoint.x) / 2;
          const midY = (point.y + nextPoint.y) / 2;
          const dx = nextPoint.x - point.x;
          const dy = nextPoint.y - point.y;
          const perpX = -dy * 0.2;
          const perpY = dx * 0.2;

          return (
            <g key={`path-${point.id}-${nextPoint.id}`}>
              {/* Path line */}
              <path
                d={`M ${point.x} ${point.y} Q ${midX + perpX} ${midY + perpY} ${nextPoint.x} ${nextPoint.y}`}
                fill="none"
                stroke={isHovered ? '#d97706' : '#a8a29e'}
                strokeWidth={isHovered ? 2.5 : 1.5}
                strokeDasharray={isFlight ? '4 3' : 'none'}
                className="transition-all duration-200"
              />

              {/* Direction arrow */}
              <circle
                cx={midX + perpX * 0.5}
                cy={midY + perpY * 0.5}
                r="3"
                fill={isHovered ? '#d97706' : '#78716c'}
              />

              {/* Travel mode indicator */}
              {isFlight && (
                <g transform={`translate(${midX + perpX - 6}, ${midY + perpY - 6})`}>
                  <rect x="0" y="0" width="12" height="12" rx="2" fill="white" />
                  <text x="6" y="9" textAnchor="middle" fontSize="8" fill="#78716c">✈</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Destination points */}
        {points.map((point, idx) => {
          const isHovered = hoveredPoint === point.id;
          const isFirst = idx === 0;
          const isLast = idx === points.length - 1;
          const nights = Array.isArray(point.nights)
            ? `${point.nights[0]}-${point.nights[1]}`
            : point.nights;

          return (
            <g
              key={point.id}
              onMouseEnter={() => setHoveredPoint(point.id)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
            >
              {/* Outer ring for start/end */}
              {(isFirst || isLast) && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 14 : 12}
                  fill="none"
                  stroke={isFirst ? '#22c55e' : '#ef4444'}
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              )}

              {/* Point circle */}
              <circle
                cx={point.x}
                cy={point.y}
                r={isHovered ? 8 : 6}
                fill={isHovered ? '#d97706' : '#78716c'}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-200"
              />

              {/* Order number */}
              <text
                x={point.x}
                y={point.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="6"
                fontWeight="bold"
                fill="white"
              >
                {idx + 1}
              </text>

              {/* Label */}
              <g
                transform={`translate(${point.x + 10}, ${point.y - 8})`}
                className={`transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-80'}`}
              >
                <rect
                  x="-2"
                  y="-8"
                  width={point.label.length * 5 + 8}
                  height="18"
                  rx="3"
                  fill="white"
                  stroke={isHovered ? '#d97706' : '#d6d3d1'}
                  strokeWidth="1"
                />
                <text
                  x="2"
                  y="3"
                  fontSize="7"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  fill="#44403c"
                >
                  {point.label}
                </text>
                <text
                  x={point.label.length * 5 + 2}
                  y="3"
                  fontSize="6"
                  fill="#78716c"
                >
                  {nights}n
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2 border-green-500" />
          <span>Start</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2 border-red-500" />
          <span>End</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-stone-400" />
          <span>Road</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-stone-400 border-dashed" style={{ borderTopWidth: '2px', borderStyle: 'dashed' }} />
          <span>Flight</span>
        </div>
      </div>
    </div>
  );
}
