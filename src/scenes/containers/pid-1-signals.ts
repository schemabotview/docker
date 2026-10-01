import type { Scene } from '@graphlearning/flow'

// §3 pid-1 — the highest-value section in the course, and the one nobody covers. `docker stop` is
// not "stop": it is SIGTERM, then a ten-second wait, then SIGKILL. Whether your process gets those
// ten seconds depends entirely on whether it is pid 1 and whether it handles the signal — and the
// SHELL FORM of CMD silently puts /bin/sh at pid 1, which ignores SIGTERM and does not forward it.
// The symptom is a service that always takes exactly ten seconds to stop and always loses whatever
// it was mid-way through.
//
// Two rows: the timeline of what dockerd sends, and the two process shapes that receive it. The
// shapes are the diagnosis — `docker inspect` tells you which one you have.
export const pid1Signals: Scene = {
  id: 'pid-1-signals',
  padding: 0.09,
  nodes: [
    {
      id: 'stop',
      label: 'docker stop — three things, in order',
      pattern: 'group',
      icon: 'power',
      flow: 'LR',
      children: [
        { id: 's1', label: 'SIGTERM to pid 1', pattern: 'service', icon: 'bell', sub: 'the polite ask: finish up and exit' },
        { id: 's2', label: 'wait 10 seconds', pattern: 'warn', icon: 'clock', sub: '--time changes it; the default is 10' },
        { id: 's3', label: 'SIGKILL', pattern: 'warn', icon: 'skull', sub: 'unblockable — exit 137, work lost' },
      ],
      edges: [
        { source: 's1', target: 's2', label: 'if still alive' },
        { source: 's2', target: 's3', label: 'still alive' },
      ],
    },
    {
      id: 'shapes',
      label: 'Who is pid 1 decides whether those 10 seconds are usable',
      pattern: 'group',
      icon: 'gitbranch',
      flow: 'LR',
      children: [
        {
          id: 'bad',
          label: 'shell form — CMD node app.js',
          pattern: 'group',
          icon: 'ban',
          flow: 'TB',
          children: [
            { id: 'b1', label: '/bin/sh -c', pattern: 'warn', icon: 'terminal', sub: 'pid 1 — ignores SIGTERM, forwards nothing' },
            { id: 'b2', label: 'node app.js', pattern: 'network', icon: 'filecode', sub: 'pid 7 — never hears the signal at all' },
          ],
          edges: [{ source: 'b1', target: 'b2', label: 'forks' }],
        },
        {
          id: 'good',
          label: 'exec form — CMD ["node","app.js"]',
          pattern: 'group',
          icon: 'circlecheck',
          flow: 'TB',
          children: [
            { id: 'g1', label: 'node app.js', pattern: 'service', icon: 'filecode', sub: 'pid 1 — receives SIGTERM directly' },
            { id: 'g2', label: 'your shutdown handler', pattern: 'service', icon: 'circlecheck', sub: 'drain, flush, close, then exit 0' },
          ],
          edges: [{ source: 'g1', target: 'g2', label: 'handles it' }],
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'stop', target: 'shapes', label: 'arrives at whoever is pid 1' }],
}
