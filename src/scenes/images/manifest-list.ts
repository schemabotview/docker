import type { Scene } from '@graphlearning/flow'

// §7 manifest-lists — how one name serves several architectures, and the reason an image "works on
// CI and not on the ARM laptop". The top-level object behind `nginx:1.25` is usually not a manifest
// at all: it is an INDEX listing one manifest per platform, and the daemon picks the entry matching
// its own. When a publisher only built amd64, there is no index and no entry to pick — so the pull
// either fails or silently hands an ARM machine an emulated amd64 image.
//
// One index fanning out to three platform manifests, then the selection rule beneath it.
export const manifestList: Scene = {
  id: 'manifest-list',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'index',
      label: 'nginx:1.25 → an INDEX',
      pattern: 'service',
      icon: 'table',
      sub: 'a list of manifests, each labelled with os + architecture',
    },
    {
      id: 'arches',
      label: 'One manifest per platform — each its own digest and its own layers',
      pattern: 'group',
      icon: 'boxes',
      flow: 'LR',
      children: [
        { id: 'amd', label: 'linux/amd64', pattern: 'network', icon: 'cpu', sub: 'sha256:11aa… — its own layer blobs' },
        { id: 'arm', label: 'linux/arm64', pattern: 'network', icon: 'cpu', sub: 'sha256:22bb… — different binaries' },
        { id: 'armv7', label: 'linux/arm/v7', pattern: 'network', icon: 'cpu', sub: 'sha256:33cc… — if the publisher built it' },
      ],
      edges: [],
    },
    {
      id: 'pick',
      label: 'What the daemon does with it',
      pattern: 'group',
      icon: 'funnel',
      flow: 'LR',
      children: [
        { id: 'p1', label: 'matches its own platform', pattern: 'service', icon: 'circlecheck', sub: 'you never see the index; it just works' },
        { id: 'p2', label: '--platform overrides it', pattern: 'network', icon: 'pencil', sub: 'pull amd64 onto ARM deliberately' },
        { id: 'p3', label: 'no matching entry', pattern: 'warn', icon: 'circleslash', sub: 'an error, or slow QEMU emulation' },
      ],
      edges: [],
    },
  ],
  edges: [
    { source: 'index', target: 'arches', label: 'fans out' },
    { source: 'arches', target: 'pick' },
  ],
}
