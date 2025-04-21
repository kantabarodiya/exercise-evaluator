import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeOverlay = ({ width, height, issues }) => {
  const containerRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const cameraRef = useRef();
  const previousIssuesRef = useRef([]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    animate();

    return () => {
      renderer.dispose();
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
  }, [width, height]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const previousIssues = previousIssuesRef.current;

    previousIssues.forEach((issue) => {
      scene.remove(issue.sphere);
      if (issue.div) {
        containerRef.current.removeChild(issue.div);
      }
    });

    previousIssuesRef.current = [];

    issues.forEach((issue) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.01, 16, 16),
        new THREE.MeshBasicMaterial({ color: 'red' })
      );
      sphere.position.set(issue.x - 0.5, -issue.y + 0.5, 0); 
      scene.add(sphere);

      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.color = 'white';
      div.style.backgroundColor = 'rgba(0,0,0,0.5)';
      div.style.padding = '2px 4px';
      div.style.borderRadius = '4px';
      div.innerText = issue.message;
      div.style.left = `${issue.x * width}px`;
      div.style.top = `${issue.y * height}px`;
      div.style.fontSize = '10px';
      div.style.pointerEvents = 'none';
      containerRef.current.appendChild(div);

      previousIssuesRef.current.push({ sphere, div });
    });
  }, [issues, width, height]);

  const animate = () => {
    requestAnimationFrame(animate);
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ThreeOverlay;
