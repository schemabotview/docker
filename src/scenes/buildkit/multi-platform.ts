import type { Scene } from '@graphlearning/flow'

// §7 multi-platform — one command, and a choice between two ways of executing foreign instructions
// that differ by an order of magnitude. QEMU emulates the foreign CPU on one machine: trivial to
// set up, and 5–20× slower for anything compute-heavy, which a compile is. Native nodes run each
// platform on hardware that speaks it: fast, and needs machines. The cross-compile route avoids
// both, and is the right answer when the toolchain supports it.
export const multiPlatform: Scene = {
  id: 'multi-platform',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'ask',
      label: 'buildx --platform a,b',
      pattern: 'service',
      icon: 'workflow',
      sub: 'one command, two images, one index over them (c3 §7)',
    },
    {
      id: 'ways',
      label: 'Three ways to actually execute the foreign instructions',
      pattern: 'group',
      icon: 'gitbranch',
      flow: 'LR',
      children: [
        {
          id: 'qemu',
          label: 'QEMU emulation',
          pattern: 'warn',
          icon: 'clock',
          sub: 'one machine, binfmt_misc — and 5–20× slower to compile',
        },
        {
          id: 'native',
          label: 'native nodes',
          pattern: 'service',
          icon: 'boxes',
          sub: 'a builder per arch — full speed, and you need the machines',
        },
        {
          id: 'cross',
          label: 'cross-compilation',
          pattern: 'service',
          icon: 'zap',
          sub: 'build on the host arch, target another — Go, Rust, Zig',
        },
      ],
      edges: [],
    },
    {
      id: 'notes',
      label: 'Two things that surprise people the first time',
      pattern: 'group',
      icon: 'warn',
      flow: 'LR',
      children: [
        {
          id: 'n1',
          label: '--push, not --load',
          pattern: 'warn',
          icon: 'cloud',
          sub: 'the local store holds one platform — a multi-arch --load fails',
        },
        {
          id: 'n2',
          label: 'TARGETPLATFORM is free',
          pattern: 'network',
          icon: 'tag',
          sub: 'an automatic ARG — ARG TARGETARCH and use it in the RUN',
        },
      ],
      edges: [],
    },
  ],
  edges: [
    { source: 'ask', target: 'ways' },
    { source: 'ways', target: 'notes' },
  ],
}
