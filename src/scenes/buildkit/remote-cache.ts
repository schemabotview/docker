import type { Scene } from '@graphlearning/flow'

// §8 remote-cache — the fix for the thing that makes CI builds slow for a reason nobody mentions:
// the runner is a fresh machine, so the local build cache is empty, every time. Exporting the cache
// to a registry and importing it at the start of the next build turns a cold CI builder into a warm
// one. The mode=max detail matters: the default exports only the final stage's layers, which on a
// multi-stage build is precisely the layers that were not expensive.
export const remoteCache: Scene = {
  id: 'remote-cache',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'The problem: a CI runner is a fresh machine every time',
      pattern: 'group',
      icon: 'warn',
      flow: 'LR',
      children: [
        { id: 'p1', label: 'new runner, empty cache', pattern: 'warn', icon: 'circleslash', sub: 'every layer rebuilds — every single time' },
        { id: 'p2', label: 'so the ordering work', pattern: 'warn', icon: 'ban', sub: 'course 4 §11 bought you nothing in CI' },
      ],
      edges: [],
    },
    {
      id: 'fix',
      label: 'Push the cache somewhere the next runner can reach',
      pattern: 'group',
      icon: 'warehouse',
      flow: 'LR',
      children: [
        {
          id: 'to',
          label: '--cache-to',
          pattern: 'service',
          icon: 'cloud',
          sub: 'type=registry, ref=acme/api:cache, mode=max',
        },
        {
          id: 'reg',
          label: 'a registry tag',
          pattern: 'storage',
          icon: 'warehouse',
          sub: 'just blobs — any registry, alongside your image',
        },
        {
          id: 'from',
          label: '--cache-from',
          pattern: 'service',
          icon: 'zap',
          sub: 'the next build imports it and hits like a warm machine',
        },
      ],
      edges: [
        { source: 'to', target: 'reg' },
        { source: 'reg', target: 'from' },
      ],
    },
    {
      id: 'detail',
      label: 'mode=max is not optional on a multi-stage build',
      pattern: 'group',
      icon: 'search',
      flow: 'LR',
      children: [
        { id: 'd1', label: 'mode=min (the default)', pattern: 'warn', icon: 'funnel', sub: 'only the FINAL stage — not the expensive ones' },
        { id: 'd2', label: 'mode=max', pattern: 'service', icon: 'layers', sub: 'every intermediate stage; bigger, and it works' },
        { id: 'd3', label: 'gha · s3 · local', pattern: 'network', icon: 'boxes', sub: 'other backends where a registry is awkward' },
      ],
      edges: [],
    },
  ],
  edges: [
    { source: 'problem', target: 'fix' },
    { source: 'fix', target: 'detail' },
  ],
}
