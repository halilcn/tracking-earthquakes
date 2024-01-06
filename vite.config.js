import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin('all'),
    sentryVitePlugin({
      org: 'halilcan',
      project: 'tracking-earthquakes',
    }),
  ],

  build: {
    sourcemap: true,
  },
})
