import type { Scene } from '@graphlearning/flow'

// §11 the-cache — the highest-leverage section in the course. One rule: a step is reused if its
// inputs are unchanged AND every step before it was reused. So a miss is not local — it CASCADES,
// invalidating everything below. Which turns Dockerfile authoring into a single ordering problem:
// put what rarely changes above what changes every commit.
//
// Two columns, the same four instructions in two orders, with the miss point marked. The dependency
// install is the only expensive step in either, and its position is the whole difference.
export const cacheRule: Scene = {
  id: 'cache-rule',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'orders',
      label: 'Four instructions, two orders — after editing one source file',
      pattern: 'group',
      icon: 'scale',
      flow: 'LR',
      children: [
        {
          id: 'bad',
          label: 'COPY . . first — 94 s every time',
          pattern: 'group',
          icon: 'ban',
          flow: 'TB',
          children: [
            { id: 'b1', label: 'FROM node:20-slim', pattern: 'storage', icon: 'circlecheck', sub: 'HIT — unchanged' },
            { id: 'b2', label: 'COPY . .', pattern: 'warn', icon: 'zap', sub: 'MISS — one source file changed' },
            { id: 'b3', label: 'RUN npm ci', pattern: 'warn', icon: 'clock', sub: 'MISS — cascaded. 90 seconds, again' },
            { id: 'b4', label: 'CMD ["node","app.js"]', pattern: 'warn', icon: 'circleslash', sub: 'MISS — cascaded' },
          ],
          edges: [
            { source: 'b1', target: 'b2' },
            { source: 'b2', target: 'b3' },
            { source: 'b3', target: 'b4' },
          ],
        },
        {
          id: 'good',
          label: 'the manifest first — 4 s',
          pattern: 'group',
          icon: 'circlecheck',
          flow: 'TB',
          children: [
            { id: 'g1', label: 'FROM node:20-slim', pattern: 'storage', icon: 'circlecheck', sub: 'HIT' },
            { id: 'g2', label: 'COPY package*.json ./', pattern: 'storage', icon: 'circlecheck', sub: 'HIT — dependencies did not change' },
            { id: 'g3', label: 'RUN npm ci', pattern: 'storage', icon: 'zap', sub: 'HIT — the 90 seconds are skipped entirely' },
            { id: 'g4', label: 'COPY . .', pattern: 'warn', icon: 'pencil', sub: 'MISS — and it is the LAST expensive thing' },
          ],
          edges: [
            { source: 'g1', target: 'g2' },
            { source: 'g2', target: 'g3' },
            { source: 'g3', target: 'g4' },
          ],
        },
      ],
      edges: [],
    },
    {
      id: 'rules',
      label: 'What counts as “changed”, and what does not',
      pattern: 'group',
      icon: 'brain',
      flow: 'LR',
      children: [
        { id: 'r1', label: 'COPY: file CONTENT', pattern: 'network', icon: 'fingerprint', sub: 'checksummed — mtime alone does not bust it' },
        { id: 'r2', label: 'RUN: the string only', pattern: 'warn', icon: 'search', sub: 'apt-get upgrade is a HIT forever — it never re-runs' },
        { id: 'r3', label: '--no-cache', pattern: 'network', icon: 'repeat', sub: 'the escape hatch when you need it genuinely fresh' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'orders', target: 'rules' }],
}
