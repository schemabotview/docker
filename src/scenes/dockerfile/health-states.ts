import type { Scene } from '@graphlearning/flow'

// §9 healthcheck — a state machine Docker maintains and then almost entirely ignores. The thing
// worth teaching is the asymmetry: Docker will mark a container `unhealthy` and will do NOTHING
// about it — no restart, no removal from anything, because plain Docker has no scheduler. What the
// state is actually for is other software reading it: Compose's `depends_on: condition:
// service_healthy`, Swarm's rolling updates, and your own scripts.
export const healthStates: Scene = {
  id: 'health-states',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'states',
      label: 'The state machine — one pass, and it never loops back on its own',
      pattern: 'group',
      icon: 'activity',
      flow: 'LR',
      children: [
        {
          id: 'starting',
          label: 'starting',
          pattern: 'network',
          icon: 'clock',
          sub: 'during --start-period, a failure does not count',
        },
        {
          id: 'healthy',
          label: 'healthy',
          pattern: 'service',
          icon: 'circlecheck',
          sub: 'the command exited 0 — that is the entire test',
        },
        {
          id: 'unhealthy',
          label: 'unhealthy',
          pattern: 'warn',
          icon: 'circleslash',
          sub: 'after --retries consecutive non-zero exits',
        },
      ],
      edges: [
        { source: 'starting', target: 'healthy', label: 'first success' },
        { source: 'healthy', target: 'unhealthy', label: 'N failures in a row' },
      ],
    },
    {
      id: 'sofar',
      label: 'What Docker does about “unhealthy”: nothing at all',
      pattern: 'group',
      icon: 'ban',
      flow: 'LR',
      children: [
        { id: 'n1', label: 'no restart', pattern: 'warn', icon: 'ban', sub: 'restart policies watch EXITS, not health' },
        { id: 'n2', label: 'no traffic change', pattern: 'warn', icon: 'ban', sub: 'plain Docker has nothing to take it out of' },
        { id: 'n3', label: 'it just records it', pattern: 'network', icon: 'search', sub: 'docker ps shows (unhealthy) in the status' },
      ],
      edges: [],
    },
    {
      id: 'who',
      label: 'Who actually reads the state — which is why you write one',
      pattern: 'group',
      icon: 'usercheck',
      flow: 'LR',
      children: [
        { id: 'w1', label: 'Compose depends_on', pattern: 'service', icon: 'workflow', sub: 'condition: service_healthy — course 8 §6' },
        { id: 'w2', label: 'Swarm and orchestrators', pattern: 'service', icon: 'boxes', sub: 'rolling updates wait for healthy before continuing' },
        { id: 'w3', label: 'your own scripts', pattern: 'network', icon: 'terminal', sub: 'docker inspect --format "{{.State.Health.Status}}"' },
      ],
      edges: [],
    },
  ],
  edges: [
    { source: 'states', target: 'sofar' },
    { source: 'sofar', target: 'who', label: 'so the value is entirely downstream' },
  ],
}
