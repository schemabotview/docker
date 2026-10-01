import type { Scene } from '@graphlearning/flow'

// §10 swarm-in-honest-outline — one section rather than the sixteen the predecessor repo gave it,
// and the useful content is the DECISION: what changes when you go from one host to several, what
// Swarm still does well, and the honest reason it lost. The seam to the Kubernetes concept is the
// point of the scene.
export const swarmOutline: Scene = {
  id: 'swarm-outline',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'change',
      label: 'What actually changes when one host becomes several',
      pattern: 'group',
      icon: 'boxes',
      flow: 'LR',
      children: [
        { id: 'c1', label: 'placement', pattern: 'network', icon: 'share', sub: 'something must decide WHICH host runs this' },
        { id: 'c2', label: 'rescheduling', pattern: 'network', icon: 'repeat', sub: 'a host dies; its containers must reappear elsewhere' },
        { id: 'c3', label: 'a network across hosts', pattern: 'network', icon: 'router', sub: 'overlay — a bridge spanning machines (c7 §4)' },
        { id: 'c4', label: 'rolling updates', pattern: 'network', icon: 'workflow', sub: 'replace replicas one at a time, on health' },
      ],
      edges: [],
    },
    {
      id: 'swarm',
      label: 'Swarm does all four, in about ten minutes of setup',
      pattern: 'group',
      icon: 'circlecheck',
      flow: 'LR',
      children: [
        { id: 's1', label: 'docker swarm init', pattern: 'service', icon: 'terminal', sub: 'then join tokens. No control plane to operate' },
        { id: 's2', label: 'a stack is a compose file', pattern: 'service', icon: 'file', sub: 'docker stack deploy — the same YAML you already have' },
        { id: 's3', label: 'and it is stable', pattern: 'network', icon: 'lock', sub: 'maintained, not abandoned — but not advancing either' },
      ],
      edges: [],
    },
    {
      id: 'lost',
      label: 'Why it lost anyway, and where to go instead',
      pattern: 'group',
      icon: 'gitbranch',
      flow: 'LR',
      children: [
        { id: 'l1', label: 'the ecosystem went', pattern: 'warn', icon: 'users', sub: 'operators, charts, CNI, service meshes — all Kubernetes' },
        { id: 'l2', label: 'and so did the jobs', pattern: 'warn', icon: 'scale', sub: 'the skills transfer one way, and it is not this way' },
        { id: 'l3', label: 'so: two or three hosts', pattern: 'network', icon: 'circlecheck', sub: 'Swarm is a fine answer. Beyond that, Kubernetes' },
      ],
      edges: [],
    },
  ],
  edges: [
    { source: 'change', target: 'swarm' },
    { source: 'swarm', target: 'lost' },
  ],
}
