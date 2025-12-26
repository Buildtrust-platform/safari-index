/**
 * Route Map Component
 *
 * Interactive Mapbox-based route visualization for safari itineraries.
 * Shows destination markers connected by travel paths on satellite imagery.
 *
 * Design principles:
 * - Clear, professional cartography
 * - Satellite imagery for context
 * - Animated route drawing
 * - Responsive and accessible
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Safari destination coordinates (latitude, longitude)
 * Accurate GPS coordinates for major safari locations
 */
const DESTINATION_COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  // Tanzania
  'arusha': { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
  'tarangire': { lat: -4.0167, lng: 36.0167, label: 'Tarangire' },
  'serengeti': { lat: -2.3333, lng: 34.8333, label: 'Serengeti' },
  'central-serengeti': { lat: -2.4500, lng: 34.8000, label: 'Central Serengeti' },
  'south-serengeti': { lat: -2.8000, lng: 34.9000, label: 'South Serengeti' },
  'north-serengeti': { lat: -1.6000, lng: 34.8500, label: 'North Serengeti' },
  'ngorongoro': { lat: -3.2000, lng: 35.5000, label: 'Ngorongoro' },
  'ngorongoro-conservation-area': { lat: -3.2000, lng: 35.5000, label: 'Ngorongoro' },
  'selous': { lat: -9.0000, lng: 37.5000, label: 'Selous' },
  'ruaha': { lat: -7.5000, lng: 35.0000, label: 'Ruaha' },
  'nyerere': { lat: -8.5000, lng: 37.5000, label: 'Nyerere' },
  'katavi': { lat: -6.8333, lng: 31.2500, label: 'Katavi' },
  'mahale': { lat: -6.1000, lng: 29.7500, label: 'Mahale' },
  'dar-es-salaam': { lat: -6.7924, lng: 39.2083, label: 'Dar es Salaam' },
  'zanzibar': { lat: -6.1659, lng: 39.2026, label: 'Zanzibar' },
  'lake-manyara': { lat: -3.6000, lng: 35.8333, label: 'Lake Manyara' },

  // Kenya
  'nairobi': { lat: -1.2921, lng: 36.8219, label: 'Nairobi' },
  'masai-mara': { lat: -1.5000, lng: 35.1500, label: 'Masai Mara' },
  'mara': { lat: -1.5000, lng: 35.1500, label: 'Masai Mara' },
  'amboseli': { lat: -2.6527, lng: 37.2606, label: 'Amboseli' },
  'samburu': { lat: 0.6000, lng: 37.5333, label: 'Samburu' },
  'laikipia': { lat: 0.3500, lng: 36.8500, label: 'Laikipia' },
  'lewa': { lat: 0.2000, lng: 37.4333, label: 'Lewa' },
  'mombasa': { lat: -4.0435, lng: 39.6682, label: 'Mombasa' },
  'diani': { lat: -4.3167, lng: 39.5833, label: 'Diani Beach' },
  'tsavo': { lat: -2.9833, lng: 38.4667, label: 'Tsavo' },
  'lake-nakuru': { lat: -0.3667, lng: 36.0833, label: 'Lake Nakuru' },
  'ol-pejeta': { lat: 0.0000, lng: 36.9000, label: 'Ol Pejeta' },

  // Botswana
  'maun': { lat: -19.9833, lng: 23.4167, label: 'Maun' },
  'okavango': { lat: -19.3000, lng: 22.9000, label: 'Okavango Delta' },
  'okavango-delta': { lat: -19.3000, lng: 22.9000, label: 'Okavango Delta' },
  'moremi': { lat: -19.2000, lng: 23.4500, label: 'Moremi' },
  'chobe': { lat: -18.7833, lng: 25.1500, label: 'Chobe' },
  'savuti': { lat: -18.5667, lng: 24.0667, label: 'Savuti' },
  'makgadikgadi': { lat: -20.5000, lng: 25.5000, label: 'Makgadikgadi' },
  'nxai-pan': { lat: -19.9333, lng: 24.7667, label: 'Nxai Pan' },
  'central-kalahari': { lat: -22.0000, lng: 23.5000, label: 'Central Kalahari' },
  'kalahari': { lat: -22.0000, lng: 23.5000, label: 'Central Kalahari' },
  'kasane': { lat: -17.8000, lng: 25.1500, label: 'Kasane' },
  'khwai': { lat: -19.1500, lng: 23.7833, label: 'Khwai' },
  'linyanti': { lat: -18.2833, lng: 23.9167, label: 'Linyanti' },

  // Namibia
  'windhoek': { lat: -22.5609, lng: 17.0658, label: 'Windhoek' },
  'etosha': { lat: -18.8556, lng: 16.3278, label: 'Etosha' },
  'sossusvlei': { lat: -24.7333, lng: 15.4667, label: 'Sossusvlei' },
  'namib-desert': { lat: -24.7333, lng: 15.4667, label: 'Namib Desert' },
  'swakopmund': { lat: -22.6792, lng: 14.5264, label: 'Swakopmund' },
  'skeleton-coast': { lat: -20.4000, lng: 13.0333, label: 'Skeleton Coast' },
  'damaraland': { lat: -20.5000, lng: 14.5000, label: 'Damaraland' },
  'caprivi': { lat: -18.0000, lng: 21.0000, label: 'Caprivi Strip' },
  'fish-river-canyon': { lat: -27.5833, lng: 17.5500, label: 'Fish River Canyon' },

  // South Africa
  'johannesburg': { lat: -26.2041, lng: 28.0473, label: 'Johannesburg' },
  'cape-town': { lat: -33.9249, lng: 18.4241, label: 'Cape Town' },
  'kruger': { lat: -24.0000, lng: 31.5000, label: 'Kruger' },
  'greater-kruger': { lat: -24.0000, lng: 31.5000, label: 'Greater Kruger' },
  'sabi-sands': { lat: -24.8333, lng: 31.4500, label: 'Sabi Sands' },
  'timbavati': { lat: -24.2333, lng: 31.3500, label: 'Timbavati' },
  'garden-route': { lat: -33.9833, lng: 22.4500, label: 'Garden Route' },
  'durban': { lat: -29.8587, lng: 31.0218, label: 'Durban' },
  'winelands': { lat: -33.9167, lng: 18.8667, label: 'Winelands' },
  'cape-winelands': { lat: -33.9167, lng: 18.8667, label: 'Cape Winelands' },
  'franschhoek': { lat: -33.9000, lng: 19.1167, label: 'Franschhoek' },
  'hermanus': { lat: -34.4167, lng: 19.2333, label: 'Hermanus' },

  // Rwanda
  'kigali': { lat: -1.9403, lng: 30.0588, label: 'Kigali' },
  'volcanoes': { lat: -1.4833, lng: 29.5333, label: 'Volcanoes NP' },
  'volcanoes-np': { lat: -1.4833, lng: 29.5333, label: 'Volcanoes NP' },
  'musanze': { lat: -1.5000, lng: 29.6333, label: 'Musanze' },
  'nyungwe': { lat: -2.5000, lng: 29.2500, label: 'Nyungwe' },
  'akagera': { lat: -1.9000, lng: 30.8000, label: 'Akagera' },
  'lake-kivu': { lat: -2.0000, lng: 29.0000, label: 'Lake Kivu' },

  // Uganda
  'entebbe': { lat: 0.0512, lng: 32.4637, label: 'Entebbe' },
  'kampala': { lat: 0.3476, lng: 32.5825, label: 'Kampala' },
  'bwindi': { lat: -1.0500, lng: 29.7000, label: 'Bwindi' },
  'bwindi-impenetrable': { lat: -1.0500, lng: 29.7000, label: 'Bwindi' },
  'queen-elizabeth': { lat: -0.2000, lng: 30.0000, label: 'Queen Elizabeth' },
  'murchison': { lat: 2.2500, lng: 31.5000, label: 'Murchison Falls' },
  'murchison-falls': { lat: 2.2500, lng: 31.5000, label: 'Murchison Falls' },
  'kibale': { lat: 0.5000, lng: 30.3667, label: 'Kibale' },
  'mgahinga': { lat: -1.3833, lng: 29.6333, label: 'Mgahinga' },

  // Zambia/Zimbabwe
  'victoria-falls': { lat: -17.9243, lng: 25.8572, label: 'Victoria Falls' },
  'livingstone': { lat: -17.8419, lng: 25.8544, label: 'Livingstone' },
  'south-luangwa': { lat: -13.0833, lng: 31.7500, label: 'South Luangwa' },
  'lower-zambezi': { lat: -15.4667, lng: 29.3000, label: 'Lower Zambezi' },
  'hwange': { lat: -18.5000, lng: 26.5000, label: 'Hwange' },
  'mana-pools': { lat: -15.7667, lng: 29.3833, label: 'Mana Pools' },
  'lusaka': { lat: -15.3875, lng: 28.3228, label: 'Lusaka' },
  'harare': { lat: -17.8292, lng: 31.0522, label: 'Harare' },
};

