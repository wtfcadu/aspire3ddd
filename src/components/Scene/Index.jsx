'use client';
import { Canvas } from '@react-three/fiber'
import Model from './Model';
import { Environment } from '@react-three/drei'

export default function Index() {
  return (
    <Canvas 
      style={{background: '#00a000'}}
      dpr={[1, 2]} // Optimize performance
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
        <Model />
        <directionalLight intensity={2} position={[0, 2, 3]}/>
        <Environment preset="city" />
    </Canvas>
  )
}
