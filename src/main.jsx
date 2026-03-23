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
    this.state = { hasError: false, showErrorUI: false }
  }

  static getDerivedStateFromError() {
    // Never show error UI immediately — always try to auto-recover first.
    // componentDidCatch will either recover silently or escalate to showErrorUI.
    return { hasError: true, showErrorUI: false }
  }

  componentDidCatch(error, errorInfo) {
    const msg = error?.message || ''

    const isDomDesync =
      msg.includes('removeChild') ||
      msg.includes('insertBefore') ||
      msg.includes('appendChild')

    if (isDomDesync) {
      console.warn('[ErrorBoundary] DOM desync, auto-recovering.', msg)
      ScrollTrigger.getAll().forEach(st => st.kill())
      setTimeout(() => this.setState({ hasError: false, showErrorUI: false }), 0)
      return
    }

    // For ALL other errors: try a one-time reload to recover (handles stale
    // chunks, Safari import errors, and transient rendering issues).
    // Only show error UI if reload was already attempted.
    const key = 'errorBoundary_reloaded'
    if (!sessionStorage.getItem(key)) {
      console.warn('[ErrorBoundary] Error during navigation, reloading.', msg)
      sessionStorage.setItem(key, '1')
      window.location.reload()
      return
    }

    // Reload already attempted — show error UI as last resort
    console.error('[ErrorBoundary] Persistent error after reload.', msg)
    sessionStorage.removeItem(key)
    this.setState({ showErrorUI: true })
    import('@sentry/react').then(Sentry => {
      Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo?.componentStack } } })
    }).catch(() => {})
  }

  render() {
    if (this.state.hasError) {
      if (this.state.showErrorUI) {
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
      // Auto-recovering — render nothing (no flash)
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

