import type { Scene } from '@graphlearning/flow'

// §3 multi-stage — the single biggest size win available, and the mechanism is just `COPY --from`.
// The build stage has the compiler, the headers, the dev dependencies and the source; the runtime
// stage has the artifact and nothing else. What does NOT cross the boundary is the whole point:
// none of the build stage's layers are in the final image, so nothing it downloaded, unpacked or
// leaked is shipped.
export const multiStage: Scene = {
  id: 'multi-stage',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'stages',
      label: 'Two stages in one Dockerfile — only one of them ships',
      pattern: 'group',
      icon: 'merge',
      flow: 'LR',
      children: [
        {
          id: 'builder',
          label: 'FROM node:20 AS build',
          pattern: 'group',
          icon: 'gears',
          flow: 'TB',
          children: [
            { id: 'bd1', label: 'gcc, make, headers', pattern: 'warn', icon: 'wrench', sub: '~900 MB of toolchain' },
            { id: 'bd2', label: 'dev dependencies', pattern: 'warn', icon: 'boxes', sub: 'test runners, linters, type definitions' },
            { id: 'bd3', label: 'your source', pattern: 'network', icon: 'filecode', sub: 'and any token the build needed' },
            { id: 'bd4', label: 'dist/', pattern: 'storage', icon: 'package', sub: 'the only thing worth keeping — 4 MB' },
          ],
          edges: [
            { source: 'bd1', target: 'bd2' },
            { source: 'bd2', target: 'bd3' },
            { source: 'bd3', target: 'bd4' },
          ],
        },
        {
          id: 'runtime',
          label: 'FROM node:20-slim AS run',
          pattern: 'group',
          icon: 'package',
          flow: 'TB',
          children: [
            { id: 'r1', label: 'COPY --from=build dist/', pattern: 'service', icon: 'copy', sub: 'files only — not the layer it came from' },
            { id: 'r2', label: 'production deps only', pattern: 'service', icon: 'boxes', sub: 'npm ci --omit=dev' },
            { id: 'r3', label: 'USER 10001', pattern: 'service', icon: 'usercheck', sub: 'and nothing to compile with' },
          ],
          edges: [
            { source: 'r1', target: 'r2' },
            { source: 'r2', target: 'r3' },
          ],
        },
      ],
      edges: [{ source: 'builder', target: 'runtime', label: 'COPY --from — files cross, layers do not' }],
    },
    {
      id: 'result',
      label: '1.2 GB → 180 MB, and the toolchain is not in the image',
      pattern: 'group',
      icon: 'ruler',
      flow: 'LR',
      children: [
        { id: 'z1', label: '--target build', pattern: 'network', icon: 'funnel', sub: 'stop at a named stage — a debug image, free' },
        { id: 'z2', label: 'FROM build AS test', pattern: 'network', icon: 'circlecheck', sub: 'tests reuse the build stage, ship nothing' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'stages', target: 'result' }],
}
