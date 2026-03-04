import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './sentry'
import './index.css'
import App from './App.jsx'

import * as Sentry from '@sentry/react'

/**
 * ResilientErrorBoundary
 *
 * GSAP ScrollTrigger's `pin: true` rearranges DOM nodes during scroll.
 * When React unmounts a pinned section during route changes,
 * its reconciler can throw: "Failed to execute 'removeChild' on 'Node': 
 * The node to be removed is not a child of this node."
 *
 * This error is cosmetic — the user is navigating away anyway.
 * This boundary catches it and auto-recovers instead of showing a crash screen.
 */
class ResilientErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const isDomDesync =
      error?.message?.includes('removeChild') ||
      error?.message?.includes('insertBefore') ||
      error?.message?.includes('appendChild')

    if (isDomDesync) {
      // Harmless DOM desync from GSAP pin cleanup — auto-recover
      console.warn('[ResilientErrorBoundary] Caught DOM desync during transition, auto-recovering.', error.message)
      // Kill all remaining ScrollTriggers to prevent cascading issues
      ScrollTrigger.getAll().forEach(st => st.kill())
      // Reset state on next tick so the app re-renders cleanly
      setTimeout(() => this.setState({ hasError: false }), 0)
    } else {
      // A real error — report to Sentry
      Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo?.componentStack } } })
    }
  }

  render() {
    if (this.state.hasError) {
      // Show nothing briefly while auto-recovering (not the crash screen)
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

