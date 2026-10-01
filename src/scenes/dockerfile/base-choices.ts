import type { Scene } from '@graphlearning/flow'

// §2 from — the first line decides the size, the attack surface and the debugging story, and the
// popular advice ("use alpine") is wrong often enough to be worth a table. The musl trap is the
// specific thing: Alpine is not a smaller Debian, it is a different libc, so Python wheels and
// anything with native extensions may be rebuilt from source or behave differently at runtime.
export const baseChoices: Scene = {
  id: 'base-choices',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'The first line — and what each choice actually costs',
      sub: 'sizes are for a node 20 base, and are indicative rather than exact',
      headers: ['FROM', 'Size', 'Has a shell', 'Choose it when'],
      values: [
        ['node:20', '~1.1 GB', 'yes, plus build tools', 'you are building, not shipping'],
        ['node:20-slim', '~200 MB', 'yes', 'the sane default for most services'],
        ['node:20-alpine', '~130 MB', 'yes (busybox)', 'size matters AND musl is proven for you'],
        ['gcr.io/distroless/nodejs20', '~110 MB', 'NO', 'a hardened runtime stage; nothing to exec'],
        ['scratch', '0 B', 'NO', 'one static binary — Go, Rust'],
      ],
    },
    {
      id: 'traps',
      label: 'Two things the size column does not tell you',
      pattern: 'group',
      icon: 'warn',
      flow: 'LR',
      children: [
        {
          id: 'musl',
          label: 'Alpine is a different libc',
          pattern: 'warn',
          icon: 'swap',
          sub: 'musl, not glibc — wheels rebuild, DNS differs, timings shift',
        },
        {
          id: 'debug',
          label: 'No shell is the point',
          pattern: 'network',
          icon: 'shieldcheck',
          sub: 'and it is why exec fails — join namespaces instead (c2 §9)',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'table', target: 'traps' }],
}
