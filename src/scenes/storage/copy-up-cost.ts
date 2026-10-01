import type { Scene } from '@graphlearning/flow'

// §2 why-not-the-container-fs — two independent reasons, and people usually only know the first.
// The lifetime one is obvious: the writable layer dies with the container. The PERFORMANCE one is
// not: every first write to a file that lives in a lower layer copies the WHOLE file up, so an
// append to a 2 GB log costs 2 GB, and a database's random writes are pathological on overlayfs.
export const copyUpCost: Scene = {
  id: 'copy-up-cost',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'lifetime',
      label: 'Reason 1 — the writable layer dies with the container',
      pattern: 'group',
      icon: 'power',
      flow: 'LR',
      children: [
        { id: 'l1', label: 'container writes rows', pattern: 'service', icon: 'box', sub: 'straight into its upperdir, happily' },
        { id: 'l2', label: 'docker rm', pattern: 'warn', icon: 'trash', sub: 'or --rm, or a redeploy, or a crash-and-recreate' },
        { id: 'l3', label: 'the data is gone', pattern: 'warn', icon: 'skull', sub: 'there is nothing to recover — no file, no snapshot' },
      ],
      edges: [
        { source: 'l1', target: 'l2' },
        { source: 'l2', target: 'l3' },
      ],
    },
    {
      id: 'perf',
      label: 'Reason 2 — copy-on-write makes the first write expensive',
      pattern: 'group',
      icon: 'clock',
      flow: 'LR',
      children: [
        {
          id: 'p1',
          label: 'append one line',
          pattern: 'network',
          icon: 'pencil',
          sub: 'to a 2 GB log file that lives in a lower layer',
        },
        {
          id: 'p2',
          label: 'overlayfs copies it UP',
          pattern: 'warn',
          icon: 'copy',
          sub: 'the WHOLE file, first — 2 GB, to add 40 bytes',
        },
        {
          id: 'p3',
          label: 'and a database is worse',
          pattern: 'warn',
          icon: 'database',
          sub: 'many small random writes, each paying the union tax',
        },
      ],
      edges: [
        { source: 'p1', target: 'p2' },
        { source: 'p2', target: 'p3' },
      ],
    },
    {
      id: 'fix',
      label: 'A mount bypasses both',
      pattern: 'service',
      icon: 'plug',
      sub: 'not in the union: it outlives the container, and writes go direct',
    },
  ],
  edges: [
    { source: 'lifetime', target: 'perf' },
    { source: 'perf', target: 'fix' },
  ],
}
