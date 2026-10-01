import type { Scene } from '@graphlearning/flow'

// §6 size — why `docker images` adds up to far more than the disk actually holds. The SIZE column
// is per-image and counts every layer that image uses; two images built on the same base each claim
// the base's 142 MB, and on disk there is one copy. `docker system df` is the command that tells
// the truth, and the number that matters for a deploy is neither of those — it is what a puller
// does NOT already have.
//
// Two images side by side over one shared base, then the three different numbers you can mean by
// "how big is it".
export const sizeSharing: Scene = {
  id: 'size-sharing',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'two',
      label: 'Two images, one base — and the base exists ONCE on disk',
      pattern: 'group',
      icon: 'copy',
      flow: 'TB',
      children: [
        {
          id: 'tops',
          label: 'Their own layers',
          pattern: 'group',
          icon: 'boxes',
          flow: 'LR',
          children: [
            { id: 'a', label: 'api:1.4', pattern: 'service', icon: 'package', sub: 'its own layers — 62 MB' },
            { id: 'b', label: 'worker:2.0', pattern: 'service', icon: 'package', sub: 'its own layers — 38 MB' },
          ],
          edges: [],
        },
        {
          id: 'base',
          label: 'node:20-slim — shared',
          pattern: 'storage',
          icon: 'harddrive',
          sub: '142 MB, stored once, counted twice by docker images',
        },
      ],
      edges: [{ source: 'tops', target: 'base', label: 'both FROM it' }],
    },
    {
      id: 'numbers',
      label: 'Three different numbers, and they answer different questions',
      pattern: 'group',
      icon: 'ruler',
      flow: 'LR',
      children: [
        {
          id: 'n1',
          label: 'docker images',
          pattern: 'warn',
          icon: 'barchart',
          sub: '204 + 180 MB — per image, so it double-counts',
        },
        {
          id: 'n2',
          label: 'docker system df',
          pattern: 'service',
          icon: 'harddrive',
          sub: '242 MB actual, with a RECLAIMABLE column — the truth',
        },
        {
          id: 'n3',
          label: 'what a pull costs',
          pattern: 'network',
          icon: 'cloud',
          sub: 'only the layers that host lacks — often just yours',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'two', target: 'numbers' }],
}
