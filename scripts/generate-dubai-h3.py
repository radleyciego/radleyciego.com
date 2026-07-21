#!/usr/bin/env python3
"""
generate-dubai-h3.py
─────────────────────
Generates a GeoJSON FeatureCollection of Uber H3 resolution-8 hexagonal cells
covering the Dubai coastal urban study area.

Each feature contains:
  - h3_index:          valid H3 resolution-8 index
  - h3_resolution:     8
  - risk_score:        deterministic prototype risk score (0–1)
  - risk_class:        low / moderate / high
  - flood_exposure:    synthetic factor
  - charger_access:    synthetic factor (deficit — higher = worse access)
  - transport_disruption: synthetic factor

All risk scores are MOCK DATA for visual prototyping only.
They are NOT empirical, validated, or operational findings.

Dependencies: h3 >=4.0, shapely, pyproj
"""

import json
import math
import random
from pathlib import Path

import h3
from shapely.geometry import Polygon, mapping
from pyproj import Transformer

# ── Configuration ────────────────────────────────────────────────────────
H3_RESOLUTION = 8
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "public" / "data" / "dubai-h3-res8.geojson"
SEED = 42

# ── Dubai study-area boundary ────────────────────────────────────────────
# Covers the coastal urban corridor, downtown, marina, Jebel Ali,
# and key infrastructure zones.  Coordinate order: (latitude, longitude)
# per H3 v4 API convention.
DUBAI_BOUNDARY_LATLNG = [
    (25.33, 55.16),   #NW — Sharjah border coast
    (25.35, 55.30),   #N  — Deira / Creek mouth
    (25.28, 55.36),   #NE — Palm Jumeirah area
    (25.20, 55.42),   #E  — outer coastal waters
    (25.10, 55.38),   #SE — JBR / Bluewaters area
    (25.00, 55.30),   #S  — Marina / Al Sufouh
    (24.92, 55.16),   #SW — Jebel Ali industrial
    (24.95, 55.02),   #W  — outer desert boundary
    (25.10, 55.05),   #W  — central desert edge
    (25.22, 55.08),   #NW — Al Khail / Business Bay
    (25.30, 55.12),   #NW — return toward Sharjah
]

# Prototype charging-hub locations (latitude, longitude)
CHARGING_HUBS = [
    (25.20, 55.27),   #Dubai Mall / Downtown
    (25.08, 55.14),   #Jebel Ali Free Zone
    (25.19, 55.24),   #Business Bay
    (25.09, 55.15),   #Dubai Marina
    (25.26, 55.30),   #Deira City Centre
    (25.12, 55.20),   #Al Barsha
    (25.25, 55.34),   #Palm Jumeirah
    (25.15, 55.28),   #JBR
]

# Prototype major transport corridors (simplified polylines, lat/lng)
TRANSPORT_CORRIDORS = [
    # Sheikh Zayed Road (E11) — main coastal artery
    [(25.33, 55.28), (25.25, 55.27), (25.18, 55.26), (25.08, 55.20), (24.95, 55.12)],
    # Al Khail Road (E44) — inland highway
    [(25.30, 55.18), (25.22, 55.16), (25.14, 55.14), (25.05, 55.12)],
    # Emirates Road (E311) — outer highway
    [(25.32, 55.12), (25.24, 55.10), (25.16, 55.08), (25.06, 55.06)],
]


# ── Helper functions ─────────────────────────────────────────────────────
def h3_cell_to_geojson_boundary(h3_index: str) -> list[list[list[float]]]:
    """
    Convert an H3 cell index to a GeoJSON polygon boundary.
    H3 v4 returns coordinates as (lat, lng); GeoJSON requires [lng, lat].
    """
    boundary = h3.cell_to_boundary(h3_index)
    coords = [[round(lng, 4), round(lat, 4)] for lat, lng in boundary]
    coords.append(coords[0])  # close the ring
    return [coords]


