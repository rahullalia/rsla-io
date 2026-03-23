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
class ResilientErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorType: null, errorMsg: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || 'Unknown error' }
  }

  componentDidCatch(error, errorInfo) {
    const msg = error?.message || ''

    const isDomDesync =
      msg.includes('removeChild') ||
      msg.includes('insertBefore') ||
      msg.includes('appendChild')

    const isChunkError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Loading chunk') ||
      msg.includes('Loading CSS chunk') ||
      msg.includes('error loading dynamically imported module') ||
      error?.name === 'ChunkLoadError'

    if (isDomDesync) {
      console.warn('[ErrorBoundary] DOM desync during transition, auto-recovering.', msg)
      ScrollTrigger.getAll().forEach(st => st.kill())
      setTimeout(() => this.setState({ hasError: false, errorType: null, errorMsg: null }), 0)
    } else if (isChunkError) {
      console.warn('[ErrorBoundary] Chunk load failure, reloading page.', msg)
      window.location.reload()
    } else {
      this.setState({ errorType: 'app', errorMsg: msg })
      import('@sentry/react').then(Sentry => {
        Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo?.componentStack } } })
      }).catch(() => {})
    }
  }

  render() {
    if (this.state.hasError) {
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
            {this.state.errorMsg && (
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '24px', maxWidth: '300px', wordBreak: 'break-word' }}>
                Debug: {this.state.errorMsg}
              </p>
            )}
          </div>
        )
      }
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

