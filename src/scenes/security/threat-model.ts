import type { Scene } from '@graphlearning/flow'

// §1 the-threat-model (reused by §12 you-are-here) — the SPINE. The single sentence that organises
// the whole course: a container is a process the kernel is confining, so the kernel is both the
// only thing protecting the host AND the shared surface an escape has to cross. Everything else in
// the course is either reducing what a compromised container can ask the kernel for, or reducing
// what it starts out holding.
export const threatModel: Scene = {
  id: 'threat-model',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'shape',
      label: 'A container is a process the kernel is confining — that cuts both ways',
      pattern: 'group',
      icon: 'shieldcheck',
      flow: 'LR',
      children: [
        {
          id: 'ct',
          label: 'your process',
          pattern: 'service',
          icon: 'box',
          sub: 'an ordinary host process in namespaces and a cgroup',
        },
        {
          id: 'kernel',
          label: 'ONE shared kernel',
          pattern: 'warn',
          icon: 'gears',
          sub: 'the only wall — and it is the wall you are sharing',
        },
        {
          id: 'host',
          label: 'the host, and all of it',
          pattern: 'external',
          icon: 'server',
          sub: 'other containers, their data, the daemon, your cloud creds',
        },
      ],
      edges: [
        { source: 'ct', target: 'kernel', label: 'syscalls' },
        { source: 'kernel', target: 'host' },
      ],
    },
    {
      id: 'ways',
      label: 'Three ways it actually goes wrong — in frequency order',
      pattern: 'group',
      icon: 'skull',
      flow: 'LR',
      children: [
        {
          id: 'w1',
          label: '1 · you handed it over',
          pattern: 'warn',
          icon: 'plug',
          sub: 'the docker socket, --privileged, a host bind mount (§3)',
        },
        {
          id: 'w2',
          label: '2 · uid 0 plus a bug',
          pattern: 'warn',
          icon: 'usercheck',
          sub: 'root inside is root outside unless you changed that (§2)',
        },
        {
          id: 'w3',
          label: '3 · a kernel escape',
          pattern: 'network',
          icon: 'bug',
          sub: 'real, and much rarer than the two above',
        },
      ],
      edges: [],
    },
    {
      id: 'plan',
      label: 'So the course is two questions',
      pattern: 'group',
      icon: 'brain',
      flow: 'LR',
      children: [
        { id: 'q1', label: 'what does it start with?', pattern: 'service', icon: 'key', sub: 'uid, capabilities, mounts — §2 to §7' },
        { id: 'q2', label: 'what can it ask for?', pattern: 'service', icon: 'funnel', sub: 'syscalls, writes, privileges — §6 and §9 to §10' },
      ],
      edges: [],
    },
  ],
  edges: [
    { source: 'shape', target: 'ways' },
    { source: 'ways', target: 'plan' },
  ],
}
