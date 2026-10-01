import type { Scene } from '@graphlearning/flow'

// §7 the-troubleshooting-playbook — a decision tree, because "Docker is broken" is four unrelated
// problems and the value is entirely in separating them before you start reading logs. Each branch
// names the ONE command that answers it, so the first four minutes of an incident are mechanical.
export const troubleshootTree: Scene = {
  id: 'troubleshoot-tree',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'q0',
      label: 'Start: is the DAEMON up?',
      pattern: 'service',
      icon: 'gears',
      sub: 'docker info — if that fails, nothing below it matters',
    },
    {
      id: 'branches',
      label: 'Four branches, and the one command that answers each',
      pattern: 'group',
      icon: 'bug',
      flow: 'LR',
      children: [
        {
          id: 'b1',
          label: 'the daemon',
          pattern: 'warn',
          icon: 'gears',
          sub: 'journalctl -u docker -n 100 · check the disk first',
        },
        {
          id: 'b2',
          label: 'a container',
          pattern: 'network',
          icon: 'box',
          sub: 'docker ps -a for the EXIT CODE, then logs (c2 §4)',
        },
        {
          id: 'b3',
          label: 'a build',
          pattern: 'network',
          icon: 'workflow',
          sub: '--progress=plain --no-cache, and read the first error',
        },
        {
          id: 'b4',
          label: 'the network',
          pattern: 'network',
          icon: 'router',
          sub: 'the four questions in order (c7 §11)',
        },
      ],
      edges: [],
    },
    {
      id: 'first',
      label: 'And the two things to check before anything else',
      pattern: 'group',
      icon: 'search',
      flow: 'LR',
      children: [
        { id: 'f1', label: 'df -h and docker system df', pattern: 'warn', icon: 'harddrive', sub: 'a full disk presents as a dozen unrelated symptoms' },
        { id: 'f2', label: 'docker context ls', pattern: 'warn', icon: 'swap', sub: 'are you even on the machine you think? (c1 §8)' },
      ],
      edges: [],
    },
  ],
  edges: [
    { source: 'q0', target: 'branches' },
    { source: 'branches', target: 'first' },
  ],
}