def point_to_latlng(point: tuple[float, float]) -> tuple[float, float]:
    """Identity — already (lat, lng)."""
    return point


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Great-circle distance in km between two (lat, lng) points."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def distance_to_polyline_km(lat: float, lng: float, polyline: list[tuple[float, float]]) -> float:
    """Approximate minimum distance from a point to a polyline (km)."""
    min_d = float("inf")
    for i in range(len(polyline) - 1):
        # Project point onto segment (approximate using midpoint sampling)
        lat1, lng1 = polyline[i]
        lat2, lng2 = polyline[i + 1]
        # Sample 10 points along segment
        for t in range(11):
            frac = t / 10.0
            plat = lat1 + frac * (lat2 - lat1)
            plng = lng1 + frac * (lng2 - lng1)
            d = haversine_km(lat, lng, plat, plng)
            if d < min_d:
                min_d = d
    return min_d


def normalize(values: list[float]) -> list[float]:
    """Normalize a list of floats to 0–1 range."""
    vmin = min(values)
    vmax = max(values)
    if vmax - vmin < 1e-12:
        return [0.5] * len(values)
    return [(v - vmin) / (vmax - vmin) for v in values]


def spatial_smooth(values: list[float], centroids: list[tuple[float, float]],
                   radius_km: float = 3.0, passes: int = 2) -> list[float]:
    """Simple spatial averaging — each cell takes the mean of neighbours within radius."""
    n = len(values)
    arr = list(values)
    for _ in range(passes):
        new = list(arr)
        for i in range(n):
            acc = [arr[i]]
            ci_lat, ci_lng = centroids[i]
            for j in range(n):
                if i == j:
                    continue
                cj_lat, cj_lng = centroids[j]
                if haversine_km(ci_lat, ci_lng, cj_lat, cj_lng) <= radius_km:
                    acc.append(arr[j])
            new[i] = sum(acc) / len(acc)
        arr = new
    return arr


