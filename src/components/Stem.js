'use client'

import * as THREE from 'three'

// Bird of Paradise stem configurations - fanning outward
export const STEM_CONFIGS = [
  { angle: -0.6, tilt: 0.35, peak: 3.6, label: 'career' },
  { angle: 0.5, tilt: 0.3, peak: 4.0, label: 'blog' },
  { angle: -1.8, tilt: 0.4, peak: 3.3, label: 'contact' },
  { angle: 2.0, tilt: 0.35, peak: 3.8, label: 'socials' },
]

export function makeStemCurve(index) {
  const { angle, tilt, peak } = STEM_CONFIGS[index]
  const dx = Math.sin(angle) * tilt
  const dz = Math.cos(angle) * tilt
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.2, 0),
    new THREE.Vector3(dx * 0.3, 1.9, dz * 0.3),
    new THREE.Vector3(dx * 0.7, 2.8, dz * 0.7),
    new THREE.Vector3(dx * 1.2, peak - 0.3, dz * 1.2),
    new THREE.Vector3(dx * 1.5, peak, dz * 1.5),
  ])
}

export function makeStemGeometry(index) {
  const curve = makeStemCurve(index)
  // Thicker stems that taper slightly toward the top
  const radiusFunc = (t) => 0.06 * (1 - t * 0.4)
  const frames = curve.computeFrenetFrames(64, false)
  const vertices = []
  const normals = []
  const uvs = []
  const indices = []
  const tubularSegments = 64
  const radialSegments = 8

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments
    const pos = curve.getPointAt(t)
    const N = frames.normals[i]
    const B = frames.binormals[i]
    const radius = radiusFunc(t)

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2
      const sin = Math.sin(v)
      const cos = Math.cos(v)

      const nx = cos * N.x + sin * B.x
      const ny = cos * N.y + sin * B.y
      const nz = cos * N.z + sin * B.z

      vertices.push(
        pos.x + radius * nx,
        pos.y + radius * ny,
        pos.z + radius * nz
      )
      normals.push(nx, ny, nz)
      uvs.push(j / radialSegments, t)
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j
      const b = a + 1
      const c = (i + 1) * (radialSegments + 1) + j
      const d = c + 1
      indices.push(a, b, c)
      indices.push(b, d, c)
    }
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geom.setIndex(indices)
  return geom
}
