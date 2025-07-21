import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, particles, particleSystem;

    const init = () => {
      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasRef.current,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Particles
      particles = new THREE.BufferGeometry();
      const particleTexture = new THREE.TextureLoader().load(
        // "https://threejs.org/examples/textures/particle2.png"
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSw-qamVQ1saV_kCQZLZSZATcIzr-QPa1ufA&s"
      );

      const positions = [];
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        positions.push(x, y, z);
      }
      particles.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );

      const particleMaterial = new THREE.PointsMaterial({
        size: 1,
        map: particleTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthTest: false,
        color: 0xffffff,
      });

      particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        particleSystem.rotation.y += 0.001;

        renderer.render(scene, camera);
      };

      animate();

      // Event listener to handle window resizing
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    };

    init();

    return () => {
      // Clean up Three.js scene when component unmounts
      scene.dispose();
      camera.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Background;
