'use client'

import { ReactNode, useEffect, useState, Component, ErrorInfo } from 'react'

interface ClientWrapperProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

// Enhanced Error Boundary that captures all errors
class MobileErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('=== ERROR BOUNDARY CAUGHT ERROR ===')
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    
    // Mobile-specific error analysis
    if (typeof window !== 'undefined') {
      const isMobile = /Mobi|Android/i.test(navigator.userAgent)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
      
      console.error('=== MOBILE ERROR ANALYSIS ===')
      console.error('Is Mobile:', isMobile)
      console.error('Is iOS:', isIOS)
      console.error('Is Safari:', isSafari)
      console.error('User Agent:', navigator.userAgent)
      console.error('Component Stack:', errorInfo.componentStack)
      
      // Check for common mobile issues
      if (error.message.includes('ResizeObserver')) {
        console.error('❌ ResizeObserver error detected - common on mobile Safari')
      }
      if (error.message.includes('Intl')) {
        console.error('❌ Internationalization API error - common on older mobile browsers')
      }
      if (error.message.includes('Date')) {
        console.error('❌ Date API error - could be timezone or locale related on mobile')
      }
      if (error.message.includes('fetch')) {
        console.error('❌ Fetch API error - might be network or CORS related on mobile')
      }
      if (error.message.includes('localStorage') || error.message.includes('sessionStorage')) {
        console.error('❌ Storage API error - likely blocked in private browsing mode')
      }
      if (error.message.includes('analytics') || error.message.includes('gtag')) {
        console.error('❌ Analytics error - likely blocked by privacy settings')
      }
    }
    
    this.setState({ hasError: true, error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // Trigger the global error handler
      throw this.state.error
    }

    return this.props.children
  }
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const [browserInfo, setBrowserInfo] = useState<any>({})

  useEffect(() => {
    // Comprehensive browser detection and capability testing
    const detectBrowserCapabilities = async () => {
      if (typeof window === 'undefined') return

      const info = {
        userAgent: navigator.userAgent,
        isMobile: /Mobi|Android/i.test(navigator.userAgent),
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),
        isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
        isChrome: /Chrome/.test(navigator.userAgent),
        isFirefox: /Firefox/.test(navigator.userAgent),
        
        // API availability
        capabilities: {
          fetch: typeof fetch !== 'undefined',
          localStorage: (() => {
            try {
              localStorage.setItem('test', 'test')
              localStorage.removeItem('test')
              return true
            } catch (e) {
              return false
            }
          })(),
          sessionStorage: (() => {
            try {
              sessionStorage.setItem('test', 'test')
              sessionStorage.removeItem('test')
              return true
            } catch (e) {
              return false
            }
          })(),
          intl: typeof Intl !== 'undefined',
          resizeObserver: typeof ResizeObserver !== 'undefined',
          intersectionObserver: typeof IntersectionObserver !== 'undefined',
          webGL: (() => {
            try {
              const canvas = document.createElement('canvas')
              return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
            } catch (e) {
              return false
            }
          })(),
          webGL2: (() => {
            try {
              const canvas = document.createElement('canvas')
              return !!canvas.getContext('webgl2')
            } catch (e) {
              return false
            }
          })(),
          serviceWorker: 'serviceWorker' in navigator,
          pushNotifications: 'Notification' in window,
          geolocation: 'geolocation' in navigator,
          deviceMotion: 'DeviceMotionEvent' in window,
          deviceOrientation: 'DeviceOrientationEvent' in window,
        },
        
        performance: {
          memory: (performance as any)?.memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          } : null,
          timing: performance.timing ? {
            navigationStart: performance.timing.navigationStart,
            loadEventEnd: performance.timing.loadEventEnd,
            domContentLoadedEventEnd: performance.timing.domContentLoadedEventEnd,
          } : null,
        }
      }

      setBrowserInfo(info)
      
      console.log('=== BROWSER CAPABILITY DETECTION ===')
      console.log('Info:', info)
      
      // Warn about potential issues
      if (info.isMobile && !info.capabilities.localStorage) {
        console.warn('⚠️ LocalStorage not available - likely in private browsing mode')
      }
      if (info.isMobile && !info.capabilities.intersectionObserver) {
        console.warn('⚠️ IntersectionObserver not available - animations may not work')
      }
      if (info.isIOS && info.isSafari) {
        console.warn('⚠️ iOS Safari detected - some features may be limited')
      }
    }

    detectBrowserCapabilities()
    setHasMounted(true)
  }, [])

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('=== UNHANDLED PROMISE REJECTION ===')
      console.error('Reason:', event.reason)
      console.error('Promise:', event.promise)
      console.error('Browser Info:', browserInfo)
      
      // Don't prevent default - let the error bubble up
      // event.preventDefault()
    }

    const handleError = (event: ErrorEvent) => {
      console.error('=== GLOBAL ERROR EVENT ===')
      console.error('Message:', event.message)
      console.error('Filename:', event.filename)
      console.error('Line:', event.lineno)
      console.error('Column:', event.colno)
      console.error('Error:', event.error)
      console.error('Browser Info:', browserInfo)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [browserInfo])

  // Prevent hydration mismatches on mobile
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <MobileErrorBoundary>
      {children}
    </MobileErrorBoundary>
  )
} 