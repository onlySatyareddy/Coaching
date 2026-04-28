import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export const useLenis = (options = {}) => {
  const lenisRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    // Check if we're on a low-end device
    const isLowEndDevice = () => {
      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true
      }
      
      // Check for hardware concurrency (CPU cores)
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        return true
      }
      
      // Check for device memory (if available)
      if (navigator.deviceMemory && navigator.deviceMemory < 4) {
        return true
      }
      
      return false
    }

    // Disable on low-end devices
    if (isLowEndDevice()) {
      return
    }

    // Initialize Lenis with natural settings
    lenisRef.current = new Lenis({
      duration: 1.2,           // Natural scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Natural easing
      direction: 'vertical',   // Vertical scrolling
      gestureDirection: 'vertical', // Vertical gesture direction
      smooth: true,           // Enable smooth scrolling
      mouseMultiplier: 1,     // Natural mouse sensitivity
      touchMultiplier: 2,     // Slightly increased touch sensitivity for mobile
      infinite: false,        // No infinite scrolling
      autoRaf: false,         // We'll handle requestAnimationFrame manually
      ...options
    })

    // RequestAnimationFrame loop for optimal performance
    const raf = (time) => {
      lenisRef.current.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
    }
  }, [options])

  // Expose Lenis instance for external control (if needed)
  return lenisRef.current
}

// GSAP ScrollTrigger integration (optional)
export const useLenisWithScrollTrigger = (options = {}) => {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Only initialize ScrollTrigger integration if GSAP is available
    if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
      const { gsap } = window
      const { ScrollTrigger } = window

      // Update ScrollTrigger on Lenis scroll
      lenisRef.current?.on('scroll', ScrollTrigger.update)

      // Sync Lenis with ScrollTrigger
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          if (lenisRef.current) {
            return arguments.length ? lenisRef.current.scrollTo(value) : lenisRef.current.scroll
          }
          return value
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
        }
      })

      // Update Lenis on ScrollTrigger refresh
      ScrollTrigger.addEventListener('refresh', () => {
        if (lenisRef.current) {
          lenisRef.current.resize()
        }
      })

      // Initial refresh
      ScrollTrigger.refresh()
    }
  }, [options])

  return useLenis(options)
}

export default useLenis
