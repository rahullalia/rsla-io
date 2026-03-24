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
 * 1. DOM desync (GSAP pin cleanup) → auto-recover silently
 * 2. Everything else → reload once, show error UI only if it persists
 */
class ResilientErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, permanent: false }
    this._reloadAttempted = false
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const msg = error?.message || ''

    // DOM desync from GSAP — auto-recover silently
    if (msg.includes('removeChild') || msg.includes('insertBefore') || msg.includes('appendChild')) {
      ScrollTrigger.getAll().forEach(st => st.kill())
      setTimeout(() => this.setState({ hasError: false, permanent: false }), 0)
      return
    }

    // Report to Sentry
    import('@sentry/react').then(Sentry => {
      Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo?.componentStack } } })
    }).catch(() => {})

    // Try one reload — if already tried, show error UI
    if (!this._reloadAttempted) {
      this._reloadAttempted = true
      window.location.reload()
    } else {
      this.setState({ permanent: true })
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

