import type { Scene } from '@graphlearning/flow'

// §3 namespaces — the isolation half of a container, and the half that surprises people, because a
// namespace does not hide anything from the host. It gives a process a different VIEW of one kernel
// resource. Same kernel, same process table, same network stack — but the container asks "what
// processes exist?" and the kernel answers with its own pid namespace's answer, which begins at 1.
//
// One kernel band across the bottom, two namespaced views above it, and the SAME process appearing
// under two different pids — the detail that makes the word "view" land. The host column is what
// stops the mental model becoming "a little box the host cannot see into".
export const namespaceViews: Scene = {
  id: 'namespace-views',
  padding: 0.08,
  nodes: [
    {
      id: 'host',
      label: 'One Linux kernel · one real process table',
      pattern: 'group',
      icon: 'gears',
      flow: 'TB',
      children: [
        {
          id: 'views',
          label: 'Two containers — each a set of namespaced views',
          pattern: 'group',
          icon: 'boxes',
          flow: 'LR',
          children: [
            {
              id: 'ct1',
              label: 'Container A',
              pattern: 'group',
              icon: 'box',
              cols: 2,
              children: [
                { id: 'a-pid', label: 'pid: nginx is 1', pattern: 'network', icon: 'gitbranch', sub: 'its own process tree, rooted at 1' },
                { id: 'a-mnt', label: 'mnt: / is its image', pattern: 'network', icon: 'folder', sub: 'a different root filesystem' },
                { id: 'a-net', label: 'net: eth0 172.17.0.2', pattern: 'network', icon: 'network', sub: 'own interfaces, routes, iptables' },
                { id: 'a-uts', label: 'uts: hostname 3f2a', pattern: 'network', icon: 'tag', sub: 'its own hostname and domain' },
              ],
            },
            {
              id: 'ct2',
              label: 'Container B',
              pattern: 'group',
              icon: 'box',
              cols: 2,
              children: [
                { id: 'b-pid', label: 'pid: redis is 1', pattern: 'network', icon: 'gitbranch', sub: 'also 1 — the numbers are per-view' },
                { id: 'b-mnt', label: 'mnt: / is its image', pattern: 'network', icon: 'folder', sub: 'cannot see A’s files' },
                { id: 'b-net', label: 'net: eth0 172.17.0.3', pattern: 'network', icon: 'network', sub: 'a separate stack, not a shared one' },
                { id: 'b-ipc', label: 'ipc: own shm, queues', pattern: 'network', icon: 'share', sub: 'plus user: uid mapping' },
              ],
            },
          ],
          edges: [],
        },
        {
          id: 'real',
          label: 'What the host actually sees · ps aux on the host',
          pattern: 'group',
          icon: 'search',
          flow: 'LR',
          children: [
            { id: 'h1', label: 'pid 4417 nginx', pattern: 'external', icon: 'box', sub: 'container A’s pid 1, real number' },
            { id: 'h2', label: 'pid 4489 redis', pattern: 'external', icon: 'box', sub: 'container B’s pid 1, real number' },
            { id: 'h3', label: 'pid 812 dockerd', pattern: 'external', icon: 'gears', sub: 'ordinary processes, all of them' },
          ],
          edges: [],
        },
      ],
      edges: [{ source: 'views', target: 'real', label: 'same processes, un-namespaced' }],
    },
  ],
  edges: [],
}
