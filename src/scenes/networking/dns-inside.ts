import type { Scene } from '@graphlearning/flow'

// §9 dns-and-resolution — where a container's name lookups actually go, because the answer explains
// both the "works on my laptop, not in CI" DNS failures and the reason 127.0.0.11 shows up in
// resolv.conf and looks alarming. Docker writes that file; the resolver at that address answers for
// container names and forwards everything else.
export const dnsInside: Scene = {
  id: 'dns-inside',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'chain',
      label: 'One lookup inside a container, followed all the way out',
      pattern: 'group',
      icon: 'search',
      flow: 'LR',
      children: [
        {
          id: 'a1',
          label: 'the app resolves “db”',
          pattern: 'user',
          icon: 'terminal',
          sub: 'an ordinary getaddrinfo call — nothing Docker-aware',
        },
        {
          id: 'a2',
          label: '/etc/resolv.conf',
          pattern: 'network',
          icon: 'file',
          sub: 'written by Docker: nameserver 127.0.0.11',
        },
        {
          id: 'a3',
          label: 'the embedded resolver',
          pattern: 'service',
          icon: 'router',
          sub: 'knows every container name on this network',
        },
        {
          id: 'a4',
          label: 'otherwise forwarded',
          pattern: 'external',
          icon: 'globe',
          sub: 'to the host’s resolvers, or --dns if you set one',
        },
      ],
      edges: [
        { source: 'a1', target: 'a2' },
        { source: 'a2', target: 'a3' },
        { source: 'a3', target: 'a4', label: 'not a container name' },
      ],
    },
    {
      id: 'gotchas',
      label: 'Three DNS surprises, all of them real',
      pattern: 'group',
      icon: 'warn',
      flow: 'LR',
      children: [
        {
          id: 'g1',
          label: '127.0.0.11 is not a bug',
          pattern: 'network',
          icon: 'circlecheck',
          sub: 'it is the resolver, inside this container’s namespace only',
        },
        {
          id: 'g2',
          label: 'the host’s VPN resolvers',
          pattern: 'warn',
          icon: 'swap',
          sub: 'are inherited — so internal names work only on the VPN',
        },
        {
          id: 'g3',
          label: 'a search domain guesses',
          pattern: 'warn',
          icon: 'funnel',
          sub: 'db resolves as db.corp.example before failing — slowly',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'chain', target: 'gotchas' }],
}
