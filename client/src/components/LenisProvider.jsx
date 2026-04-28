import React, { useEffect, useRef } from 'react'
import { useLenis } from '../hooks/useLenis'

const LenisProvider = ({ children }) => {
  // Initialize Lenis with optimal settings
  const lenis = useLenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    touchMultiplier: 2,
    wheelMultiplier: 1,
    touchInertiaMultiplier: 35,
    normalizeWheel: true,
    autoRaf: false
  })

  // Expose Lenis instance globally for helper functions
  useEffect(() => {
    if (lenis) {
      window.lenis = lenis
      return () => {
        delete window.lenis
      }
    }
  }, [lenis])

  // Handle scroll-to-anchor links smoothly
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target && lenis) {
          lenis.scrollTo(target, {
            offset: -80, // Account for fixed headers
            duration: 1.2
          })
        }
      }
    }

    // Add click listeners to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick)
    })

    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick)
      })
    }
  }, [lenis])

  return <>{children}</>
}

export default LenisProvider
