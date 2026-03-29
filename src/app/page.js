'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import ContentOverlay from '@/components/ContentOverlay'

const PlantScene = dynamic(() => import('@/components/PlantScene'), { ssr: false })

export default function Home() {
  const [activeLeaf, setActiveLeaf] = useState(null)
  const [showContent, setShowContent] = useState(false)
  const [zoomComplete, setZoomComplete] = useState(false)

  const handleLeafClick = useCallback((label) => {
    setActiveLeaf(label)
  }, [])

  const handleZoomComplete = useCallback(() => {
    setZoomComplete(true)
    setShowContent(true)
  }, [])

  const handleBack = useCallback(() => {
    setShowContent(false)
    setZoomComplete(false)
    setTimeout(() => {
      setActiveLeaf(null)
    }, 400)
  }, [])

  return (
    <main style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <PlantScene
        activeLeaf={activeLeaf}
        onLeafClick={handleLeafClick}
        onZoomComplete={handleZoomComplete}
        zoomingOut={!showContent && zoomComplete === false && activeLeaf === null}
      />
      <button
        className={`back-button ${showContent ? 'visible' : ''}`}
        onClick={handleBack}
      >
        &larr; Back
      </button>
      <ContentOverlay activeLeaf={activeLeaf} visible={showContent} />
    </main>
  )
}
