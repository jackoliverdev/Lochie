'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
    
    // Log mobile-specific information
    if (typeof window !== 'undefined') {
      console.error('User agent:', navigator.userAgent)
      console.error('Is mobile:', /Mobi|Android/i.test(navigator.userAgent))
      console.error('Screen size:', window.innerWidth + 'x' + window.innerHeight)
    }
  }, [error])

  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              {isMobile ? 'Mobile Browser Error' : 'Application Error'}
            </h2>
            <p className="text-gray-600 mb-4">
              {isMobile 
                ? 'This error appears to be mobile-specific. Please try refreshing or using a different browser.'
                : 'Something went wrong on the client side.'
              }
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-sm font-mono text-red-800 break-words">
                  {error.message}
                </p>
                {error.stack && (
                  <pre className="text-xs text-red-700 mt-2 overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                )}
                {isMobile && (
                  <p className="text-xs text-red-600 mt-2">
                    Common mobile issues: Firebase Analytics blocked, strict privacy settings, or hydration mismatches.
                  </p>
                )}
              </div>
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
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 