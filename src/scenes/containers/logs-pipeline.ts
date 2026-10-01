import type { Scene } from '@graphlearning/flow'

// §8 logs — the inversion people miss. In a container you do NOT write log files; you write to
// stdout and stderr, and the log DRIVER decides what happens to them. Everything that follows is a
// consequence: `docker logs` only works because the default driver writes a file dockerd can read
// back, an unrotated json-file will fill a host's disk, and switching the driver to something
// remote makes `docker logs` stop working entirely — which reads as a broken container.
//
// Left to right: the two streams, the driver that intercepts them, and the three different ends
// they can come to. The disk card is `warn` because that is the one that pages someone at night.
export const logsPipeline: Scene = {
  id: 'logs-pipeline',
  padding: 0.09,
  nodes: [
    {
      id: 'pipe',
      label: 'Write to stdout — the driver decides everything after that',
      pattern: 'group',
      icon: 'workflow',
      flow: 'LR',
      children: [
        {
          id: 'app',
          label: 'your process · pid 1',
          pattern: 'group',
          icon: 'box',
          flow: 'TB',
          children: [
            { id: 'out', label: 'stdout', pattern: 'network', icon: 'file', sub: 'normal output' },
            { id: 'err', label: 'stderr', pattern: 'network', icon: 'file', sub: 'kept separate all the way through' },
          ],
          edges: [],
        },
        {
          id: 'driver',
          label: 'the logging driver',
          pattern: 'service',
          icon: 'funnel',
          sub: 'json-file by default · --log-driver changes it',
        },
        {
          id: 'ends',
          label: 'Where they end up',
          pattern: 'group',
          icon: 'gitbranch',
          flow: 'TB',
          children: [
            {
              id: 'jf',
              label: 'json-file',
              pattern: 'storage',
              icon: 'harddrive',
              sub: 'one JSON line per log line, under /var/lib/docker',
            },
            {
              id: 'nolimit',
              label: 'and it does NOT rotate',
              pattern: 'warn',
              icon: 'skull',
              sub: 'until you set max-size and max-file — a full host',
            },
            {
              id: 'remote',
              label: 'a remote driver',
              pattern: 'external',
              icon: 'cloud',
              sub: 'journald, fluentd, awslogs — docker logs stops working',
            },
          ],
          edges: [],
        },
      ],
      edges: [
        { source: 'app', target: 'driver', label: 'intercepted' },
        { source: 'driver', target: 'ends' },
      ],
    },
    {
      id: 'read',
      label: 'Reading them back',
      pattern: 'group',
      icon: 'search',
      flow: 'LR',
      children: [
        { id: 'f', label: 'docker logs -f', pattern: 'network', icon: 'repeat', sub: 'follow, like tail -f' },
        { id: 'n', label: '--tail 100', pattern: 'network', icon: 'scissors', sub: 'the last N — the default is ALL of them' },
        { id: 't', label: '--since 10m -t', pattern: 'network', icon: 'clock', sub: 'a window, with timestamps added by Docker' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'pipe', target: 'read', label: 'only if the driver kept them locally' }],
}
