import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.jsx'

// Defer Sentry init — not needed for first paint
if (import.meta.env.PROD) {
  const ric = typeof requestIdleCallback === 'function' ? requestIdleCallback : (cb) => setTimeout(cb, 1)
  ric(() => import('./sentry'), { timeout: 3000 })
}

/**
 * ResilientErrorBoundary
 *
 * Handles three categories of runtime errors:
 *
 * 1. DOM desync (GSAP ScrollTrigger pin cleanup during route changes)
 *    → Auto-recover silently, kill ScrollTriggers
 *
 * 2. Chunk loading failures (lazy import network errors after retries exhausted)
 *    → Force page reload to get fresh chunk references
 *
 * 3. Everything else (real application errors)
 *    → Report to Sentry, show retry UI instead of permanent blank page
 */
// Shared chunk error detection — used in both getDerivedStateFromError and componentDidCatch
function isChunkLoadError(error) {
  const msg = error?.message || ''
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Loading chunk') ||
    msg.includes('Loading CSS chunk') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('The object can not be found here') ||
    msg.includes('Importing a module script failed') ||
    error?.name === 'ChunkLoadError'
  )
}

class ResilientErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorType: null }
  }

  static getDerivedStateFromError(error) {
    // Classify error during render phase so we can skip showing error UI
    // for recoverable errors (chunk loads, DOM desync)
    if (isChunkLoadError(error)) {
      return { hasError: true, errorType: 'chunk' }
    }
    const msg = error?.message || ''
    if (msg.includes('removeChild') || msg.includes('insertBefore') || msg.includes('appendChild')) {
      return { hasError: true, errorType: 'desync' }
    }
    return { hasError: true, errorType: 'app' }
  }

  componentDidCatch(error, errorInfo) {
    const { errorType } = this.state

    if (errorType === 'desync') {
      console.warn('[ErrorBoundary] DOM desync, auto-recovering.', error?.message)
      ScrollTrigger.getAll().forEach(st => st.kill())
      setTimeout(() => this.setState({ hasError: false, errorType: null }), 0)
    } else if (errorType === 'chunk') {
      console.warn('[ErrorBoundary] Chunk load failure, reloading.', error?.message)
      const key = 'chunkError_reloaded'
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1')
        window.location.reload()
      } else {
        this.setState({ errorType: 'app' })
      }
    } else {
      import('@sentry/react').then(Sentry => {
        Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo?.componentStack } } })
      }).catch(() => {})
    }
  }

  render() {
    if (this.state.hasError) {
      // Only show error UI for real app errors — chunk and desync errors
      // recover silently (no flash)
      if (this.state.errorType === 'app') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#0F172A', padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '16px' }}>Something went wrong loading this page.</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '12px 24px', background: '#0066E0', color: '#fff', border: 'none', borderRadius: '9999px', fontSize: '0.875rem', cursor: 'pointer' }}
            >
              Refresh Page
            </button>
          </div>
        )
      }
      // Chunk errors and DOM desync: render nothing while recovering
      return null
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResilientErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ResilientErrorBoundary>
  </StrictMode>,
)

