"use client";

// ──────────────────────────────────────────────────────────────────────────────
// APPROVED — Do NOT modify any visual/rendering values in this file.
// See docs/globe-implementation.md for the authoritative reference.
// GEOGRAPHY LOCKED: preserve dataset, coordinates, sampling, and point placement.
// ──────────────────────────────────────────────────────────────────────────────

import landCoords from "../data/land-points.json";
import { useRef, useEffect } from "react";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Group,
  Mesh,
  BufferGeometry,
  Line,
  Points,
  ShaderMaterial,
  SphereGeometry,
  Float32BufferAttribute,
  Vector3,
  LineBasicMaterial,
  AdditiveBlending,
  NormalBlending,
} from "three";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const GLOBE_RADIUS = 5.1;
const DEPTH_SPHERE_RADIUS = 5.0;
const LAND_RADIUS = GLOBE_RADIUS + 0.018;
const NODE_RADIUS = GLOBE_RADIUS + 0.04;
const ARC_START_RADIUS = GLOBE_RADIUS + 0.035;
const EARTH_ROTATION_SPEED = (Math.PI * 2) / 45;
const CAMERA_Z = 20.2;
const FOV = 32;
const MAX_DPR = 1.75;
const GLOBE_Y_OFFSET = -1.6;

const VERTICAL_CLAMP = 0.75;
const HORIZONTAL_SENSITIVITY = 0.004;
const VERTICAL_SENSITIVITY = 0.003;
const INERTIA_DAMPING = 0.92;
const MAX_ANGULAR_VELOCITY = 0.8;
const AUTO_RESUME_DELAY = 2200;

const ARC_COLOR_CORE = 0x174bd8;
const ARC_COLOR_ACTIVE = 0x2457ef;
const ARC_COLOR_GLOW = 0x102d88;

const MIN_ARC_ELEVATION = 0.08;
const MAX_ARC_ELEVATION = 0.62;
const ARC_SEGMENTS = 100;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GlobeNode {
  id: string;
  lat: number;
  lon: number;
  size: number;
  pulsePhase: number;
  isHub: boolean;
}

interface GlobeConnection {
  id: string;
  from: string;
  to: string;
  startDelay: number;
  drawDuration: number;
  holdDuration: number;
  fadeDuration: number;
  restDuration: number;
}

/* ------------------------------------------------------------------ */
/*  Authored node data                                                 */
/* ------------------------------------------------------------------ */

const NODES: GlobeNode[] = [
  { id: "nyc", lat: 40.71, lon: -74.01, size: 1.4, pulsePhase: 0.0, isHub: true },
  { id: "dc", lat: 38.91, lon: -77.04, size: 0.7, pulsePhase: 0.7, isHub: false },
  { id: "chi", lat: 41.88, lon: -87.63, size: 0.65, pulsePhase: 1.4, isHub: false },
  { id: "den", lat: 39.74, lon: -104.99, size: 0.55, pulsePhase: 2.1, isHub: false },
  { id: "lax", lat: 34.05, lon: -118.24, size: 0.75, pulsePhase: 3.2, isHub: false },
  { id: "yyz", lat: 43.65, lon: -79.38, size: 0.6, pulsePhase: 4.0, isHub: false },
  { id: "gru", lat: -23.55, lon: -46.63, size: 0.65, pulsePhase: 1.1, isHub: false },
  { id: "lhr", lat: 51.51, lon: -0.13, size: 1.3, pulsePhase: 2.8, isHub: true },
  { id: "osl", lat: 59.91, lon: 10.75, size: 0.5, pulsePhase: 3.8, isHub: false },
  { id: "cmn", lat: 33.57, lon: -7.59, size: 0.45, pulsePhase: 0.3, isHub: false },
  { id: "dxb", lat: 25.20, lon: 55.27, size: 1.2, pulsePhase: 1.9, isHub: true },
  { id: "bom", lat: 19.08, lon: 72.88, size: 0.7, pulsePhase: 2.5, isHub: false },
  { id: "hnd", lat: 35.68, lon: 139.69, size: 1.25, pulsePhase: 4.5, isHub: true },
  { id: "sin", lat: 1.35, lon: 103.82, size: 0.7, pulsePhase: 3.5, isHub: false },
  { id: "syd", lat: -33.87, lon: 151.21, size: 0.65, pulsePhase: 0.9, isHub: false },
];

