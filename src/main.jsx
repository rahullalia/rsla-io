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
 * Always auto-recovers silently from transient errors (GSAP unmount,
 * Safari import quirks, motion library cleanup). Never shows error UI
 * unless the app is in a genuine crash loop (3+ errors within 3 seconds).
 *
 * Key design: NO window.location.reload(). Reload is async — JS keeps
 * running after the call, giving React time to process a second error
 * and flash the error UI before the reload takes effect.
 */
class ResilientErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, permanent: false }
    this._errorTimestamps = []
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const msg = error?.message || ''

    // Diagnostic — remove after debugging
    console.warn('[ErrorBoundary]', msg, error)

    // Kill stale GSAP ScrollTriggers on any DOM-related error
    if (msg.includes('removeChild') || msg.includes('insertBefore') || msg.includes('appendChild')) {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }

    // Report to Sentry (non-blocking)
    import('@sentry/react').then(Sentry => {
      Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo?.componentStack } } })
    }).catch(() => {})

    // Track error frequency — only show error UI for genuine crash loops
    const now = Date.now()
    this._errorTimestamps.push(now)
    // Keep only errors from the last 3 seconds
    this._errorTimestamps = this._errorTimestamps.filter(t => now - t < 3000)

    if (this._errorTimestamps.length >= 3) {
      // 3+ errors in 3 seconds = genuinely broken, show error UI
      this.setState({ permanent: true })
    } else {
      // Transient error (navigation, unmount, Safari quirk) — recover silently
      setTimeout(() => this.setState({ hasError: false, permanent: false }), 0)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.state.permanent) {
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
      // Transient error — render nothing briefly while auto-recovering
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

