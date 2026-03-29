'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const DEFAULT_POS = new THREE.Vector3(0, 3, 7)
const DEFAULT_TARGET = new THREE.Vector3(0, 2.2, 0)
const LERP_SPEED = 0.03

export default function CameraController({ activeLeaf, leafPositions, onZoomComplete }) {
  const { camera } = useThree()
  const currentTarget = useRef(new THREE.Vector3().copy(DEFAULT_TARGET))
  const goalPos = useRef(new THREE.Vector3().copy(DEFAULT_POS))
  const goalTarget = useRef(new THREE.Vector3().copy(DEFAULT_TARGET))
  const zoomDone = useRef(false)
  const isZooming = useRef(false)

  useEffect(() => {
    if (activeLeaf && leafPositions.current[activeLeaf]) {
      const { position, normal } = leafPositions.current[activeLeaf]
      goalPos.current.set(
        position.x + normal.x * 2.0,
        position.y + normal.y * 2.0,
        position.z + normal.z * 2.0
      )
      goalTarget.current.copy(position)
      zoomDone.current = false
      isZooming.current = true
    } else if (!activeLeaf) {
      goalPos.current.copy(DEFAULT_POS)
      goalTarget.current.copy(DEFAULT_TARGET)
      zoomDone.current = false
      isZooming.current = true
    }
  }, [activeLeaf, leafPositions])

  useFrame(() => {
    if (!isZooming.current) return

    camera.position.lerp(goalPos.current, LERP_SPEED)
    currentTarget.current.lerp(goalTarget.current, LERP_SPEED)
    camera.lookAt(currentTarget.current)

    const dist = camera.position.distanceTo(goalPos.current)
    if (dist < 0.05 && !zoomDone.current) {
      zoomDone.current = true
      if (activeLeaf) {
        onZoomComplete?.()
      } else {
        isZooming.current = false
      }
    }
  })

  return null
}
