"use client";

/* ────────────────────────────────────────────────────────────────────────────
 * Dubai EV Charging Resilience Index — H3 Resolution 8 Renderer
 *
 * Renders actual H3 hexagonal cells from pre-generated GeoJSON.
 * Pure SVG, zero runtime dependencies beyond React.
 * ──────────────────────────────────────────────────────────────────────────── */

import { useEffect, useState, useMemo } from "react";

// ── Risk colour ramp (light → dark blue) ────────────────────────────────
const RAMP = ["#dbe8f5", "#a9c5e2", "#719bc8", "#3f6fa8", "#244f83", "#102f5d"];

function riskColor(score: number): string {
  const i = Math.min(RAMP.length - 1, Math.floor(score * RAMP.length));
  return RAMP[i];
}

// ── GeoJSON types ───────────────────────────────────────────────────────
interface H3Feature {
  type: "Feature";
  properties: {
    h3_index: string;
    h3_resolution: number;
    risk_score: number;
    risk_class: string;
    flood_exposure: number;
    charger_access_deficit: number;
    transport_disruption: number;
  };
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

interface H3GeoJSON {
  type: "FeatureCollection";
  metadata: Record<string, unknown>;
  features: H3Feature[];
}

// ── Component ───────────────────────────────────────────────────────────
export function DubaiMap() {
  const [data, setData] = useState<H3GeoJSON | null>(null);

  useEffect(() => {
    fetch("/data/dubai-h3-res8.geojson")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const svgContent = useMemo(() => {
    if (!data) return null;

    const features = data.features;
    if (!features.length) return null;

    // Compute geographic bounds
    let minLng = Infinity,
      maxLng = -Infinity,
      minLat = Infinity,
      maxLat = -Infinity;

    for (const feat of features) {
      for (const ring of feat.geometry.coordinates) {
        for (const [lng, lat] of ring) {
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
      }
    }

    const pad = 0.005;
    minLng -= pad;
    maxLng += pad;
    minLat -= pad;
    maxLat += pad;

    const lngSpan = maxLng - minLng;
    const latSpan = maxLat - minLat;

    // SVG viewBox dimensions
    const viewW = 500;
    const viewH = 420;

    // Preserve aspect ratio: use the dimension that fills the viewBox
    const scaleLng = viewW / lngSpan;
    const scaleLat = viewH / latSpan;
    const useLng = scaleLng <= scaleLat;
    const scale = useLng ? scaleLng : scaleLat;
    const offsetX = useLng ? 0 : (viewW - lngSpan * scale) / 2;
    const offsetY = useLng ? (viewH - latSpan * scale) / 2 : 0;

    function project(lng: number, lat: number): [number, number] {
      const x = (lng - minLng) * scale + offsetX;
      const y = (maxLat - lat) * scale + offsetY; // flip Y
      return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
    }

    // Project coastline (simplified Dubai shore)
    const coastPoints = [
      [55.28, 25.34],
      [55.30, 25.30],
      [55.32, 25.26],
      [55.34, 25.22],
      [55.36, 25.18],
      [55.37, 25.14],
      [55.38, 25.10],
      [55.37, 25.06],
      [55.36, 25.02],
      [55.34, 24.98],
      [55.30, 24.95],
      [55.26, 24.93],
      [55.22, 24.92],
    ];
    const coastPath = coastPoints
      .map(([lng, lat], i) => {
        const [x, y] = project(lng, lat);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

    // Project and render hex polygons
    const polygons = features.map((feat) => {
      const ring = feat.geometry.coordinates[0];
      const pts = ring
        .map(([lng, lat]) => {
          const [x, y] = project(lng, lat);
          return `${x},${y}`;
        })
        .join(" ");
      const fill = riskColor(feat.properties.risk_score);
      return `<polygon points="${pts}" fill="${fill}" fill-opacity="0.85" stroke="#0a1628" stroke-width="0.4" data-h3="${feat.properties.h3_index}" data-risk="${feat.properties.risk_score}"/>`;
    });

    return { coastPath, polygons, viewW, viewH, featureCount: features.length };
  }, [data]);

  if (!svgContent) {
    return (
      <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 300 }}>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Loading...
        </span>
      </div>
    );
  }

  const { coastPath, polygons, viewW, viewH, featureCount } = svgContent;

  return (
    <div className="relative w-full h-full" style={{ minHeight: 300 }}>
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Dubai EV Charging Resilience Index – H3 Resolution 8 hex grid"
      >
        {/* Background */}
        <rect width={viewW} height={viewH} fill="#eef1f6" />

        {/* Hex grid */}
        <g dangerouslySetInnerHTML={{ __html: polygons.join("") }} />

        {/* Coastline */}
        <path
          d={coastPath}
          fill="none"
          stroke="rgba(47,115,255,0.45)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Vignette overlay */}
        <defs>
          <linearGradient id="dubai-vignette" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eef1f6" stopOpacity="0.5" />
            <stop offset="35%" stopColor="#eef1f6" stopOpacity="0" />
            <stop offset="80%" stopColor="#eef1f6" stopOpacity="0" />
            <stop offset="100%" stopColor="#eef1f6" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <rect width={viewW} height={viewH} fill="url(#dubai-vignette)" />

        {/* Labels */}
        <text
          x="14"
          y="24"
          fill="rgba(29,39,64,0.55)"
          fontSize="9.5"
          fontFamily="monospace"
          letterSpacing="0.08em"
        >
          DUBAI
        </text>
        <text
          x="14"
          y="37"
          fill="rgba(29,39,64,0.4)"
          fontSize="7"
          fontFamily="monospace"
          letterSpacing="0.06em"
        >
          H3 RES 8 — {featureCount} CELLS
        </text>

        {/* Legend */}
        <g transform={`translate(14,${viewH - 36})`}>
          {RAMP.map((c, i) => (
            <rect
              key={i}
              x={i * 16}
              y={0}
              width={14}
              height={7}
              fill={c}
              fillOpacity={0.85}
              rx={1}
            />
          ))}
          <text
            x={0}
            y={18}
            fill="rgba(29,39,64,0.5)"
            fontSize="6"
            fontFamily="monospace"
          >
            Lower Risk
          </text>
          <text
            x={RAMP.length * 16 - 44}
            y={18}
            fill="rgba(29,39,64,0.5)"
            fontSize="6"
            fontFamily="monospace"
          >
            Higher Risk
          </text>
        </g>
      </svg>
    </div>
  );
}
