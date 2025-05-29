'use client'

import { useEffect, useState } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    console.error('Global error:', error)
    
    // Comprehensive mobile debugging
    if (typeof window !== 'undefined') {
      const info = {
        // Error details
        errorMessage: error.message,
        errorName: error.name,
        errorStack: error.stack,
        errorDigest: error.digest,
        errorToString: error.toString(),
        
        // Browser details
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        
        // Mobile detection
        isMobile: /Mobi|Android/i.test(navigator.userAgent),
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),
        isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
        isChrome: /Chrome/.test(navigator.userAgent),
        
        // Screen/viewport
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        
        // JavaScript capabilities
        localStorageAvailable: (() => {
          try {
            localStorage.setItem('test', 'test')
            localStorage.removeItem('test')
            return true
          } catch (e) {
            return false
          }
        })(),
        sessionStorageAvailable: (() => {
          try {
            sessionStorage.setItem('test', 'test')
            sessionStorage.removeItem('test')
            return true
          } catch (e) {
            return false
          }
        })(),
        
        // Date/Time APIs
        dateNowWorks: (() => {
          try {
            return typeof Date.now() === 'number'
          } catch (e) {
            return false
          }
        })(),
        newDateWorks: (() => {
          try {
            const d = new Date()
            return d instanceof Date && !isNaN(d.getTime())
          } catch (e) {
            return false
          }
        })(),
        intlWorks: (() => {
          try {
            return typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat !== 'undefined'
          } catch (e) {
            return false
          }
        })(),
        
        // Network/Fetch API
        fetchAvailable: typeof fetch !== 'undefined',
        
        // URL details
        currentURL: window.location.href,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        
        // Timing
        timestamp: new Date().toISOString(),
        performanceNow: (() => {
          try {
            return performance.now()
          } catch (e) {
            return 'unavailable'
          }
        })(),
      }
      
      setDebugInfo(info)
      
      // Log all details
      console.error('=== COMPLETE ERROR DEBUG INFO ===')
      console.error(JSON.stringify(info, null, 2))
      
      // Try to identify common mobile issues
      if (info.isMobile) {
        console.error('=== MOBILE-SPECIFIC CHECKS ===')
        if (!info.fetchAvailable) console.error('❌ Fetch API not available')
        if (!info.localStorageAvailable) console.error('❌ LocalStorage blocked')
        if (!info.sessionStorageAvailable) console.error('❌ SessionStorage blocked')
        if (!info.dateNowWorks) console.error('❌ Date.now() not working')
        if (!info.newDateWorks) console.error('❌ new Date() not working')
        if (!info.intlWorks) console.error('❌ Intl API not working')
      }
    }
  }, [error])

  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-screen overflow-auto">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              {isMobile ? 'Mobile Browser Error' : 'Application Error'}
            </h2>
            <p className="text-gray-600 mb-4">
              {isMobile 
                ? 'This error appears to be mobile-specific. Detailed debugging information is shown below.'
                : 'Something went wrong on the client side.'
              }
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-sm font-mono text-red-800 break-words">
                <strong>Error:</strong> {error.message}
              </p>
              
              {process.env.NODE_ENV === 'development' && debugInfo.errorStack && (
                <pre className="text-xs text-red-700 mt-2 overflow-auto max-h-32">
                  {debugInfo.errorStack}
                </pre>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && Object.keys(debugInfo).length > 0 && (
              <details className="mb-4">
                <summary className="text-sm font-semibold text-gray-700 cursor-pointer">
                  🔍 Complete Debug Information (Click to expand)
                </summary>
                <div className="mt-2 bg-gray-50 border rounded p-3">
                  <pre className="text-xs text-gray-800 overflow-auto max-h-96">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              </details>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
              >
                Reload page
              </button>
              <button
                onClick={() => {
                  const info = JSON.stringify(debugInfo, null, 2)
                  navigator.clipboard?.writeText(info)
                    .then(() => alert('Debug info copied to clipboard!'))
                    .catch(() => alert('Failed to copy. Please manually copy from the expanded section above.'))
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
              >
                Copy Debug Info
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 