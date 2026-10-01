import type { Scene } from '@graphlearning/flow'

// §1 the-mental-model (reused by §12 you-are-here, and forward into `production`) — the SPINE.
// Three Linux primitives and nothing else: a network NAMESPACE per container (its own interfaces,
// routes and firewall rules), a VETH PAIR which is a virtual cable with an end in each namespace,
// and a BRIDGE which is a virtual switch on the host. Every Docker networking behaviour is one of
// those three doing its ordinary job.
export const netTopology: Scene = {
  id: 'net-topology',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'host',
      label: 'The host’s network stack',
      pattern: 'group',
      icon: 'server',
      flow: 'TB',
      children: [
        {
          id: 'eth0',
          label: 'eth0 — the real NIC',
          pattern: 'external',
          icon: 'globe',
          sub: '192.168.1.40 — where the outside world arrives',
        },
        {
          id: 'bridge',
          label: 'docker0 — a virtual switch',
          pattern: 'service',
          icon: 'router',
          sub: '172.17.0.1 — a software bridge, nothing more exotic',
        },
        {
          id: 'ns',
          label: 'Two network namespaces, each with a veth pair to the bridge',
          pattern: 'group',
          icon: 'boxes',
          flow: 'LR',
          children: [
            {
              id: 'c1',
              label: 'container A',
              pattern: 'network',
              icon: 'box',
              sub: 'eth0 = 172.17.0.2 · its own routes and iptables',
            },
            {
              id: 'c2',
              label: 'container B',
              pattern: 'network',
              icon: 'box',
              sub: 'eth0 = 172.17.0.3 · both can listen on port 80',
            },
          ],
          edges: [],
        },
      ],
      edges: [
        { source: 'eth0', target: 'bridge', label: 'NAT on the way out' },
        { source: 'bridge', target: 'ns', label: 'one veth pair each' },
      ],
    },
    {
      id: 'three',
      label: 'Three primitives — the rest of this course is these, working',
      pattern: 'group',
      icon: 'brain',
      flow: 'LR',
      children: [
        { id: 'p1', label: 'network namespace', pattern: 'network', icon: 'box', sub: 'own interfaces, routes, firewall rules (c1 §3)' },
        { id: 'p2', label: 'veth pair', pattern: 'network', icon: 'link', sub: 'a virtual cable — one end in each namespace' },
        { id: 'p3', label: 'bridge', pattern: 'network', icon: 'router', sub: 'a virtual switch the host end of each cable plugs into' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'host', target: 'three' }],
}
