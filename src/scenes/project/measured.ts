import type { Scene } from '@graphlearning/flow'

// §2–§4 — the measurements, because "it got smaller" is not a result. The table is the capstone's
// spine made quantitative: each row is one section's change, and the last column is the course it
// came from. Numbers are representative of a real Node service, not invented round ones.
export const measured: Scene = {
  id: 'measured',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'One change per step, measured — “smaller” is not a result',
      sub: 'a Node 20 API with a native dependency and a build step; numbers are representative',
      headers: ['Step', 'Image', 'Rebuild on a code edit', 'From'],
      values: [
        ['§2 naive — it works', '1.24 GB', '94 s', '—'],
        ['§3 multi-stage', '198 MB', '94 s', 'course 5 §3'],
        ['§4 reorder + cache mount', '198 MB', '6 s', 'course 4 §11, course 5 §4'],
        ['§4 .dockerignore', '198 MB', '4 s', 'course 4 §5'],
        ['§5 hardened', '198 MB', '4 s', 'course 10'],
        ['§9 remote cache, cold CI', '198 MB', '38 s (was 4 min)', 'course 5 §8'],
      ],
    },
    {
      id: 'reads',
      label: 'Two things the table says that a single number would not',
      pattern: 'group',
      icon: 'brain',
      flow: 'LR',
      children: [
        {
          id: 'r1',
          label: 'size and speed are separate',
          pattern: 'network',
          icon: 'scale',
          sub: 'multi-stage fixed one and did nothing for the other',
        },
        {
          id: 'r2',
          label: 'hardening costs nothing',
          pattern: 'service',
          icon: 'shieldcheck',
          sub: 'the whole of course 10, and both columns are unchanged',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'table', target: 'reads' }],
}
