type LngLat = [number, number];

interface ContinentRegion {
  name: string;
  bounds: [number, number, number, number]; // [minLng, maxLng, minLat, maxLat]
  step: number;
  exclude?: { cx: number; cy: number; r: number }[];
}

const REGIONS: ContinentRegion[] = [
  { name: "North America", bounds: [-168, -52, 14, 74], step: 3.5 },
  { name: "Central America", bounds: [-118, -60, 6, 20], step: 3 },
  { name: "South America", bounds: [-82, -34, -56, 14], step: 3.5 },
  { name: "Europe", bounds: [-12, 45, 34, 72], step: 3 },
  { name: "Africa", bounds: [-18, 52, -36, 38], step: 3.5 },
  { name: "Asia", bounds: [25, 180, 4, 76], step: 4 },
  { name: "Middle East", bounds: [25, 62, 12, 42], step: 3 },
  { name: "Southeast Asia", bounds: [94, 142, -10, 22], step: 3 },
  { name: "Australia", bounds: [112, 155, -40, -10], step: 3.5 },
  { name: "Greenland", bounds: [-73, -12, 59, 84], step: 4 },
  { name: "Japan", bounds: [128, 146, 30, 46], step: 2.5 },
  { name: "UK", bounds: [-8, 2, 50, 59], step: 2 },
  { name: "New Zealand", bounds: [165, 179, -48, -34], step: 3 },
  { name: "Iceland", bounds: [-25, -13, 63, 67], step: 2.5 },
  { name: "Madagascar", bounds: [43, 50, -26, -12], step: 2.5 },
  { name: "Sri Lanka", bounds: [79, 82, 6, 10], step: 2 },
  { name: "Papua", bounds: [130, 152, -9, -1], step: 3 },
];

function pointInExcludes(
  lng: number,
  lat: number,
  excludes?: { cx: number; cy: number; r: number }[]
): boolean {
  if (!excludes) return false;
  for (const e of excludes) {
    const dx = lng - e.cx;
    const dy = lat - e.cy;
    if (dx * dx + dy * dy < e.r * e.r) return true;
  }
  return false;
}

export function generateLandPoints(): LngLat[] {
  const pointSet = new Set<string>();
  const result: LngLat[] = [];

  for (const region of REGIONS) {
    const [minLng, maxLng, minLat, maxLat] = region.bounds;
    for (let lng = minLng; lng <= maxLng; lng += region.step) {
      for (let lat = minLat; lat <= maxLat; lat += region.step) {
        const jitterLng = lng + (Math.sin(lat * 7.3 + lng * 11.7) * region.step * 0.3);
        const jitterLat = lat + (Math.cos(lng * 5.1 + lat * 13.3) * region.step * 0.3);

        const snapLng = Math.round(jitterLng * 10) / 10;
        const snapLat = Math.round(jitterLat * 10) / 10;
        const key = `${snapLng},${snapLat}`;

        if (!pointSet.has(key) && !pointInExcludes(snapLng, snapLat, region.exclude)) {
          pointSet.add(key);
          result.push([snapLng, snapLat]);
        }
      }
    }
  }

  return result;
}

export const LAND_POINTS: LngLat[] = generateLandPoints();