/* ------------------------------------------------------------------ */
/*  Authored connection data — staggered for max 3-4 visible           */
/* ------------------------------------------------------------------ */

const CONNECTIONS: GlobeConnection[] = [
  { id: "c1", from: "nyc", to: "lhr", startDelay: 0.0, drawDuration: 1.0, holdDuration: 2.5, fadeDuration: 0.9, restDuration: 4.0 },
  { id: "c3", from: "lax", to: "hnd", startDelay: 1.75, drawDuration: 1.1, holdDuration: 2.75, fadeDuration: 0.9, restDuration: 3.5 },
  { id: "c4", from: "lhr", to: "dxb", startDelay: 3.0, drawDuration: 0.9, holdDuration: 2.25, fadeDuration: 0.75, restDuration: 4.25 },
  { id: "c8", from: "gru", to: "nyc", startDelay: 4.5, drawDuration: 0.9, holdDuration: 2.25, fadeDuration: 0.75, restDuration: 4.0 },
  { id: "c12", from: "lhr", to: "hnd", startDelay: 6.25, drawDuration: 1.0, holdDuration: 2.5, fadeDuration: 0.9, restDuration: 3.75 },
  { id: "c5", from: "dxb", to: "bom", startDelay: 7.75, drawDuration: 0.75, holdDuration: 2.0, fadeDuration: 0.65, restDuration: 4.5 },
  { id: "c7", from: "hnd", to: "syd", startDelay: 9.25, drawDuration: 0.9, holdDuration: 2.25, fadeDuration: 0.75, restDuration: 4.0 },
  { id: "c10", from: "osl", to: "nyc", startDelay: 10.75, drawDuration: 0.9, holdDuration: 2.25, fadeDuration: 0.75, restDuration: 4.0 },
  { id: "c11", from: "dc", to: "lhr", startDelay: 12.25, drawDuration: 0.9, holdDuration: 2.25, fadeDuration: 0.75, restDuration: 4.0 },
  { id: "c15", from: "yyz", to: "lhr", startDelay: 13.75, drawDuration: 0.9, holdDuration: 2.25, fadeDuration: 0.75, restDuration: 4.0 },
  { id: "c2", from: "nyc", to: "chi", startDelay: 15.25, drawDuration: 0.75, holdDuration: 2.0, fadeDuration: 0.65, restDuration: 4.5 },
  { id: "c6", from: "bom", to: "sin", startDelay: 16.75, drawDuration: 0.75, holdDuration: 2.0, fadeDuration: 0.65, restDuration: 4.5 },
  { id: "c13", from: "sin", to: "syd", startDelay: 18.25, drawDuration: 0.75, holdDuration: 2.0, fadeDuration: 0.65, restDuration: 4.5 },
  { id: "c14", from: "dxb", to: "sin", startDelay: 19.75, drawDuration: 0.75, holdDuration: 2.0, fadeDuration: 0.65, restDuration: 4.5 },
  { id: "c9", from: "cmn", to: "lhr", startDelay: 21.25, drawDuration: 0.75, holdDuration: 2.0, fadeDuration: 0.65, restDuration: 4.5 },
];

/* ------------------------------------------------------------------ */
/*  Utility functions                                                  */
/* ------------------------------------------------------------------ */

const _v = new Vector3();

function latLonToVector3(
  lng: number,
  lat: number,
  radius: number,
  target: { x: number; y: number; z: number }
) {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  target.x = radius * Math.cos(latRad) * Math.sin(lngRad);
  target.y = radius * Math.sin(latRad);
  target.z = radius * Math.cos(latRad) * Math.cos(lngRad);
}

function latLonToVec3(lng: number, lat: number, radius: number): Vector3 {
  const t = { x: 0, y: 0, z: 0 };
  latLonToVector3(lng, lat, radius, t);
  return new Vector3(t.x, t.y, t.z);
}

