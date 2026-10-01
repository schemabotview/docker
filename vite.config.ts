import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The render engine is the @graphlearning/flow package, not a local folder. `dedupe` is what keeps
// a single copy of react / react-dom / @xyflow/react across this app and the package — the gotcha
// that bites when two React copies meet (invalid-hook-call). The package declares them as peer deps
// and externalises them, so it never carries its own React; dedupe is the belt to that braces.
//
// `base` is `/docker/` for the production BUILD only (the app deploys under graphl.in/docker/ as a
// concept app in the GraphL catalog — matching the repo name schemabotview/docker — so built asset
// URLs must be subpath-relative). Dev/serve stays at `/` so `npm run dev` and the capture/record
// scripts (which drive the dev server at localhost:5173/#/<id>) are unaffected.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/docker/' : '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', '@xyflow/react'],
  },
  server: { port: 5173 },
}))
