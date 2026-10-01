import type { Scene } from '@graphlearning/flow'

// §6 what-p-really-does — the mechanism behind the flag everyone types on day one. `-p 8080:80` is
// dockerd writing a DNAT rule into iptables' nat table. Which explains the things that otherwise
// look like Docker being mysterious: the container never sees the host port, UFW rules appear not
// to apply, and binding to 127.0.0.1 inside the container makes it unreachable.
export const publishDnat: Scene = {
  id: 'publish-dnat',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'path',
      label: '-p 8080:80 — following one packet in',
      pattern: 'group',
      icon: 'workflow',
      flow: 'LR',
      children: [
        { id: 'k1', label: 'client → host:8080', pattern: 'user', icon: 'globe', sub: 'an ordinary TCP connection to your machine' },
        { id: 'k2', label: 'iptables nat PREROUTING', pattern: 'service', icon: 'funnel', sub: 'DNAT: rewrite the destination to 172.17.0.2:80' },
        { id: 'k3', label: 'across the veth pair', pattern: 'network', icon: 'link', sub: 'routed into the container’s namespace' },
        { id: 'k4', label: 'app sees :80', pattern: 'service', icon: 'box', sub: 'from 172.17.0.1 — never the original client IP' },
      ],
      edges: [
        { source: 'k1', target: 'k2' },
        { source: 'k2', target: 'k3' },
        { source: 'k3', target: 'k4' },
      ],
    },
    {
      id: 'consequences',
      label: 'Four things this explains',
      pattern: 'group',
      icon: 'brain',
      flow: 'LR',
      children: [
        {
          id: 'x1',
          label: 'the container sees :80',
          pattern: 'network',
          icon: 'search',
          sub: 'it has no idea 8080 was ever involved',
        },
        {
          id: 'x2',
          label: 'bind 0.0.0.0, not localhost',
          pattern: 'warn',
          icon: 'ban',
          sub: 'loopback in the namespace is unreachable from outside',
        },
        {
          id: 'x3',
          label: 'UFW does not apply',
          pattern: 'warn',
          icon: 'shieldcheck',
          sub: 'DNAT runs before UFW’s filter chain — so it misses',
        },
        {
          id: 'x4',
          label: 'HOST:CONTAINER',
          pattern: 'network',
          icon: 'swap',
          sub: 'and -p 127.0.0.1:8080:80 binds to loopback only',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'path', target: 'consequences' }],
}
