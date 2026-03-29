'use client'

import { useEffect, useState } from 'react'
import CareerContent from '@/content/CareerContent'
import BlogContent from '@/content/BlogContent'
import ContactContent from '@/content/ContactContent'
import SocialsContent from '@/content/SocialsContent'

const CONTENT_MAP = {
  career: CareerContent,
  blog: BlogContent,
  contact: ContactContent,
  socials: SocialsContent,
}

export default function ContentOverlay({ activeLeaf, visible }) {
  const [animateItems, setAnimateItems] = useState(false)

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setAnimateItems(true), 200)
      return () => clearTimeout(timer)
    } else {
      setAnimateItems(false)
    }
  }, [visible])

  const ContentComponent = activeLeaf ? CONTENT_MAP[activeLeaf] : null

  return (
    <div className={`content-overlay ${visible ? 'visible' : ''}`}>
      <div className="content-inner">
        {ContentComponent && <ContentComponent animate={animateItems} />}
      </div>
    </div>
  )
}
