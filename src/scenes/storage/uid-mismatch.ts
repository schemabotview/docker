import type { Scene } from '@graphlearning/flow'

// §8 permissions — the most common bind-mount failure, and it is not a Docker feature at all. The
// kernel checks NUMERIC ids. The container's `app` user might be uid 1001; your host user is 501 on
// a Mac or 1000 on Linux. Same files, two different numbers, permission denied — and the container
// has no way to know the name it is using does not exist on the host.
export const uidMismatch: Scene = {
  id: 'uid-mismatch',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'clash',
      label: 'One directory, two views — and the kernel only sees numbers',
      pattern: 'group',
      icon: 'swap',
      flow: 'LR',
      children: [
        {
          id: 'hostside',
          label: 'on the host',
          pattern: 'group',
          icon: 'user',
          flow: 'TB',
          children: [
            { id: 'h1', label: './data owned by 1000', pattern: 'external', icon: 'folder', sub: 'your login user — 501 on macOS' },
            { id: 'h2', label: 'mode 0755', pattern: 'external', icon: 'lock', sub: 'others may read, nobody else may write' },
          ],
          edges: [],
        },
        {
          id: 'ctside',
          label: 'in the container',
          pattern: 'group',
          icon: 'box',
          flow: 'TB',
          children: [
            { id: 'c1', label: 'USER app = uid 1001', pattern: 'warn', icon: 'usercheck', sub: 'a perfectly sensible image, from c4 §8' },
            { id: 'c2', label: 'EACCES on write', pattern: 'warn', icon: 'ban', sub: '1001 is not 1000, and there is no name to match' },
          ],
          edges: [],
        },
      ],
      edges: [{ source: 'hostside', target: 'ctside', label: 'same inode, different uid' }],
    },
    {
      id: 'fixes',
      label: 'Three fixes, in the order you should reach for them',
      pattern: 'group',
      icon: 'wrench',
      flow: 'LR',
      children: [
        {
          id: 'f1',
          label: 'match the uid at run time',
          pattern: 'service',
          icon: 'circlecheck',
          sub: 'docker run --user $(id -u):$(id -g) — dev’s usual answer',
        },
        {
          id: 'f2',
          label: 'build for a known uid',
          pattern: 'service',
          icon: 'package',
          sub: 'ARG UID, and chown the host dir to match — for a team',
        },
        {
          id: 'f3',
          label: 'or use a volume',
          pattern: 'storage',
          icon: 'database',
          sub: 'Docker seeds it with the image’s ownership — no clash at all',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'clash', target: 'fixes' }],
}
