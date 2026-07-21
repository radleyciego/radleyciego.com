const fs = require('fs');
const path = require('path');

const LATTICE_STEP = 1.25;

const geojsonPath = path.join(__dirname, 'land.geojson');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'land-points.json');

const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

const geometryCount = geojson.features.length;
console.log('Source:', geojsonPath);
console.log('Features (geometries):', geometryCount);

// ray-casting point-in-polygon for a single ring
function pointInRing(point, ring) {
  const [px, py] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

// A point is inside a Polygon if it's in the exterior ring
// and NOT inside any hole ring.
function pointInPolygon(point, coordinates) {
  const exterior = coordinates[0];
  if (!pointInRing(point, exterior)) return false;
  for (let h = 1; h < coordinates.length; h++) {
    if (pointInRing(point, coordinates[h])) return false;
  }
  return true;
}

function pointInFeature(point, feature) {
  const geom = feature.geometry;
  if (geom.type === 'Polygon') {
    return pointInPolygon(point, geom.coordinates);
  }
  if (geom.type === 'MultiPolygon') {
    for (const polygon of geom.coordinates) {
      if (pointInPolygon(point, polygon)) return true;
    }
  }
  return false;
}

function isLand(point) {
  for (const feature of geojson.features) {
    if (pointInFeature(point, feature)) return true;
  }
  return false;
}

let candidateCount = 0;
const accepted = [];

for (let lat = -90; lat <= 90; lat += LATTICE_STEP) {
  for (let lng = -180; lng <= 180; lng += LATTICE_STEP) {
    candidateCount++;
    if (isLand([lng, lat])) {
      accepted.push(lng, lat);
    }
  }
}

const pointCount = accepted.length / 2;

fs.writeFileSync(outputPath, JSON.stringify(accepted));

const stats = fs.statSync(outputPath);
console.log('Candidate lattice points:', candidateCount);
console.log('Accepted land points:', pointCount);
console.log('Output:', outputPath);
console.log('Output file size:', (stats.size / 1024).toFixed(1), 'KB');