/**
 * Fuzzy match location to coordinates
 */
function getCoordinates(location: string): { lat: number; lng: number; label: string } | null {
  const normalized = location.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/['']/g, '')
    .replace(/national-park/g, '')
    .replace(/np/g, '')
    .trim();

  // Direct match
  if (DESTINATION_COORDS[normalized]) {
    return DESTINATION_COORDS[normalized];
  }

  // Try without hyphens
  const noHyphens = normalized.replace(/-/g, '');
  for (const [key, coords] of Object.entries(DESTINATION_COORDS)) {
    if (key.replace(/-/g, '') === noHyphens) {
      return coords;
    }
  }

  // Partial match - check if location contains key or vice versa
  for (const [key, coords] of Object.entries(DESTINATION_COORDS)) {
    if (normalized.includes(key) || key.includes(normalized.split('/')[0].split('-')[0])) {
      return coords;
    }
  }

  // Keyword-based fallback
  const keywordMap: Record<string, string> = {
    'serengeti': 'serengeti',
    'mara': 'masai-mara',
    'delta': 'okavango',
    'crater': 'ngorongoro',
    'greater-kruger': 'kruger',
    'gorilla': 'volcanoes',
    'virunga': 'volcanoes',
    'chimp': 'kibale',
    'primate': 'kibale',
  };

  for (const [keyword, key] of Object.entries(keywordMap)) {
    if (normalized.includes(keyword) && DESTINATION_COORDS[key]) {
      return DESTINATION_COORDS[key];
    }
  }

  console.warn(`No coordinates found for: ${location}`);
  return null;
}

