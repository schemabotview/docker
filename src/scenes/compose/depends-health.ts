import type { Scene } from '@graphlearning/flow'

// §6 dependencies — the most common Compose bug, and it is a misunderstanding rather than a typo.
// Plain `depends_on` orders STARTS, not readiness: Compose starts the database container and then
// immediately starts the API, and the database process is still doing initialisation. The API's
// first connection is refused and it exits. Adding a condition turns the ordering into waiting, and
// that needs a HEALTHCHECK that tests something real (course 4 §9).
export const dependsHealth: Scene = {
  id: 'depends-health',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'naive',
      label: 'depends_on: [db] — orders the START, and nothing else',
      pattern: 'group',
      icon: 'ban',
      flow: 'LR',
      children: [
        { id: 'a1', label: 'db container starts', pattern: 'network', icon: 'box', sub: 't=0 — the process begins initialising' },
        { id: 'a2', label: 'api starts immediately', pattern: 'warn', icon: 'zap', sub: 't=0.1 — Compose considers db “started”' },
        { id: 'a3', label: 'connection refused', pattern: 'warn', icon: 'skull', sub: 'postgres is not listening yet. api exits 1.' },
      ],
      edges: [
        { source: 'a1', target: 'a2' },
        { source: 'a2', target: 'a3' },
      ],
    },
    {
      id: 'fixed',
      label: 'condition: service_healthy — orders READINESS',
      pattern: 'group',
      icon: 'circlecheck',
      flow: 'LR',
      children: [
        { id: 'b1', label: 'db container starts', pattern: 'network', icon: 'box', sub: 'and its HEALTHCHECK begins probing' },
        { id: 'b2', label: 'Compose waits', pattern: 'service', icon: 'clock', sub: 'for the health state to become healthy (c4 §9)' },
        { id: 'b3', label: 'then api starts', pattern: 'service', icon: 'circlecheck', sub: 'to a database that is actually accepting connections' },
      ],
      edges: [
        { source: 'b1', target: 'b2' },
        { source: 'b2', target: 'b3' },
      ],
    },
    {
      id: 'caveats',
      label: 'Two things that still bite',
      pattern: 'group',
      icon: 'warn',
      flow: 'LR',
      children: [
        {
          id: 'c1',
          label: 'a fake healthcheck',
          pattern: 'warn',
          icon: 'circleslash',
          sub: 'pg_isready -q is real; `exit 0` passes and proves nothing',
        },
        {
          id: 'c2',
          label: 'no start_period',
          pattern: 'warn',
          icon: 'clock',
          sub: 'a slow starter goes unhealthy, and everything gives up',
        },
        {
          id: 'c3',
          label: 'retry anyway',
          pattern: 'service',
          icon: 'repeat',
          sub: 'ordering is a convenience; a DB can restart at 3am too',
        },
      ],
      edges: [],
    },
  ],
  edges: [
    { source: 'naive', target: 'fixed' },
    { source: 'fixed', target: 'caveats' },
  ],
}
