import type { Scene } from '@graphlearning/flow'

// §11 troubleshooting — "the container cannot reach X" has four completely different causes and one
// ordering that separates them fast. Drawn as a decision walk rather than a list, because the value
// is in doing them IN ORDER: each step rules out a layer, so the answer arrives in four commands
// instead of an afternoon of guessing.
export const netTroubleshoot: Scene = {
  id: 'net-troubleshoot',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'walk',
      label: '“It cannot reach the database” — four questions, in this order',
      pattern: 'group',
      icon: 'bug',
      flow: 'LR',
      children: [
        {
          id: 's1',
          label: '1 · same network?',
          pattern: 'service',
          icon: 'boxes',
          sub: 'docker network inspect — are BOTH actually attached?',
        },
        {
          id: 's2',
          label: '2 · does the name resolve?',
          pattern: 'service',
          icon: 'search',
          sub: 'getent hosts db — no answer means default bridge (§2)',
        },
        {
          id: 's3',
          label: '3 · is the port open?',
          pattern: 'service',
          icon: 'plug',
          sub: 'nc -z db 5432 — refused means it is not listening there',
        },
        {
          id: 's4',
          label: '4 · what is it bound to?',
          pattern: 'service',
          icon: 'ban',
          sub: 'ss -lntp inside: 127.0.0.1:5432 is unreachable from outside',
        },
      ],
      edges: [
        { source: 's1', target: 's2' },
        { source: 's2', target: 's3' },
        { source: 's3', target: 's4' },
      ],
    },
    {
      id: 'tools',
      label: 'And when the image has no tools at all (course 2 §9)',
      pattern: 'group',
      icon: 'wrench',
      flow: 'LR',
      children: [
        {
          id: 't1',
          label: 'join its namespace',
          pattern: 'network',
          icon: 'link',
          sub: 'docker run --net container:api nicolaka/netshoot',
        },
        {
          id: 't2',
          label: 'then all of it works',
          pattern: 'service',
          icon: 'terminal',
          sub: 'dig, ss, tcpdump, curl — on the same stack as the app',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'walk', target: 'tools' }],
}