interface MapSegment {
  id: string;
  location: string;
  order: number;
  nights: number | number[];
  travelMode?: 'flight' | 'road';
}

interface RouteMapProps {
  segments: MapSegment[];
  region: string;
  className?: string;
}

export function RouteMap({ segments, region, className = '' }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!mapContainer.current || points.length < 2) return;

    // Check for Mapbox token
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setMapError('Map unavailable - configuration pending');
      return;
    }

    mapboxgl.accessToken = token;

    // Calculate bounds
    const lngs = points.map(p => p.lng);
    const lats = points.map(p => p.lat);
    const bounds = new mapboxgl.LngLatBounds(
      [Math.min(...lngs) - 1, Math.min(...lats) - 1],
      [Math.max(...lngs) + 1, Math.max(...lats) + 1]
    );

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      bounds: bounds,
      fitBoundsOptions: { padding: 50 },
      interactive: true,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    // Add attribution
    map.current.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);

      if (!map.current) return;

      // Create route line GeoJSON
      const routeCoordinates = points.map(p => [p.lng, p.lat]);

      // Add route line source
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
        },
      });

      // Add route line layer (background - thicker for visibility)
      map.current.addLayer({
        id: 'route-bg',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 5,
        },
      });

      // Add route line layer (foreground)
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#d97706',
          'line-width': 3,
        },
      });

      // Add markers for each destination
      points.forEach((point, index) => {
        if (!map.current) return;

        const isFirst = index === 0;
        const isLast = index === points.length - 1;
        const nights = Array.isArray(point.nights)
          ? `${point.nights[0]}-${point.nights[1]} nights`
          : `${point.nights} night${point.nights !== 1 ? 's' : ''}`;

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'route-marker';
        el.innerHTML = `
          <div class="marker-dot ${isFirst ? 'start' : isLast ? 'end' : ''}">
            <span class="marker-number">${index + 1}</span>
          </div>
        `;

        // Add marker
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center',
        })
          .setLngLat([point.lng, point.lat])
          .setPopup(
            new mapboxgl.Popup({
              offset: 25,
              closeButton: false,
              className: 'route-popup',
            }).setHTML(`
              <div class="popup-content">
                <strong>${point.label}</strong>
                <span class="popup-nights">${nights}</span>
              </div>
            `)
          )
          .addTo(map.current);

        // Show popup on hover
        el.addEventListener('mouseenter', () => marker.togglePopup());
        el.addEventListener('mouseleave', () => marker.togglePopup());
      });
    });

    map.current.on('error', (e) => {
      console.error('Map error:', e);
      setMapError('Map failed to load');
    });

    return () => {
      map.current?.remove();
    };
  }, [points]);

  if (points.length < 2) {
    return null;
  }

  if (mapError) {
    // Fallback to visual route diagram
    return (
      <div className={`${className}`}>
        {/* Visual route timeline */}
        <div className="relative py-4">
          {/* Connection line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-green-400 via-amber-500 to-red-400 rounded-full transform -translate-y-1/2" />

          {/* Destination cards */}
          <div className="relative flex justify-between items-start">
            {points.map((point, index) => {
              const isFirst = index === 0;
              const isLast = index === points.length - 1;
              const nights = Array.isArray(point.nights)
                ? `${point.nights[0]}-${point.nights[1]}`
                : point.nights;

              return (
                <div
                  key={point.id}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / points.length}%` }}
                >
                  {/* Marker */}
                  <div
                    className={`
                      relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                      text-white font-bold text-sm shadow-lg border-4 border-white
                      ${isFirst ? 'bg-green-500' : isLast ? 'bg-red-500' : 'bg-amber-500'}
                    `}
                  >
                    {index + 1}
                  </div>

                  {/* Location info */}
                  <div className="mt-3 text-center px-1">
                    <p className="font-medium text-stone-800 text-sm leading-tight">
                      {point.label}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {nights} {parseInt(String(nights)) === 1 ? 'night' : 'nights'}
                    </p>
                  </div>

                  {/* Travel mode indicator */}
                  {index < points.length - 1 && point.travelMode === 'flight' && (
                    <div className="absolute -right-2 top-3 z-20">
                      <span className="text-xs bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded">
                        ✈
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-stone-100 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span>Start</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-amber-500" />
            <span>Destination</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span>End</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sky-600">✈</span>
            <span>Flight</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapContainer}
        className="w-full h-[400px] rounded-lg overflow-hidden"
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 rounded-lg">
          <div className="text-stone-500 text-sm">Loading map...</div>
        </div>
      )}
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">1</div>
          <span>Start</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{points.length}</div>
          <span>End</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-1 bg-amber-600 rounded" />
          <span>Route</span>
        </div>
      </div>
      {/* Inline styles for markers */}
      <style jsx global>{`
        .route-marker {
          cursor: pointer;
        }
        .marker-dot {
          width: 28px;
          height: 28px;
          background: #d97706;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .marker-dot:hover {
          transform: scale(1.15);
        }
        .marker-dot.start {
          background: #22c55e;
        }
        .marker-dot.end {
          background: #ef4444;
        }
        .marker-number {
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
        .route-popup .mapboxgl-popup-content {
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }
        .popup-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .popup-content strong {
          font-size: 14px;
          color: #1c1917;
        }
        .popup-nights {
          font-size: 12px;
          color: #78716c;
        }
      `}</style>
    </div>
  );
}
