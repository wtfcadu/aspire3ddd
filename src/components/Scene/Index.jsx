'use client';
import { Canvas } from '@react-three/fiber'
import Model from './Model';
import { Environment } from '@react-three/drei'
import { LevaProvider } from 'leva'

export default function Index() {
  return (
    <LevaProvider
      theme={{
        colors: {
          elevation1: 'rgba(0, 0, 0, 0.8)',
        },
        styles: {
          panel: {
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }
        }
      }}
    >
      <Canvas style={{background: 'black'}}>
          <Model />
          <directionalLight intensity={0.5} position={[10, 2, 8]}/>
          <Environment preset="night" />
      </Canvas>
    </LevaProvider>
  )
}
