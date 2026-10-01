import type { Scene } from '@graphlearning/flow'

// §7/§8 — two different answers to "uid 0 inside is uid 0 outside", and people conflate them.
// userns-remap keeps a root daemon and maps CONTAINER uids to a harmless host range. Rootless runs
// the whole daemon as you, so there is no root process in the picture at all. Different trade-offs,
// and rootless has real functional costs worth stating plainly.
export const usernsRootless: Scene = {
  id: 'userns-rootless',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'two',
      label: 'Two ways to stop uid 0 inside being uid 0 outside',
      pattern: 'group',
      icon: 'swap',
      flow: 'LR',
      children: [
        {
          id: 'remap',
          label: 'userns-remap — the daemon stays root',
          pattern: 'group',
          icon: 'funnel',
          flow: 'TB',
          children: [
            { id: 'r1', label: 'daemon.json, one key', pattern: 'network', icon: 'file', sub: '"userns-remap": "default" — then restart dockerd' },
            { id: 'r2', label: 'uid 0 → 231072', pattern: 'service', icon: 'swap', sub: 'container root maps to a harmless host range' },
            { id: 'r3', label: 'but dockerd is still root', pattern: 'warn', icon: 'warn', sub: 'and existing volumes have the wrong ownership now' },
          ],
          edges: [
            { source: 'r1', target: 'r2' },
            { source: 'r2', target: 'r3' },
          ],
        },
        {
          id: 'rootless',
          label: 'rootless — no root process at all',
          pattern: 'group',
          icon: 'shieldcheck',
          flow: 'TB',
          children: [
            { id: 'l1', label: 'dockerd runs as you', pattern: 'service', icon: 'user', sub: 'dockerd-rootless-setuptool.sh install' },
            { id: 'l2', label: 'a daemon bug is your uid', pattern: 'service', icon: 'circlecheck', sub: 'the strongest single improvement available' },
            { id: 'l3', label: 'and things stop working', pattern: 'warn', icon: 'ban', sub: 'ports <1024, some drivers, cgroup limits need v2+systemd' },
          ],
          edges: [
            { source: 'l1', target: 'l2' },
            { source: 'l2', target: 'l3' },
          ],
        },
      ],
      edges: [],
    },
    {
      id: 'pick',
      label: 'Which to actually reach for',
      pattern: 'group',
      icon: 'scale',
      flow: 'LR',
      children: [
        { id: 'p1', label: 'a dev machine → rootless', pattern: 'service', icon: 'circlecheck', sub: 'the costs mostly do not apply, and the win is real' },
        { id: 'p2', label: 'a build host → rootless', pattern: 'service', icon: 'boxes', sub: 'untrusted builds, per-user daemons, no root anywhere' },
        { id: 'p3', label: 'or just USER + cap-drop', pattern: 'network', icon: 'usercheck', sub: 'most of the benefit, none of the disruption (§4–§5)' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'two', target: 'pick' }],
}
