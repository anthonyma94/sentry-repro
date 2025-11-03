import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import type { Router } from '../../api/src/trpc';

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { init, replayIntegration, tanstackRouterBrowserTracingIntegration } from '@sentry/react';

const trpc = createTRPCClient<Router>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_TRPC_URL!
    })
  ]
})

export type RouterContext = {
  trpc: typeof trpc
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    trpc
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
  normalizeDepth: 50,
  integrations: [
    replayIntegration({
      blockAllMedia: false,
      maskAllText: false
    }),
    tanstackRouterBrowserTracingIntegration(router)
  ]
})


// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
