import type { Scene } from '@graphlearning/flow'

// §6 disk (reused by §11 you-are-here) — the SPINE of the operating course, because "the disk is
// full" is the incident that actually happens, and every part of the system contributes to it in a
// different way with a different cleanup. The point of the map is that `docker images` shows you
// one quarter of it, which is why people delete images and free nothing.
export const diskMap: Scene = {
  id: 'disk-map',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'where',
      label: '/var/lib/docker — four places the bytes go, and only one is obvious',
      pattern: 'group',
      icon: 'harddrive',
      flow: 'LR',
      children: [
        {
          id: 'img',
          label: 'images',
          pattern: 'storage',
          icon: 'package',
          sub: 'the one people look at — and often not the largest',
        },
        {
          id: 'ct',
          label: 'containers',
          pattern: 'warn',
          icon: 'boxes',
          sub: 'a writable layer EACH, stopped ones included (c2 §4)',
        },
        {
          id: 'vol',
          label: 'volumes',
          pattern: 'storage',
          icon: 'database',
          sub: 'your data. Never prune these in a hurry (c3 §8)',
        },
        {
          id: 'cache',
          label: 'build cache',
          pattern: 'warn',
          icon: 'workflow',
          sub: 'unbounded by default — the biggest item on a CI host',
        },
      ],
      edges: [],
    },
    {
      id: 'plus',
      label: 'Plus: the container logs',
      pattern: 'warn',
      icon: 'file',
      sub: 'json-file, one per container, and unrotated until you say so',
    },
    {
      id: 'order',
      label: 'The order to work in',
      pattern: 'group',
      icon: 'search',
      flow: 'LR',
      children: [
        { id: 'o1', label: '1 · docker system df -v', pattern: 'service', icon: 'barchart', sub: 'per object, with a RECLAIMABLE column' },
        { id: 'o2', label: '2 · builder prune', pattern: 'service', icon: 'circlecheck', sub: 'the safest large win — nothing is lost' },
        { id: 'o3', label: '3 · container prune', pattern: 'network', icon: 'trash', sub: 'then images. Volumes last, and read the list' },
      ],
      edges: [
        { source: 'o1', target: 'o2' },
        { source: 'o2', target: 'o3' },
      ],
    },
  ],
  edges: [
    { source: 'where', target: 'plus' },
    { source: 'plus', target: 'order' },
  ],
}
