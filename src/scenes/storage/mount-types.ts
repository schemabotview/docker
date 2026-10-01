import type { Scene } from '@graphlearning/flow'

// §3 the-three-mount-types (reused by §10 you-are-here) — the SPINE. All three put something at a
// path inside the container that is NOT part of the layer stack. They differ in who owns the
// storage: Docker (a volume), you (a bind mount), or nobody, because it is RAM (tmpfs). Choosing
// between them is almost always a question of who should own it, not of which is fastest.
export const mountTypes: Scene = {
  id: 'mount-types',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'ct',
      label: 'One container — three paths that are not in the image',
      pattern: 'group',
      icon: 'box',
      flow: 'LR',
      children: [
        {
          id: 'vol',
          label: 'volume → /var/lib/data',
          pattern: 'group',
          icon: 'database',
          flow: 'TB',
          children: [
            { id: 'v1', label: 'Docker owns it', pattern: 'storage', icon: 'harddrive', sub: 'under /var/lib/docker/volumes — do not touch it there' },
            { id: 'v2', label: 'survives the container', pattern: 'service', icon: 'lock', sub: 'and is what a database directory should be' },
            { id: 'v3', label: 'portable', pattern: 'network', icon: 'cloud', sub: 'a driver can put it on NFS or a cloud disk' },
          ],
          edges: [
            { source: 'v1', target: 'v2' },
            { source: 'v2', target: 'v3' },
          ],
        },
        {
          id: 'bind',
          label: 'bind → /app',
          pattern: 'group',
          icon: 'folder',
          flow: 'TB',
          children: [
            { id: 'b1', label: 'YOU own it', pattern: 'network', icon: 'user', sub: 'an exact host path, mounted straight in' },
            { id: 'b2', label: 'edits appear instantly', pattern: 'service', icon: 'pencil', sub: 'the dev loop — no rebuild to see a change' },
            { id: 'b3', label: 'and host-dependent', pattern: 'warn', icon: 'warn', sub: 'uid mismatch (§8), and slow on Desktop' },
          ],
          edges: [
            { source: 'b1', target: 'b2' },
            { source: 'b2', target: 'b3' },
          ],
        },
        {
          id: 'tmp',
          label: 'tmpfs → /run/secrets',
          pattern: 'group',
          icon: 'memory',
          flow: 'TB',
          children: [
            { id: 't1', label: 'nobody owns it', pattern: 'network', icon: 'zap', sub: 'RAM — never touches a disk' },
            { id: 't2', label: 'gone on stop', pattern: 'warn', icon: 'power', sub: 'which is exactly the point, for a secret' },
            { id: 't3', label: 'Linux only', pattern: 'warn', icon: 'circleslash', sub: 'and it counts against the container’s memory' },
          ],
          edges: [
            { source: 't1', target: 't2' },
            { source: 't2', target: 't3' },
          ],
        },
      ],
      edges: [],
    },
    {
      id: 'choose',
      label: 'The question is who should own the storage, not which is fastest',
      pattern: 'group',
      icon: 'scale',
      flow: 'LR',
      children: [
        { id: 'c1', label: 'data → volume', pattern: 'storage', icon: 'database', sub: 'databases, uploads, anything with a backup story' },
        { id: 'c2', label: 'source → bind', pattern: 'network', icon: 'filecode', sub: 'development only — never in production' },
        { id: 'c3', label: 'scratch → tmpfs', pattern: 'network', icon: 'memory', sub: 'secrets, caches, a read-only rootfs’s /tmp' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'ct', target: 'choose' }],
}
