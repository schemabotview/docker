import type { Scene } from '@graphlearning/flow'

// §8/§9 — the CI pipeline, as a chain, with the course each step came from. The point of drawing it
// rather than listing it is that the ORDER is the content: cache import before build, tests against
// a target stage, scan before push, and the digest recorded after.
export const shipIt: Scene = {
  id: 'ship-it',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'pipe',
      label: 'The pipeline — and the order is the content',
      pattern: 'group',
      icon: 'workflow',
      flow: 'TB',
      children: [
        {
          id: 'prep',
          label: 'Before the build',
          pattern: 'group',
          icon: 'key',
          flow: 'LR',
          children: [
            { id: 's1', label: 'auth with OIDC', pattern: 'service', icon: 'key', sub: 'no long-lived registry password (c9 §3)' },
            { id: 's2', label: 'import the cache', pattern: 'service', icon: 'zap', sub: '--cache-from, or the runner is cold (c5 §8)' },
          ],
          edges: [{ source: 's1', target: 's2' }],
        },
        {
          id: 'run',
          label: 'The build itself',
          pattern: 'group',
          icon: 'workflow',
          flow: 'LR',
          children: [
            { id: 's3', label: 'build --target test', pattern: 'service', icon: 'circlecheck', sub: 'tests in the build stage; it ships nothing (c5 §3)' },
            { id: 's4', label: 'build both platforms', pattern: 'service', icon: 'cpu', sub: 'cross-compiled, not emulated (c5 §7)' },
            { id: 's5', label: 'scan, then push', pattern: 'service', icon: 'search', sub: 'and --attest sbom + provenance (c9 §9)' },
          ],
          edges: [
            { source: 's3', target: 's4' },
            { source: 's4', target: 's5' },
          ],
        },
      ],
      edges: [{ source: 'prep', target: 'run' }],
    },
    {
      id: 'after',
      label: 'And the step everyone leaves out',
      pattern: 'group',
      icon: 'fingerprint',
      flow: 'LR',
      children: [
        {
          id: 'a1',
          label: 'record the digest',
          pattern: 'network',
          icon: 'fingerprint',
          sub: 'a push is not a deploy (c9 §4) — write down what shipped',
        },
        {
          id: 'a2',
          label: 'then verify it',
          pattern: 'service',
          icon: 'circlecheck',
          sub: 'inspect the RUNNING container and compare (c9 §4)',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'pipe', target: 'after' }],
}
