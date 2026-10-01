import type { Scene } from '@graphlearning/flow'

// §4 the-drivers — five names, and the honest version is that you will use two of them. The table
// exists so that the other three are recognisable rather than mysterious, and so `host` mode's real
// trade-off is stated: it is not "faster networking", it is no network namespace at all, which
// means no port mapping, no isolation, and a port conflict with the host.
export const networkDrivers: Scene = {
  id: 'network-drivers',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'Five drivers — and you will use the first one almost always',
      sub: 'docker network ls shows what exists; the driver is chosen at create time',
      headers: ['Driver', 'What it does', 'Reach for it when'],
      values: [
        ['bridge', 'a virtual switch + NAT, own namespace', 'essentially always — and make your OWN'],
        ['host', 'NO namespace: the host’s stack, directly', 'a proxy or monitor that must see real client IPs'],
        ['none', 'a namespace with only loopback', 'a batch job that must not reach the network'],
        ['overlay', 'a bridge spanning several hosts, VXLAN', 'Swarm. In Kubernetes this is the CNI’s job'],
        ['macvlan', 'its own MAC on the physical LAN', 'legacy software that must look like a real host'],
      ],
    },
    {
      id: 'hostnote',
      label: 'host mode is not “faster networking”',
      pattern: 'group',
      icon: 'warn',
      flow: 'LR',
      children: [
        { id: 'h1', label: 'no port mapping at all', pattern: 'warn', icon: 'ban', sub: '-p is ignored; the app binds the host’s ports directly' },
        { id: 'h2', label: 'so ports collide', pattern: 'warn', icon: 'swap', sub: 'two containers cannot both use 80 any more' },
        { id: 'h3', label: 'and no isolation', pattern: 'warn', icon: 'skull', sub: 'it can reach anything the host can, including localhost' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'table', target: 'hostnote' }],
}
