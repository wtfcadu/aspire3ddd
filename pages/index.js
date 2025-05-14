'use client';
import React, { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './styles.module.css';

// Import Scene with no SSR to ensure it only loads in browser
const Scene = dynamic(() => import('../src/components/Scene'), {
  ssr: false,
  loading: () => <div style={{ color: "white", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading 3D scene...</div>
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Only show scene once mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className={styles.main} style={{ width: '100%', height: '100vh', background: 'black' }}>
      {mounted && (
        <Suspense fallback={<div style={{ color: "white", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading 3D scene...</div>}>
          <Scene />
        </Suspense>
      )}
    </main>
  );
} 