# ── Main generation ──────────────────────────────────────────────────────
def main():
    random.seed(SEED)

    # 1. Collect all H3 cells that intersect the study area
    study_polygon = DUBAI_BOUNDARY_LATLNG

    # Use polygon_to_cells to get all H3 indexes within the boundary
    # H3 v4 API: LatLngPoly takes list of (lat, lng) tuples
    h3_poly = h3.LatLngPoly(study_polygon)
    h3_cells = h3.polygon_to_cells(h3_poly, H3_RESOLUTION)

    print(f"H3 resolution-{H3_RESOLUTION} cells in study area: {len(h3_cells)}")

    if not h3_cells:
        print("ERROR: No H3 cells generated. Check boundary coordinates.")
        return

    # 2. Build feature list
    features = []
    centroids = []

    for h3_idx in sorted(h3_cells):
        # Get cell center
        center_lat, center_lng = h3.cell_to_latlng(h3_idx)
        centroids.append((center_lat, center_lng))

        # Get cell boundary
        boundary_coords = h3_cell_to_geojson_boundary(h3_idx)

        features.append({
            "type": "Feature",
            "properties": {
                "h3_index": h3_idx,
                "h3_resolution": H3_RESOLUTION,
                "center_lat": round(center_lat, 5),
                "center_lng": round(center_lng, 5),
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": boundary_coords,
            },
        })

    # 3. Compute raw factor scores
    flood_raw = []
    charger_raw = []
    transport_raw = []
    noise_raw = []

    for i, feat in enumerate(features):
        lat, lng = centroids[i]

        # Flood exposure: proximity to coast (southern + eastern areas more exposed)
        # Use distance from a simplified coastline approximation
        coast_dist = min(
            haversine_km(lat, lng, 25.20, 55.30),   # open coast
            haversine_km(lat, lng, 25.10, 55.25),   # marina coast
            haversine_km(lat, lng, 25.00, 55.18),   # jebel ali coast
        )
        flood_raw.append(max(0, 1.0 - coast_dist / 15.0))

        # Charger access deficit: distance to nearest hub
        hub_dists = [haversine_km(lat, lng, h, l) for h, l in CHARGING_HUBS]
        nearest_hub = min(hub_dists)
        charger_raw.append(min(1.0, nearest_hub / 12.0))

        # Transport disruption: proximity to major corridors
        corridor_dists = [distance_to_polyline_km(lat, lng, c) for c in TRANSPORT_CORRIDORS]
        nearest_corridor = min(corridor_dists)
        transport_raw.append(max(0, 1.0 - nearest_corridor / 8.0))

        # Seeded local variation
        noise_raw.append(random.gauss(0.5, 0.15))

    # 4. Normalize each factor
    flood_norm = normalize(flood_raw)
    charger_norm = normalize(charger_raw)
    transport_norm = normalize(transport_raw)
    noise_norm = normalize(noise_raw)

    # 5. Spatial smoothing on each factor
    flood_smooth = spatial_smooth(flood_norm, centroids, radius_km=2.5, passes=2)
    charger_smooth = spatial_smooth(charger_norm, centroids, radius_km=2.5, passes=2)
    transport_smooth = spatial_smooth(transport_norm, centroids, radius_km=2.5, passes=2)

    # 6. Composite risk score
    risk_scores = []
    for i in range(len(features)):
        score = (0.40 * flood_smooth[i] +
                 0.35 * charger_smooth[i] +
                 0.20 * transport_smooth[i] +
                 0.05 * noise_norm[i])
        risk_scores.append(round(min(1.0, max(0.0, score)), 4))

    # Normalize final scores to 0–1
    risk_scores = normalize(risk_scores)
    risk_scores = [round(s, 4) for s in risk_scores]

    # 7. Assign risk classes and write properties
    for i, feat in enumerate(features):
        score = risk_scores[i]
        if score < 0.35:
            risk_class = "low"
        elif score < 0.65:
            risk_class = "moderate"
        else:
            risk_class = "high"

        feat["properties"]["risk_score"] = score
        feat["properties"]["risk_class"] = risk_class
        feat["properties"]["flood_exposure"] = round(flood_smooth[i], 4)
        feat["properties"]["charger_access_deficit"] = round(charger_smooth[i], 4)
        feat["properties"]["transport_disruption"] = round(transport_smooth[i], 4)

    # 8. Build GeoJSON
    geojson = {
        "type": "FeatureCollection",
        "metadata": {
            "description": "Dubai EV Charging Resilience Index — H3 Resolution 8 prototype",
            "h3_resolution": H3_RESOLUTION,
            "study_area": "Dubai coastal urban corridor",
            "risk_model": "Deterministic mock data for visual prototyping only. NOT empirical.",
            "risk_formula": "0.40*flood + 0.35*charger_deficit + 0.20*transport + 0.05*noise",
            "coordinate_system": "WGS84 (EPSG:4326)",
            "cell_count": len(features),
        },
        "features": features,
    }

    # 9. Write output
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(geojson, separators=(",", ":")))

    # 10. Validation report
    lats = [feat["properties"]["center_lat"] for feat in features]
    lngs = [feat["properties"]["center_lng"] for feat in features]
    scores = [feat["properties"]["risk_score"] for feat in features]
    classes = [feat["properties"]["risk_class"] for feat in features]

    print(f"\n{'='*60}")
    print(f"Dubai H3 Res-8 Generation Complete")
    print(f"{'='*60}")
    print(f"  Output:              {OUTPUT_PATH}")
    print(f"  Cell count:          {len(features)}")
    print(f"  All valid H3 res-8:  {all(f['properties']['h3_resolution'] == 8 for f in features)}")
    print(f"  Lat bounds:          {min(lats):.4f} – {max(lats):.4f}")
    print(f"  Lng bounds:          {min(lngs):.4f} – {max(lngs):.4f}")
    print(f"  Risk score range:    {min(scores):.4f} – {max(scores):.4f}")
    print(f"  Risk classes:        low={classes.count('low')}, "
          f"moderate={classes.count('moderate')}, high={classes.count('high')}")
    print(f"  File size:           {OUTPUT_PATH.stat().st_size / 1024:.1f} KB")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
