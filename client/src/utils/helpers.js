import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function to combine Tailwind classes
export const cn = (...inputs) => {
  return twMerge(clsx(inputs))
}

// Format price with currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price)
}

// Format date
export const formatDate = (date, options = {}) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(new Date(date))
}

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Generate slug from text
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Calculate reading time
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Indian)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth <= 768
}

// Check if device supports 3D animations
export const supports3D = () => {
  return !isMobile() && window.innerWidth > 1024
}

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Generate random color
export const generateRandomColor = () => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

// Animate number
export const animateNumber = (element, start, end, duration) => {
  const startTime = performance.now()
  
  const updateNumber = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const current = Math.floor(start + (end - start) * progress)
    element.textContent = current.toLocaleString()
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    }
  }
  
  requestAnimationFrame(updateNumber)
}

// Smooth scroll to element using Lenis (if available) or native scroll
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId)
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset
    
    // Use Lenis if available, otherwise fall back to native scroll
    if (window.lenis) {
      window.lenis.scrollTo(y, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}

// Get query parameter from URL
export const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

// Set query parameter in URL
export const setQueryParam = (param, value) => {
  const url = new URL(window.location)
  url.searchParams.set(param, value)
  window.history.pushState({}, '', url)
}

// Remove query parameter from URL
export const removeQueryParam = (param) => {
  const url = new URL(window.location)
  url.searchParams.delete(param)
  window.history.pushState({}, '', url)
}

// Smooth scroll to top
export const scrollToTop = () => {
  if (window.lenis) {
    window.lenis.scrollTo(0, {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