function buildPositions(coords: number[], radius: number): Float32Array {
  const count = coords.length / 2;
  const positions = new Float32Array(count * 3);
  const v = { x: 0, y: 0, z: 0 };
  for (let i = 0; i < count; i++) {
    latLonToVector3(coords[i * 2], coords[i * 2 + 1], radius, v);
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  }
  return positions;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function createArcPoints(
  start: Vector3,
  end: Vector3,
  segments: number
): Vector3[] {
  const points: Vector3[] = [];
  const angle = start.angleTo(end);
  const arcHeight = clamp(
    angle * GLOBE_RADIUS * 0.18,
    MIN_ARC_ELEVATION,
    MAX_ARC_ELEVATION
  );

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    _v.copy(start).lerp(end, t).normalize();
    const radiusAtT = GLOBE_RADIUS + Math.sin(Math.PI * t) * arcHeight;
    _v.multiplyScalar(radiusAtT);
    points.push(_v.clone());
  }

  return points;
}

function nodeById(id: string): GlobeNode {
  return NODES.find((n) => n.id === id)!;
}

/* ------------------------------------------------------------------ */
/*  Atmosphere shader — subtle rim-only glow                            */
/* ------------------------------------------------------------------ */

const atmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const atmosphereFragmentShader = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 4.0);
  float intensity = fresnel * 0.18;
  gl_FragColor = vec4(0.2, 0.4, 1.0, intensity);
}
`;

/* ------------------------------------------------------------------ */
/*  Land-point shader — crisp circles, NormalBlending, no additive     */
/* ------------------------------------------------------------------ */

const landVertexShader = `
attribute float size;
uniform float uPixelRatio;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * uPixelRatio;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const landFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  if (d > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.43, 0.5, d);
  gl_FragColor = vec4(uColor, alpha * uOpacity);
}
`;

/* ------------------------------------------------------------------ */
/*  Node core shader — crisp cobalt disc, NormalBlending               */
/* ------------------------------------------------------------------ */

const nodeCoreVertexShader = `
attribute float size;
attribute float isHub;
uniform float uPixelRatio;
varying float vIsHub;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * uPixelRatio;
  gl_Position = projectionMatrix * mvPosition;
  vIsHub = isHub;
}
`;

const nodeCoreFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vIsHub;
void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  if (d > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.44, 0.5, d);
  float opacityMult = vIsHub > 0.5 ? 1.0 : 0.95;
  gl_FragColor = vec4(uColor, alpha * uOpacity * opacityMult);
}
`;

/* ------------------------------------------------------------------ */
/*  Node halo shader — compact soft glow, AdditiveBlending             */
/* ------------------------------------------------------------------ */

const nodeHaloVertexShader = `
attribute float size;
uniform float uPixelRatio;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * uPixelRatio;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const nodeHaloFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  if (d > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.0, 0.5, d);
  gl_FragColor = vec4(uColor, alpha * uOpacity);
}
`;

/* ------------------------------------------------------------------ */
/*  Signal core shader — small crisp dot, NormalBlending               */
/* ------------------------------------------------------------------ */

const signalCoreVertexShader = `
attribute float size;
uniform float uPixelRatio;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * uPixelRatio;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const signalCoreFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  if (d > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.44, 0.5, d);
  gl_FragColor = vec4(uColor, alpha * uOpacity);
}
`;

/* ------------------------------------------------------------------ */
/*  Signal halo shader — compact glow, AdditiveBlending                */
/* ------------------------------------------------------------------ */

