import type { Scene } from '@graphlearning/flow'

// §5 capabilities — root is not one thing. Linux splits it into ~40 distinct privileges, and Docker
// already drops most of them by default, which is why "root in a container" is weaker than root on
// the host even before you do anything. The move is drop-all-then-add, and NET_BIND_SERVICE is the
// one people actually need.
export const capabilities: Scene = {
  id: 'capabilities',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'root is ~40 separate privileges, and Docker already drops most',
      sub: '--cap-drop=ALL then --cap-add the one or two you actually need',
      headers: ['Capability', 'Lets a process', 'Default in Docker'],
      values: [
        ['NET_BIND_SERVICE', 'bind ports below 1024', 'granted — and usually the only one needed'],
        ['CHOWN / FOWNER', 'change file ownership and bypass its checks', 'granted'],
        ['SETUID / SETGID', 'drop privilege — what an entrypoint does', 'granted'],
        ['KILL', 'signal any process', 'granted'],
        ['SYS_ADMIN', 'mount, and a hundred other things', 'DROPPED — the one --privileged restores'],
        ['SYS_PTRACE', 'attach to and read another process', 'DROPPED — add it only to debug'],
        ['NET_ADMIN', 'change interfaces, routes and iptables', 'DROPPED'],
        ['SYS_MODULE', 'load a kernel module', 'DROPPED — this one is game over'],
      ],
    },
    {
      id: 'moves',
      label: 'The two moves',
      pattern: 'group',
      icon: 'wrench',
      flow: 'LR',
      children: [
        {
          id: 'm1',
          label: '--cap-drop=ALL',
          pattern: 'service',
          icon: 'circlecheck',
          sub: 'then add back what breaks — usually nothing, or NET_BIND_SERVICE',
        },
        {
          id: 'm2',
          label: 'never --privileged',
          pattern: 'warn',
          icon: 'skull',
          sub: 'every capability, all devices, no seccomp — not “a bit more”',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'table', target: 'moves' }],
}
