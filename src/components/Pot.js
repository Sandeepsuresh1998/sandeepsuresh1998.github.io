'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Pot({ visible }) {
  const groupRef = useRef()

  const potGeometry = useMemo(() => {
    const points = [
      new THREE.Vector2(0.55, 0),
      new THREE.Vector2(0.5, 0.05),
      new THREE.Vector2(0.42, 0.15),
      new THREE.Vector2(0.48, 0.6),
      new THREE.Vector2(0.58, 1.0),
      new THREE.Vector2(0.68, 1.2),
      new THREE.Vector2(0.72, 1.25),
      new THREE.Vector2(0.68, 1.3),
      new THREE.Vector2(0.62, 1.25),
    ]
    return new THREE.LatheGeometry(points, 32)
  }, [])

  const startTime = useRef(performance.now())

  useFrame(() => {
    if (!groupRef.current || !visible) return
    const elapsed = (performance.now() - startTime.current) / 600
    const t = Math.min(1, elapsed)
    // Ease out bounce-ish
    const s = t < 1 ? 1 - Math.pow(1 - t, 3) : 1
    groupRef.current.scale.setScalar(s)
  })

  if (!visible) return null

  return (
    <group ref={groupRef} scale={0}>
      <mesh geometry={potGeometry}>
        <meshStandardMaterial color="#D4845A" roughness={0.8} metalness={0.02} />
      </mesh>
      <mesh position={[0, 1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.58, 32]} />
        <meshStandardMaterial color="#4A3628" roughness={1.0} />
      </mesh>
    </group>
  )
}
