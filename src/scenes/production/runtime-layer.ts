import type { Scene } from '@graphlearning/flow'

// §4 the-runtime-layer — course 1's chain, revisited from the operator's side: the interesting part
// is that runc is REPLACEABLE, and the three replacements make different trades between isolation
// and cost. This is also where the Kubernetes seam becomes concrete — the bottom half of the chain
// is what Kubernetes kept.
export const runtimeLayer: Scene = {
  id: 'runtime-layer',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'chain',
      label: 'The bottom of course 1’s chain — and the last box is swappable',
      pattern: 'group',
      icon: 'workflow',
      flow: 'LR',
      children: [
        { id: 'c1', label: 'containerd', pattern: 'service', icon: 'boxes', sub: 'pulls, unpacks, tracks lifecycle' },
        { id: 'c2', label: 'the shim', pattern: 'service', icon: 'link', sub: 'one per container; why dockerd can restart' },
        { id: 'c3', label: 'an OCI runtime', pattern: 'network', icon: 'power', sub: 'runc by default — and this is the swappable one' },
      ],
      edges: [
        { source: 'c1', target: 'c2' },
        { source: 'c2', target: 'c3' },
      ],
    },
    {
      id: 'alts',
      label: 'What you can put there instead, and what it buys',
      pattern: 'group',
      icon: 'swap',
      flow: 'LR',
      children: [
        { id: 'a1', label: 'runc', pattern: 'service', icon: 'gears', sub: 'the reference. namespaces + cgroups, nothing more' },
        { id: 'a2', label: 'crun', pattern: 'network', icon: 'zap', sub: 'the same contract in C — faster start, less memory' },
        { id: 'a3', label: 'gVisor', pattern: 'network', icon: 'shieldcheck', sub: 'syscalls served in USERSPACE — the host kernel barely reachable' },
        { id: 'a4', label: 'Kata', pattern: 'network', icon: 'building', sub: 'a real VM per container — the strongest, and the slowest' },
      ],
      edges: [],
    },
    {
      id: 'seam',
      label: 'The Kubernetes seam',
      pattern: 'network',
      icon: 'gitbranch',
      sub: 'dropping dockerd kept exactly this half — hence images still work',
    },
  ],
  edges: [
    { source: 'chain', target: 'alts', label: '--runtime, or default-runtime' },
    { source: 'alts', target: 'seam' },
  ],
}
