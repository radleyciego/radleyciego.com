"use client";

import dynamic from "next/dynamic";

const HeroGlobeLoader = dynamic(() => import("./hero-globe"), { ssr: false });

export default HeroGlobeLoader;
