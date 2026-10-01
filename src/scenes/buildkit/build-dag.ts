import type { Scene } from '@graphlearning/flow'

// §2 the-build-dag (reused by §10 you-are-here) — the SPINE. The legacy builder walked a LIST;
// BuildKit solves a GRAPH. Two consequences that people feel immediately: independent branches
// build at the same time, and a stage nothing depends on is never built at all. The third is the
// one that changes how you write Dockerfiles: a cache miss in one branch does not invalidate the
// other, because they are no longer above and below each other — they are beside each other.
export const buildDag: Scene = {
  id: 'build-dag',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'graph',
      label: 'One Dockerfile, three stages — the graph BuildKit actually solves',
      pattern: 'group',
      icon: 'workflow',
      flow: 'LR',
      children: [
        {
          id: 'deps',
          label: 'FROM node AS deps',
          pattern: 'service',
          icon: 'boxes',
          sub: 'npm ci — 90 s, and nothing else waits on it',
        },
        {
          id: 'assets',
          label: 'FROM node AS assets',
          pattern: 'service',
          icon: 'pencil',
          sub: 'builds the CSS — 20 s, AT THE SAME TIME as deps',
        },
        {
          id: 'final',
          label: 'FROM node-slim',
          pattern: 'storage',
          icon: 'package',
          sub: 'COPY --from=deps · COPY --from=assets',
        },
      ],
      edges: [
        { source: 'deps', target: 'final' },
        { source: 'assets', target: 'final' },
      ],
    },
    {
      id: 'unused',
      label: 'FROM node AS test',
      pattern: 'external',
      icon: 'circleslash',
      sub: 'nothing COPYs from it — so it is never built at all',
    },
    {
      id: 'gains',
      label: 'What the graph buys that a list could not',
      pattern: 'group',
      icon: 'zap',
      flow: 'LR',
      children: [
        { id: 'p1', label: 'branches run in parallel', pattern: 'service', icon: 'share', sub: '110 s of work finishes in 90' },
        { id: 'p2', label: 'dead stages are skipped', pattern: 'service', icon: 'funnel', sub: 'only what the target needs is built' },
        { id: 'p3', label: 'no sideways cascade', pattern: 'service', icon: 'circlecheck', sub: 'editing the CSS leaves npm ci cached' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'graph', target: 'gains' }],
}
