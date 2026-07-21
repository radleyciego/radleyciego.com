"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

interface CityPoint {
  name: string;
  coords: [number, number]; // [lng, lat]
}

const CITIES: CityPoint[] = [
  { name: "New York",          coords: [-74.006, 40.7128] },
  { name: "New York Midtown",  coords: [-73.9857, 40.758] },
  { name: "San Francisco",     coords: [-122.4194, 37.7749] },
  { name: "Los Angeles",       coords: [-118.2437, 34.0522] },
  { name: "Chicago",           coords: [-87.6298, 41.8781] },
  { name: "Paris",             coords: [2.3522, 48.8566] },
  { name: "Berlin",            coords: [13.405, 52.52] },
  { name: "London",            coords: [-0.1276, 51.5074] },
  { name: "Dubai",             coords: [55.2708, 25.2048] },
  { name: "Dubai Alt",         coords: [55.27, 25.2] },
  { name: "Beijing",           coords: [116.4074, 39.9042] },
  { name: "Shanghai",          coords: [121.4737, 31.2304] },
  { name: "Tokyo",             coords: [139.6917, 35.6895] },
  { name: "Bangkok",           coords: [100.5018, 13.7563] },
  { name: "Jakarta",           coords: [106.8456, -6.2088] },
  { name: "Sydney",            coords: [151.2093, -33.8688] },
  { name: "Auckland",          coords: [174.7633, -41.2865] },
  { name: "São Paulo",         coords: [-43.1729, -22.9068] },
  { name: "Buenos Aires",      coords: [-58.3816, -34.6037] },
  { name: "Mexico City",       coords: [-99.1332, 19.4326] },
  { name: "Istanbul",          coords: [28.9784, 41.0082] },
  { name: "Tel Aviv",          coords: [34.7818, 32.0853] },
  { name: "Tehran",            coords: [51.389, 35.6892] },
  { name: "Mumbai",            coords: [77.1025, 28.6139] },
  { name: "Singapore",         coords: [103.8198, 1.3521] },
  { name: "Seoul",             coords: [126.978, 37.5665] },
  { name: "Washington DC",     coords: [-77.0369, 38.9072] },
  { name: "Seattle",           coords: [-122.3321, 47.6062] },
  { name: "Toronto",           coords: [-79.3832, 43.6532] },
  { name: "Rome",              coords: [12.4964, 41.9028] },
  { name: "Madrid",            coords: [-3.7038, 40.4168] },
  { name: "Athens",            coords: [23.7275, 37.9838] },
  { name: "Ankara",            coords: [32.866, 39.9334] },
  { name: "Baghdad",           coords: [44.3661, 33.3152] },
  { name: "Tashkent",          coords: [69.2797, 41.3111] },
];

interface ArcDef {
  from: string;
  to: string;
}

const ARC_DEFS: ArcDef[] = [
  { from: "New York",        to: "Dubai" },
  { from: "New York",        to: "London" },
  { from: "Dubai",           to: "Tehran" },
  { from: "New York Midtown", to: "London" },
  { from: "Paris",           to: "Berlin" },
  { from: "Beijing",         to: "Shanghai" },
  { from: "Beijing",         to: "Tokyo" },
  { from: "Tokyo",           to: "Seoul" },
  { from: "São Paulo",       to: "Buenos Aires" },
  { from: "Sydney",          to: "Auckland" },
  { from: "Mumbai",          to: "Singapore" },
  { from: "Istanbul",        to: "Athens" },
  { from: "Mexico City",     to: "Los Angeles" },
  { from: "New York",        to: "San Francisco" },
];

function lookupCity(name: string): CityPoint | undefined {
  return CITIES.find((c) => c.name === name);
}

function greatCircleInterpolate(
  start: [number, number],
  end: [number, number],
  numPoints: number
): [number, number][] {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRad(start[1]);
  const lng1 = toRad(start[0]);
  const lat2 = toRad(end[1]);
  const lng2 = toRad(end[0]);

  const d = 2 * Math.asin(
    Math.sqrt(
      Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lng2 - lng1) / 2), 2)
    )
  );

  if (d < 0.0001) return [start, end];

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);

    const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
    const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);

    const lat = toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)));
    const lng = toDeg(Math.atan2(y, x));
    points.push([lng, lat]);
  }
  return points;
}

