import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'
import { sentryVitePlugin } from "@sentry/vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG!,
      project: process.env.SENTRY_PROJECT!,
      authToken: process.env.SENTRY_AUTH_TOKEN!,
      reactComponentAnnotation: {
        enabled: true
      },
      sourcemaps: {
        filesToDeleteAfterUpload: ['**/*.js.map', '**/*.mjs.map'],
      }
    })
  ],
  server: {
    host: "0.0.0.0",
    port: 5336
  },
  build: {
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
