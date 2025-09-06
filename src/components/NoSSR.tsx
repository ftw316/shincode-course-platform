'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

function NoSSRComponent({ children, fallback = null }: NoSSRProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Add a small delay to ensure browser extensions have finished modifying the DOM
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Export as a dynamic component with no SSR
export default dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
  loading: () => null
})