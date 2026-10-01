import type { Scene } from '@graphlearning/flow'

// §1 the-new-builder — what actually changed, because "BuildKit is faster" is true and useless. The
// substantive change is that the builder stopped being a loop over instructions that commits a
// container per step, and became a solver over a content-addressed graph. Everything else in this
// course — parallelism, cache mounts, secret mounts, multi-platform, remote cache — needs that.
export const legacyVsBuildkit: Scene = {
  id: 'legacy-vs-buildkit',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'What actually changed — and why the rest of this course needs it',
      sub: 'BuildKit has been the default since Docker 23; DOCKER_BUILDKIT=0 still gets you the old one',
      headers: ['', 'Legacy builder', 'BuildKit'],
      values: [
        ['Model', 'a loop over instructions', 'a solver over a graph'],
        ['Each step', 'run a container, commit a layer', 'a content-addressed cache entry'],
        ['Order', 'strictly top to bottom', 'independent branches in parallel'],
        ['Unused stages', 'built anyway', 'never built'],
        ['Context', 'the whole directory, every time', 'incremental — only what changed'],
        ['Mounts', 'none', 'cache · secret · ssh · bind'],
        ['Output', 'a local image', 'image · tar · registry · local files'],
        ['Cache', 'local, and lost with the machine', 'exportable to a registry'],
      ],
    },
    {
      id: 'note',
      label: 'The one thing to keep',
      pattern: 'warn',
      icon: 'history',
      sub: 'the old cache was a chain; BuildKit’s is a graph of hashes',
    },
  ],
  edges: [{ source: 'table', target: 'note' }],
}
