import type { Scene } from '@graphlearning/flow'

// §2–§3 — the single most useful piece of Docker networking knowledge, and it is a difference
// between two things that look identical. The DEFAULT bridge has no DNS: containers on it can only
// reach each other by IP, which is useless because the IP changes on every recreate. A USER-DEFINED
// bridge runs an embedded resolver at 127.0.0.11 that resolves container NAMES. That is the whole
// reason `docker network create` exists, and why Compose makes one for you without asking.
export const bridgeDns: Scene = {
  id: 'bridge-dns',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'compare',
      label: 'Two bridges that look the same and behave differently',
      pattern: 'group',
      icon: 'scale',
      flow: 'LR',
      children: [
        {
          id: 'def',
          label: 'docker0 — the default bridge',
          pattern: 'group',
          icon: 'ban',
          flow: 'TB',
          children: [
            { id: 'd1', label: 'every container, by default', pattern: 'warn', icon: 'boxes', sub: 'no isolation between unrelated containers' },
            { id: 'd2', label: 'NO DNS', pattern: 'warn', icon: 'circleslash', sub: 'ping api → does not resolve. IP only.' },
            { id: 'd3', label: 'and the IP moves', pattern: 'warn', icon: 'swap', sub: 'recreate the container, get a different address' },
          ],
          edges: [
            { source: 'd1', target: 'd2' },
            { source: 'd2', target: 'd3' },
          ],
        },
        {
          id: 'user',
          label: 'docker network create appnet',
          pattern: 'group',
          icon: 'circlecheck',
          flow: 'TB',
          children: [
            { id: 'u1', label: 'only what you attach', pattern: 'service', icon: 'funnel', sub: 'a real isolation boundary between stacks' },
            { id: 'u2', label: 'embedded DNS', pattern: 'service', icon: 'search', sub: '127.0.0.11 resolves container names and aliases' },
            { id: 'u3', label: 'so the name is stable', pattern: 'service', icon: 'tag', sub: 'http://api:8080 keeps working across recreates' },
          ],
          edges: [
            { source: 'u1', target: 'u2' },
            { source: 'u2', target: 'u3' },
          ],
        },
      ],
      edges: [],
    },
    {
      id: 'why',
      label: 'So: always make one',
      pattern: 'service',
      icon: 'workflow',
      sub: 'Compose creates one per project without being asked (course 8)',
    },
  ],
  edges: [{ source: 'compare', target: 'why' }],
}