const signalHaloVertexShader = `
attribute float size;
uniform float uPixelRatio;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * uPixelRatio;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const signalHaloFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  if (d > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.0, 0.5, d);
  gl_FragColor = vec4(uColor, alpha * uOpacity);
}
`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const HeroGlobe = () => {
  const frameIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_DPR);

    /* ---- Scene, Camera, Renderer ---- */
    const scene = new Scene();
    const globePlacementGroup = new Group();
    const interactiveTiltGroup = new Group();
    const rotatingEarthGroup = new Group();

    globePlacementGroup.position.y = GLOBE_Y_OFFSET;

    const camera = new PerspectiveCamera(FOV, width / height, 0.1, 200);
    camera.position.z = CAMERA_Z;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(pixelRatio);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    /* ---- Depth Sphere ---- */
    const depthSphere = new Mesh(
      new SphereGeometry(DEPTH_SPHERE_RADIUS, 48, 48),
      new ShaderMaterial({
        colorWrite: false,
        depthWrite: true,
        depthTest: true,
      })
    );
    depthSphere.renderOrder = -1;

    /* ---- Land Point Cloud ---- */
    // GEOGRAPHY LOCKED: preserve dataset, coordinates, sampling, and point placement.
    const positions = buildPositions(landCoords, LAND_RADIUS);
    const landGeometry = new BufferGeometry();
    landGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(positions, 3)
    );

    const landSizeAttr = new Float32Array(landCoords.length / 2);
    landSizeAttr.fill(1.4);
    landGeometry.setAttribute("size", new Float32BufferAttribute(landSizeAttr, 1));

    const landPoints = new Points(
      landGeometry,
      new ShaderMaterial({
        vertexShader: landVertexShader,
        fragmentShader: landFragmentShader,
        uniforms: {
          uColor: { value: new Vector3(0.533, 0.580, 0.678) },
          uOpacity: { value: 0.5 },
          uPixelRatio: { value: pixelRatio },
        },
        transparent: true,
        depthTest: true,
        depthWrite: false,
        blending: NormalBlending,
      })
    );

    /* ---- Node Cores (crisp cobalt discs, NormalBlending) ---- */
    const nodeCount = NODES.length;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeCoreSizes = new Float32Array(nodeCount);
    const nodeIsHubAttr = new Float32Array(nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      const node = NODES[i];
      const pos = latLonToVec3(node.lon, node.lat, NODE_RADIUS);
      nodePositions[i * 3] = pos.x;
      nodePositions[i * 3 + 1] = pos.y;
      nodePositions[i * 3 + 2] = pos.z;
      nodeCoreSizes[i] = node.isHub ? 9.5 : 6.5;
      nodeIsHubAttr[i] = node.isHub ? 1.0 : 0.0;
    }

    const nodeCoreGeo = new BufferGeometry();
    nodeCoreGeo.setAttribute("position", new Float32BufferAttribute(nodePositions, 3));
    nodeCoreGeo.setAttribute("size", new Float32BufferAttribute(nodeCoreSizes, 1));
    nodeCoreGeo.setAttribute("isHub", new Float32BufferAttribute(nodeIsHubAttr, 1));

    const nodeCorePoints = new Points(
      nodeCoreGeo,
      new ShaderMaterial({
        vertexShader: nodeCoreVertexShader,
        fragmentShader: nodeCoreFragmentShader,
        uniforms: {
          uColor: { value: new Vector3(0.09, 0.28, 0.91) },
          uOpacity: { value: 0.98 },
          uPixelRatio: { value: pixelRatio },
        },
        transparent: true,
        depthTest: true,
        depthWrite: false,
        blending: NormalBlending,
      })
    );
    rotatingEarthGroup.add(nodeCorePoints);

    /* ---- Node Halos (compact soft glow, AdditiveBlending) ---- */
    const nodeHaloSizes = new Float32Array(nodeCount);
    for (let i = 0; i < nodeCount; i++) {
      const node = NODES[i];
      nodeHaloSizes[i] = node.isHub ? 15 : 10;
    }

    const nodeHaloGeo = new BufferGeometry();
    nodeHaloGeo.setAttribute("position", new Float32BufferAttribute(nodePositions, 3));
    nodeHaloGeo.setAttribute("size", new Float32BufferAttribute(nodeHaloSizes, 1));

    const nodeHaloPoints = new Points(
      nodeHaloGeo,
      new ShaderMaterial({
        vertexShader: nodeHaloVertexShader,
        fragmentShader: nodeHaloFragmentShader,
        uniforms: {
          uColor: { value: new Vector3(0.09, 0.28, 0.91) },
          uOpacity: { value: 0.09 },
          uPixelRatio: { value: pixelRatio },
        },
        transparent: true,
        depthTest: true,
        depthWrite: false,
        blending: AdditiveBlending,
      })
    );
    rotatingEarthGroup.add(nodeHaloPoints);

    /* ---- Arc Lines ---- */
    const arcLines: {
      core: Line;
      glow: Line;
      conn: GlobeConnection;
      totalSegments: number;
      startPos: Vector3;
      endPos: Vector3;
    }[] = [];

    for (const conn of CONNECTIONS) {
      const fromNode = nodeById(conn.from);
      const toNode = nodeById(conn.to);
      const startPos = latLonToVec3(fromNode.lon, fromNode.lat, ARC_START_RADIUS);
      const endPos = latLonToVec3(toNode.lon, toNode.lat, ARC_START_RADIUS);
      const arcPoints = createArcPoints(startPos, endPos, ARC_SEGMENTS);

      const totalSegments = arcPoints.length - 1;

      const corePositions = new Float32Array(arcPoints.length * 3);
      for (let i = 0; i < arcPoints.length; i++) {
        corePositions[i * 3] = arcPoints[i].x;
        corePositions[i * 3 + 1] = arcPoints[i].y;
        corePositions[i * 3 + 2] = arcPoints[i].z;
      }

      const coreGeo = new BufferGeometry();
      coreGeo.setAttribute("position", new Float32BufferAttribute(corePositions, 3));
      coreGeo.setDrawRange(0, 0);

      const coreLine = new Line(
        coreGeo,
        new LineBasicMaterial({
          color: ARC_COLOR_CORE,
          transparent: true,
          opacity: 0.7,
          depthTest: true,
          depthWrite: false,
          linewidth: 1,
        })
      );

      const glowGeo = new BufferGeometry();
      glowGeo.setAttribute("position", new Float32BufferAttribute(corePositions, 3));
      glowGeo.setDrawRange(0, 0);

      const glowLine = new Line(
        glowGeo,
        new LineBasicMaterial({
          color: ARC_COLOR_GLOW,
          transparent: true,
          opacity: 0.06,
          depthTest: true,
          depthWrite: false,
          linewidth: 1,
          blending: AdditiveBlending,
        })
      );

      rotatingEarthGroup.add(coreLine);
      rotatingEarthGroup.add(glowLine);

      arcLines.push({
        core: coreLine,
        glow: glowLine,
        conn,
        totalSegments,
        startPos: startPos.clone(),
        endPos: endPos.clone(),
      });
    }

    /* ---- Signal Head Cores (crisp, NormalBlending) ---- */
    const signalCount = CONNECTIONS.length;
    const signalPositions = new Float32Array(signalCount * 3);
    const signalCoreSizes = new Float32Array(signalCount);

    for (let i = 0; i < signalCount; i++) {
      signalCoreSizes[i] = 0;
    }

    const signalCoreGeo = new BufferGeometry();
    signalCoreGeo.setAttribute("position", new Float32BufferAttribute(signalPositions, 3));
    signalCoreGeo.setAttribute("size", new Float32BufferAttribute(signalCoreSizes, 1));

    const signalCorePoints = new Points(
      signalCoreGeo,
      new ShaderMaterial({
        vertexShader: signalCoreVertexShader,
        fragmentShader: signalCoreFragmentShader,
        uniforms: {
          uColor: { value: new Vector3(0.19, 0.37, 1.0) },
          uOpacity: { value: 0.95 },
          uPixelRatio: { value: pixelRatio },
        },
        transparent: true,
        depthTest: true,
        depthWrite: false,
        blending: NormalBlending,
      })
    );
    rotatingEarthGroup.add(signalCorePoints);

    /* ---- Signal Head Halos (compact, AdditiveBlending) ---- */
    const signalHaloSizes = new Float32Array(signalCount);
    for (let i = 0; i < signalCount; i++) {
      signalHaloSizes[i] = 0;
    }

    const signalHaloGeo = new BufferGeometry();
    signalHaloGeo.setAttribute("position", new Float32BufferAttribute(signalPositions, 3));
    signalHaloGeo.setAttribute("size", new Float32BufferAttribute(signalHaloSizes, 1));

    const signalHaloPoints = new Points(
      signalHaloGeo,
      new ShaderMaterial({
        vertexShader: signalHaloVertexShader,
        fragmentShader: signalHaloFragmentShader,
        uniforms: {
          uColor: { value: new Vector3(0.19, 0.37, 1.0) },
          uOpacity: { value: 0.09 },
          uPixelRatio: { value: pixelRatio },
        },
        transparent: true,
        depthTest: true,
        depthWrite: false,
        blending: AdditiveBlending,
      })
    );
    rotatingEarthGroup.add(signalHaloPoints);

    /* ---- Atmosphere (subtle rim glow) ---- */
    const ATMOSPHERE_RADIUS = GLOBE_RADIUS + 0.12;
    const atmosphereMesh = new Mesh(
      new SphereGeometry(ATMOSPHERE_RADIUS, 48, 48),
      new ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        transparent: true,
        depthWrite: false,
        side: 1,
        blending: AdditiveBlending,
      })
    );
    atmosphereMesh.renderOrder = 1;

    /* ---- Assemble Hierarchy ---- */
    rotatingEarthGroup.add(depthSphere);
    rotatingEarthGroup.add(landPoints);
    interactiveTiltGroup.add(rotatingEarthGroup);
    globePlacementGroup.add(interactiveTiltGroup);
    globePlacementGroup.add(atmosphereMesh);
    scene.add(globePlacementGroup);

    /* ---- Interaction State ---- */
    let isDragging = false;
    let pointerId: number | null = null;
    let dragLatitude = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let lastPointerTime = 0;
    let autoResumeTimer: ReturnType<typeof setTimeout> | null = null;
    let autoRotationPaused = false;
    let dragLongitudeAccum = 0;

    /* ---- Render Loop ---- */
    let lastFrameTime = performance.now();

    const animate = (now: number) => {
      frameIdRef.current = requestAnimationFrame(animate);

      const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      /* Auto-rotation — only when not dragging and no inertia */
      if (!autoRotationPaused && !isDragging) {
        const hasInertia = Math.abs(velocityX) > 0.0001 || Math.abs(velocityY) > 0.0001;
        if (!hasInertia) {
          dragLongitudeAccum += EARTH_ROTATION_SPEED * dt;
        }
      }

      /* Inertia decay */
      if (!isDragging && (Math.abs(velocityX) > 0.0001 || Math.abs(velocityY) > 0.0001)) {
        velocityX *= INERTIA_DAMPING;
        velocityY *= INERTIA_DAMPING;
        dragLongitudeAccum += velocityX * dt;
        dragLatitude += velocityY * dt;
        dragLatitude = clamp(dragLatitude, -VERTICAL_CLAMP, VERTICAL_CLAMP);
      } else if (!isDragging) {
        velocityX = 0;
        velocityY = 0;
      }

      /* Apply rotation */
      rotatingEarthGroup.rotation.y = dragLongitudeAccum;
      interactiveTiltGroup.rotation.x = dragLatitude;

      /* Node pulse (subtle) */
      if (!prefersReducedMotion) {
        const timeSeconds = now / 1000;
        const coreSizeAttr = nodeCoreGeo.attributes.size as Float32BufferAttribute;
        const haloSizeAttr = nodeHaloGeo.attributes.size as Float32BufferAttribute;
        for (let i = 0; i < NODES.length; i++) {
          const node = NODES[i];
          const coreBase = node.isHub ? 9.5 : 6.5;
          const haloBase = node.isHub ? 15 : 10;
          const pulse = 1 + Math.sin(timeSeconds * 0.6 + node.pulsePhase) * 0.06;
          coreSizeAttr.setX(i, coreBase * pulse);
          haloSizeAttr.setX(i, haloBase * pulse);
        }
        coreSizeAttr.needsUpdate = true;
        haloSizeAttr.needsUpdate = true;
      }

      /* Arc lifecycle */
      for (let i = 0; i < arcLines.length; i++) {
        const arc = arcLines[i];
        const conn = arc.conn;
        const period =
          conn.drawDuration + conn.holdDuration + conn.fadeDuration + conn.restDuration;
        const cycleTime = ((now / 1000) - conn.startDelay) % period;

        let progress = 0;
        let opacity = 0;
        let visible = false;

        if (!prefersReducedMotion) {
          if (cycleTime >= 0 && cycleTime < conn.drawDuration) {
            const t = cycleTime / conn.drawDuration;
            progress = easeOutCubic(t);
            opacity = 0.7;
            visible = true;
          } else if (
            cycleTime >= conn.drawDuration &&
            cycleTime < conn.drawDuration + conn.holdDuration
          ) {
            progress = 1;
            opacity = 0.7;
            visible = true;
          } else if (
            cycleTime >= conn.drawDuration + conn.holdDuration &&
            cycleTime < conn.drawDuration + conn.holdDuration + conn.fadeDuration
          ) {
            const fadeT =
              (cycleTime - conn.drawDuration - conn.holdDuration) / conn.fadeDuration;
            progress = 1;
            opacity = 0.7 * (1 - fadeT);
            visible = opacity > 0.01;
          } else {
            visible = false;
          }
        } else {
          progress = 1;
          opacity = 0.4;
          visible = true;
        }

        const drawCount = Math.floor(progress * arc.totalSegments);

        if (visible && drawCount > 0) {
          arc.core.geometry.setDrawRange(0, drawCount + 1);
          (arc.core.material as LineBasicMaterial).color.setHex(
            progress < 1 ? ARC_COLOR_ACTIVE : ARC_COLOR_CORE
          );
          (arc.core.material as LineBasicMaterial).opacity = opacity;
          arc.core.visible = true;

          /* Arc glow — endpoint attenuation */
          const endpointFade =
            Math.min(1, progress / 0.08) * Math.min(1, (1 - progress) / 0.08);
          const glowOpacity = opacity * 0.08 * Math.max(0, Math.min(1, endpointFade));
          arc.glow.geometry.setDrawRange(0, drawCount + 1);
          (arc.glow.material as LineBasicMaterial).opacity = glowOpacity;
          arc.glow.visible = glowOpacity > 0.001;
        } else {
          arc.core.visible = false;
          arc.glow.visible = false;
        }
      }

      /* Signal head update — only on medium/long routes */
      const sigPosAttr = signalCoreGeo.attributes.position as Float32BufferAttribute;
      const sigCoreSizeAttr = signalCoreGeo.attributes.size as Float32BufferAttribute;
      const sigHaloSizeAttr = signalHaloGeo.attributes.size as Float32BufferAttribute;

        const LONG_ROUTE_THRESHOLD = 80;

      for (let i = 0; i < arcLines.length; i++) {
        const arc = arcLines[i];
        const conn = arc.conn;
        const period =
          conn.drawDuration + conn.holdDuration + conn.fadeDuration + conn.restDuration;
        const cycleTime = ((now / 1000) - conn.startDelay) % period;

        const fromNode = nodeById(conn.from);
        const toNode = nodeById(conn.to);
        const routeAngle = latLonToVec3(fromNode.lon, fromNode.lat, 1)
          .angleTo(latLonToVec3(toNode.lon, toNode.lat, 1));
        const isMediumOrLong = routeAngle > LONG_ROUTE_THRESHOLD * (Math.PI / 180);

        let progress = 0;
        let visible = false;

        if (!prefersReducedMotion) {
          if (cycleTime >= 0 && cycleTime < conn.drawDuration) {
            const t = cycleTime / conn.drawDuration;
            progress = easeOutCubic(t);
            visible = true;
          } else if (cycleTime < conn.drawDuration + conn.holdDuration) {
            progress = 1;
            visible = true;
          } else if (cycleTime < conn.drawDuration + conn.holdDuration + conn.fadeDuration) {
            progress = 1;
            visible = true;
          }
        } else {
          progress = 1;
          visible = true;
        }

        if (visible && progress < 1 && !prefersReducedMotion && isMediumOrLong) {
          _v.copy(arc.startPos).lerp(arc.endPos, progress).normalize();
          const angle = arc.startPos.angleTo(arc.endPos);
          const arcH = clamp(angle * GLOBE_RADIUS * 0.18, MIN_ARC_ELEVATION, MAX_ARC_ELEVATION);
          const r = GLOBE_RADIUS + Math.sin(Math.PI * progress) * arcH;

          sigPosAttr.setXYZ(i, _v.x * r, _v.y * r, _v.z * r);
          sigCoreSizeAttr.setX(i, 3.0);
          sigHaloSizeAttr.setX(i, 5.0);
        } else if (visible && progress >= 1 && !prefersReducedMotion && isMediumOrLong) {
          /* Fade signal quickly after route completes */
          const fadeStart = conn.drawDuration + conn.holdDuration;
          const fadeElapsed = cycleTime - fadeStart;
          if (fadeElapsed >= 0 && fadeElapsed < 0.15) {
            const fadeT = fadeElapsed / 0.15;
            sigCoreSizeAttr.setX(i, 3.0 * (1 - fadeT));
            sigHaloSizeAttr.setX(i, 5.0 * (1 - fadeT));
          } else {
            sigCoreSizeAttr.setX(i, 0);
            sigHaloSizeAttr.setX(i, 0);
          }
        } else {
          sigCoreSizeAttr.setX(i, 0);
          sigHaloSizeAttr.setX(i, 0);
        }
      }

      sigPosAttr.needsUpdate = true;
      sigCoreSizeAttr.needsUpdate = true;
      sigHaloSizeAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    /* ---- Pointer Interaction ---- */
    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      isDragging = true;
      pointerId = e.pointerId;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      lastPointerTime = performance.now();
      velocityX = 0;
      velocityY = 0;

      container.setPointerCapture(e.pointerId);
      container.style.cursor = "grabbing";

      if (autoResumeTimer) {
        clearTimeout(autoResumeTimer);
        autoResumeTimer = null;
      }
      autoRotationPaused = true;
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging || e.pointerId !== pointerId) return;

      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      const now = performance.now();
      const dtMs = Math.max(now - lastPointerTime, 1);

      dragLongitudeAccum -= dx * HORIZONTAL_SENSITIVITY;
      dragLatitude += dy * VERTICAL_SENSITIVITY;
      dragLatitude = clamp(dragLatitude, -VERTICAL_CLAMP, VERTICAL_CLAMP);

      velocityX = (-dx * HORIZONTAL_SENSITIVITY) / (dtMs / 1000);
      velocityY = (dy * VERTICAL_SENSITIVITY) / (dtMs / 1000);

      velocityX = clamp(velocityX, -MAX_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY);
      velocityY = clamp(velocityY, -MAX_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY);

      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      lastPointerTime = now;
    }

    function onPointerUp(e: PointerEvent) {
      if (e.pointerId !== pointerId) return;
      isDragging = false;
      pointerId = null;

      container.releasePointerCapture(e.pointerId);
      container.style.cursor = "grab";

      autoResumeTimer = setTimeout(() => {
        autoRotationPaused = false;
        velocityX = 0;
        velocityY = 0;
      }, AUTO_RESUME_DELAY);
    }

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.style.cursor = "grab";
    container.style.touchAction = "pan-y";

    /* ---- Resize ---- */
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", handleResize);

    /* ---- Cleanup ---- */
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);

      if (autoResumeTimer) clearTimeout(autoResumeTimer);

      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }

      /* Dispose node geometry and materials */
      nodeCoreGeo.dispose();
      if (nodeCorePoints.material instanceof ShaderMaterial)
        nodeCorePoints.material.dispose();
      nodeHaloGeo.dispose();
      if (nodeHaloPoints.material instanceof ShaderMaterial)
        nodeHaloPoints.material.dispose();

      /* Dispose arc geometry and materials */
      for (const arc of arcLines) {
        arc.core.geometry.dispose();
        if (arc.core.material instanceof LineBasicMaterial) arc.core.material.dispose();
        arc.glow.geometry.dispose();
        if (arc.glow.material instanceof LineBasicMaterial) arc.glow.material.dispose();
      }

      /* Dispose signal */
      signalCoreGeo.dispose();
      if (signalCorePoints.material instanceof ShaderMaterial)
        signalCorePoints.material.dispose();
      signalHaloGeo.dispose();
      if (signalHaloPoints.material instanceof ShaderMaterial)
        signalHaloPoints.material.dispose();

      /* Dispose atmosphere */
      atmosphereMesh.geometry.dispose();
      if (atmosphereMesh.material instanceof ShaderMaterial)
        atmosphereMesh.material.dispose();

      renderer.dispose();
      landGeometry.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
      />
      {/* Lower haze — covers bottom of globe, fades upward into transparency */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "55%",
          background:
            "linear-gradient(to bottom, rgba(2,3,6,0) 0%, rgba(2,3,6,0.3) 25%, rgba(2,3,6,0.75) 55%, rgba(2,3,6,0.95) 80%, #020306 100%)",
        }}
      />
    </>
  );
};

export default HeroGlobe;
