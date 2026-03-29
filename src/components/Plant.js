'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import Pot from './Pot'

const BRANCHES = [
  { angle: 0.3, spread: 0.9, height: 2.6, leafDroop: 0.85, label: 'career' },
  { angle: 1.8, spread: 1.1, height: 3.0, leafDroop: 0.7, label: 'blog' },
  { angle: 3.5, spread: 0.85, height: 2.3, leafDroop: 0.95, label: 'contact' },
  { angle: 5.1, spread: 1.0, height: 2.8, leafDroop: 0.8, label: 'socials' },
]

function createLeafGeometry() {
  const length = 2.4, maxWidth = 0.65, segs = 26
  const verts = [], idx = [], uvs = [], cols = []
  for (let i = 0; i <= segs; i++) {
    for (let j = 0; j <= segs; j++) {
      const u = i / segs, v = (j / segs) * 2 - 1
      const w = Math.sin(u * Math.PI) * (1 - 0.4 * u * u) * maxWidth
      verts.push(v * w, u * length, -u * u * u * 1.2 - Math.abs(v) * v * 0.18 * u * u + Math.exp(-v * v * 50) * 0.04 * (1 - u * 0.4))
      uvs.push(j / segs, i / segs)
      const c = Math.exp(-v * v * 3) * 0.1, t = 1 - u * 0.08
      cols.push((0.24 + c) * t, (0.64 + c * 1.5) * t, (0.16 + c * 0.4) * t)
    }
  }
  for (let i = 0; i < segs; i++)
    for (let j = 0; j < segs; j++) {
      const a = i * (segs + 1) + j
      idx.push(a, (i + 1) * (segs + 1) + j, a + 1)
      idx.push(a + 1, (i + 1) * (segs + 1) + j, (i + 1) * (segs + 1) + j + 1)
    }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
  g.setIndex(idx); g.computeVertexNormals(); g.computeBoundingSphere()
  return g
}

function createStemCurve(cfg) {
  const dx = Math.sin(cfg.angle) * cfg.spread, dz = Math.cos(cfg.angle) * cfg.spread
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(dx * 0.2, cfg.height * 0.3, dz * 0.2),
    new THREE.Vector3(dx * 0.5, cfg.height * 0.6, dz * 0.5),
    new THREE.Vector3(dx * 0.8, cfg.height * 0.85, dz * 0.8),
    new THREE.Vector3(dx, cfg.height, dz),
  ])
}

function Branch({ config, index, phase, onLeafClick, activeLeaf, registerLeafPosition }) {
  const branchRef = useRef()
  const leafMatRef = useRef()
  const [hovered, setHovered] = useState(false)

  const leafGeom = useMemo(() => createLeafGeometry(), [])
  const curve = useMemo(() => createStemCurve(config), [config])
  const stemGeom = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.07, 8, false), [curve])
  const tip = useMemo(() => curve.getPointAt(1), [curve])
  const tipWorld = useMemo(() => new THREE.Vector3(tip.x, tip.y + 1.2, tip.z), [tip])
  const outDir = useMemo(() => new THREE.Vector3(Math.sin(config.angle), 0.15, Math.cos(config.angle)).normalize(), [config.angle])

  useEffect(() => {
    if (registerLeafPosition) registerLeafPosition(config.label, tipWorld, outDir)
  }, [registerLeafPosition, config.label, tipWorld, outDir])

  const interactive = phase === 'idle'

  useFrame(({ clock }) => {
    if (branchRef.current) {
      const t = clock.elapsedTime
      branchRef.current.rotation.x = Math.sin(t * 0.35 + index * 2.1) * 0.02
      branchRef.current.rotation.z = Math.sin(t * 0.28 + index * 1.6) * 0.015
    }
    if (leafMatRef.current) {
      const target = hovered && interactive && !activeLeaf ? 0.2 : 0
      leafMatRef.current.emissiveIntensity += (target - leafMatRef.current.emissiveIntensity) * 0.12
    }
  })

  return (
    <group ref={branchRef} position={[0, 1.2, 0]}>
      <mesh geometry={stemGeom}>
        <meshStandardMaterial color="#4a9e44" roughness={0.5} metalness={0.03} />
      </mesh>
      <group position={[tip.x, tip.y, tip.z]} rotation={[config.leafDroop, config.angle + Math.PI, 0]}>
        <mesh
          geometry={leafGeom}
          onPointerOver={(e) => { e.stopPropagation(); if (interactive && !activeLeaf) { setHovered(true); document.body.style.cursor = 'pointer' } }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto' }}
          onClick={(e) => { e.stopPropagation(); if (interactive && !activeLeaf) { setHovered(false); document.body.style.cursor = 'auto'; onLeafClick(config.label) } }}
        >
          <meshStandardMaterial ref={leafMatRef} vertexColors roughness={0.35} metalness={0.05} side={THREE.DoubleSide} emissive="#66BB6A" emissiveIntensity={0} />
        </mesh>
        {interactive && !activeLeaf && (
          <Html position={[0, 1.3, -0.5]} center distanceFactor={7}>
            <div className="leaf-label visible">{config.label}</div>
          </Html>
        )}
      </group>
    </group>
  )
}

export default function Plant({ onLeafClick, growthPhase, setGrowthPhase, activeLeaf, registerLeafPosition }) {
  useEffect(() => {
    const t = setTimeout(() => setGrowthPhase('idle'), 1000)
    return () => clearTimeout(t)
  }, [setGrowthPhase])

  return (
    <group>
      <Pot visible={true} />
      {BRANCHES.map((config, i) => (
        <Branch key={config.label} config={config} index={i} phase={growthPhase} onLeafClick={onLeafClick} activeLeaf={activeLeaf} registerLeafPosition={registerLeafPosition} />
      ))}
    </group>
  )
}
