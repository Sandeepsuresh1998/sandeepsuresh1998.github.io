'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useCallback, useRef } from 'react'
import Plant from './Plant'
import CameraController from './CameraController'

export default function PlantScene({ activeLeaf, onLeafClick, onZoomComplete }) {
  const [growthPhase, setGrowthPhase] = useState('pot')
  const leafPositions = useRef({})

  const registerLeafPosition = useCallback((label, position, normal) => {
    leafPositions.current[label] = { position, normal }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 3.2, 9], fov: 45, near: 0.1, far: 100 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#000000']} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1.5} />
      <directionalLight position={[-4, 6, -3]} intensity={0.6} color="#e8f5e9" />
      <pointLight position={[0, 5, 3]} intensity={0.8} />

      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={10}
        enableDamping
        dampingFactor={0.05}
        enabled={!activeLeaf}
        target={[0, 2.2, 0]}
      />

      <CameraController
        activeLeaf={activeLeaf}
        leafPositions={leafPositions}
        onZoomComplete={onZoomComplete}
      />

      <Plant
        onLeafClick={onLeafClick}
        growthPhase={growthPhase}
        setGrowthPhase={setGrowthPhase}
        activeLeaf={activeLeaf}
        registerLeafPosition={registerLeafPosition}
      />
    </Canvas>
  )
}
