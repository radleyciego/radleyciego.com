import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function GlobeAnimation() {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        // Globe geometry
        const globeGeometry = new THREE.SphereGeometry(5, 32, 32);
        const globeMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/path/to/your/globe/texture.jpg'), // Update the texture path
        });
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);

        // Animation of the globe
        function animate() {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.001; // Rotation speed
            renderer.render(scene, camera);
        }
        camera.position.z = 10;
        animate();

        return () => {
            currentMount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

export default GlobeAnimation;
