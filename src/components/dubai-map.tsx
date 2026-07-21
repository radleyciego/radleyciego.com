"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

const DUBAI_POINTS: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [55.27, 25.2] },
      properties: { name: "Dubai" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [55.3, 25.25] },
      properties: { name: "DEWA Hub" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [55.22, 25.18] },
      properties: { name: "Charger Station" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [55.33, 25.22] },
      properties: { name: "RTA Network" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [55.15, 25.12] },
      properties: { name: "Flood Zone" },
    },
  ],
};

const DUBAI_ARCS: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [55.27, 25.2],
          [55.3, 25.25],
        ],
      },
      properties: {},
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [55.27, 25.2],
          [55.22, 25.18],
        ],
      },
      properties: {},
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [55.3, 25.25],
          [55.33, 25.22],
        ],
      },
      properties: {},
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [55.22, 25.18],
          [55.15, 25.12],
        ],
      },
      properties: {},
    },
  ],
};

function generateGrid(
  minLng: number,
  minLat: number,
  maxLng: number,
  maxLat: number,
  step: number
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  for (let lng = minLng; lng <= maxLng; lng += step) {
    features.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [lng, minLat],
          [lng, maxLat],
        ],
      },
      properties: {},
    });
  }

  for (let lat = minLat; lat <= maxLat; lat += step) {
    features.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [minLng, lat],
          [maxLng, lat],
        ],
      },
      properties: {},
    });
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

export function DubaiMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-dark",
            type: "raster",
            source: "osm",
            paint: {
              "raster-saturation": -1,
              "raster-brightness-max": 0.15,
              "raster-contrast": 0.1,
              "raster-hue-rotate": 180,
            },
          },
        ],
      },
      center: [55.27, 25.2],
      zoom: 9.5,
      pitch: 45,
      bearing: -17.6,
      maxZoom: 18,
      attributionControl: false,
      interactive: false,
    });

    map.on("load", () => {
      map.addSource("points", {
        type: "geojson",
        data: DUBAI_POINTS,
      });

      map.addLayer({
        id: "points-glow",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": 16,
          "circle-color": "#4d7cff",
          "circle-opacity": 0.15,
          "circle-blur": 1,
        },
      });

      map.addLayer({
        id: "points-inner",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": 4,
          "circle-color": "#4d7cff",
          "circle-opacity": 0.9,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-opacity": 0.4,
        },
      });

      map.addSource("arcs", {
        type: "geojson",
        data: DUBAI_ARCS,
      });

      map.addLayer({
        id: "arc-lines",
        type: "line",
        source: "arcs",
        paint: {
          "line-color": "#4d7cff",
          "line-width": 1.5,
          "line-opacity": 0.3,
        },
      });

      map.addSource("grid", {
        type: "geojson",
        data: generateGrid(54.8, 24.8, 55.6, 25.6, 0.04),
      });

      map.addLayer({
        id: "grid-lines",
        type: "line",
        source: "grid",
        paint: {
          "line-color": "#4d7cff",
          "line-width": 0.5,
          "line-opacity": 0.08,
        },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: "300px" }}
    />
  );
}
