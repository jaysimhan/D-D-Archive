import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function SmokeEffect() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- Scene Setup ---
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
        camera.position.z = 1000;
        scene.add(camera);

        // Light
        const light = new THREE.DirectionalLight(0xffffff, 1); // Improved light intensity
        light.position.set(-1, 0, 1);
        scene.add(light);

        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
        containerRef.current.appendChild(renderer.domElement);

        // --- Procedural Texture Generation ---
        // Create a canvas-based radial gradient texture for the smoke
        const createSmokeTexture = () => {
            const size = 128; // Reduced size for performance
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            if (!ctx) return null;

            // Create a soft, irregular cloud-like gradient
            const gradient = ctx.createRadialGradient(
                size / 2, size / 2, 0,
                size / 2, size / 2, size / 2
            );

            // Smoke colors - using grays/whites with varying alpha 
            gradient.addColorStop(0, 'rgba(200, 200, 200, 0.2)'); // Core
            gradient.addColorStop(0.4, 'rgba(150, 150, 150, 0.1)'); // Mid
            gradient.addColorStop(0.8, 'rgba(100, 100, 100, 0.05)'); // Edge
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent outside

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);

            const texture = new THREE.CanvasTexture(canvas);
            return texture;
        };

        const smokeTexture = createSmokeTexture();
        if (!smokeTexture) return;

        const smokeMaterial = new THREE.MeshLambertMaterial({
            color: 0xaaaaaa, // Light gray base
            map: smokeTexture,
            transparent: true,
            opacity: 0.2, // Subtle opacity
            depthWrite: false, // Don't occlude other particles
            blending: THREE.AdditiveBlending, // Glowy effect
        });

        const smokeGeometry = new THREE.PlaneGeometry(300, 300);
        const smokeParticles: THREE.Mesh[] = [];

        // Create particles
        for (let p = 0; p < 45; p++) { // Reduced count for subtlety
            const particle = new THREE.Mesh(smokeGeometry, smokeMaterial);
            particle.position.set(
                Math.random() * 800 - 400,
                Math.random() * 500 - 250,
                Math.random() * 1000 - 100
            );
            particle.rotation.z = Math.random() * 360;
            scene.add(particle);
            smokeParticles.push(particle);
        }

        // --- Animation ---
        const clock = new THREE.Clock(); // Use clock for smooth delta time
        let animationId: number;

        const animate = () => {
            const delta = clock.getDelta();
            animationId = requestAnimationFrame(animate);

            // Rotate particles
            smokeParticles.forEach((particle) => {
                particle.rotation.z += delta * 0.1; // Slow rotation
            });

            renderer.render(scene, camera);
        };

        animate();

        // --- Cleanup ---
        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);

            // Dispose Three.js resources
            smokeGeometry.dispose();
            smokeMaterial.dispose();
            smokeTexture.dispose();
            renderer.dispose();

            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none fade-in duration-1000" />;
}