function buildArcGeoJSON(): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  for (const def of ARC_DEFS) {
    const fromCity = lookupCity(def.from);
    const toCity = lookupCity(def.to);

    if (!fromCity) {
      console.warn(`Skipping arc with missing coordinate: "${def.from}" not found in CITIES lookup`);
      continue;
    }
    if (!toCity) {
      console.warn(`Skipping arc with missing coordinate: "${def.to}" not found in CITIES lookup`);
      continue;
    }

    const coords = greatCircleInterpolate(fromCity.coords, toCity.coords, 60);
    features.push({
      type: "Feature",
      geometry: { type: "LineString", coordinates: coords },
      properties: { from: def.from, to: def.to },
    });
  }

  return { type: "FeatureCollection", features };
}

function buildPointsGeoJSON(): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  for (const city of CITIES) {
    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: city.coords },
      properties: { name: city.name },
    });
  }
  return { type: "FeatureCollection", features };
}

export function HeroMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [20, 20],
      zoom: 1.8,
      pitch: 20,
      bearing: -20,
      maxZoom: 18,
      attributionControl: false,
    });

    let userInteracting = false;
    let rotationFrameId: number;
    let arcFrameId: number;

    const onInteractionStart = () => { userInteracting = true; };
    const onInteractionEnd = () => { userInteracting = false; };

    map.on("mousedown", onInteractionStart);
    map.on("dragstart", onInteractionStart);
    map.on("mouseup", onInteractionEnd);
    map.on("dragend", onInteractionEnd);
    map.on("touchstart", onInteractionStart);
    map.on("touchend", onInteractionEnd);
    map.on("wheel", onInteractionStart);

    map.on("load", () => {
      map.setProjection({ type: "globe" });

      try {
        map.setSky({
          "sky-color": "rgb(0, 0, 0)",
          "horizon-color": "rgb(5, 5, 12)",
          "fog-color": "rgb(0, 0, 6)",
          "horizon-fog-blend": 0.95,
          "sky-horizon-blend": 0.05,
        });
      } catch {
        // setSky may not be supported in all projection modes
      }

      const arcData = buildArcGeoJSON();
      map.addSource("arcs", { type: "geojson", data: arcData });
      map.addLayer({
        id: "arc-lines",
        type: "line",
        source: "arcs",
        paint: {
          "line-color": "#4d7cff",
          "line-width": 1.8,
          "line-opacity": 0.65,
          "line-dasharray": [0, 4, 3],
        },
      });

      const pointsData = buildPointsGeoJSON();
      map.addSource("points", { type: "geojson", data: pointsData });

      map.addLayer({
        id: "points-glow",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": 16,
          "circle-color": "#4d7cff",
          "circle-opacity": 0.1,
          "circle-blur": 1,
        },
      });

      map.addLayer({
        id: "points-inner",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": 2.5,
          "circle-color": "#8aabff",
          "circle-opacity": 0.85,
          "circle-stroke-width": 0.5,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-opacity": 0.3,
        },
      });

      function rotate() {
        if (!userInteracting) {
          map.setBearing(map.getBearing() + 0.04);
        }
        rotationFrameId = requestAnimationFrame(rotate);
      }
      rotationFrameId = requestAnimationFrame(rotate);

      let dashOffset = 0;
      function animateArcs() {
        dashOffset = (dashOffset + 1) % 64;
        map.setPaintProperty("arc-lines", "line-dasharray", [
          dashOffset % 4,
          4,
          3,
        ]);
        arcFrameId = requestAnimationFrame(animateArcs);
      }
      arcFrameId = requestAnimationFrame(animateArcs);

      setLoaded(true);
    });

    mapRef.current = map;

    return () => {
      cancelAnimationFrame(rotationFrameId);
      cancelAnimationFrame(arcFrameId);
      map.off("mousedown", onInteractionStart);
      map.off("dragstart", onInteractionStart);
      map.off("mouseup", onInteractionEnd);
      map.off("dragend", onInteractionEnd);
      map.off("touchstart", onInteractionStart);
      map.off("touchend", onInteractionEnd);
      map.off("wheel", onInteractionStart);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{
        minHeight: "400px",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
      }}
    />
  );
}
