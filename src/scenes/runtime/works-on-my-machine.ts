import type { Scene } from '@graphlearning/flow'

// §1 why-containers — the problem, drawn as the thing that actually goes wrong. ONE artifact, THREE
// hosts, and the row of things each host supplies from its own filesystem. The failure is never the
// code; it is that "the environment" is an unwritten contract, and every host honours a different
// version of it. The container is the fix because it moves that whole row INTO the artifact.
//
// Two bands rather than a fan: the artifact on top, the three hosts side by side beneath it, so the
// eye compares the `sub` lines — which are the entire argument.
export const worksOnMyMachine: Scene = {
  id: 'works-on-my-machine',
  padding: 0.1,
  nodes: [
    {
      id: 'ship',
      label: 'One app, shipped three places',
      pattern: 'group',
      icon: 'package',
      flow: 'TB',
      children: [
        {
          id: 'app',
          label: 'app.py + requirements',
          pattern: 'network',
          icon: 'filecode',
          sub: 'the only thing you actually shipped',
        },
        {
          id: 'hosts',
          label: 'Each host fills in the rest from itself',
          pattern: 'group',
          icon: 'building',
          flow: 'LR',
          children: [
            {
              id: 'dev',
              label: 'Your laptop',
              pattern: 'user',
              icon: 'monitor',
              sub: 'python 3.12 · openssl 3.3 · glibc · works',
            },
            {
              id: 'ci',
              label: 'CI runner',
              pattern: 'service',
              icon: 'repeat',
              sub: 'python 3.9 · pinned image from 2023 · fails',
            },
            {
              id: 'prod',
              label: 'Production host',
              pattern: 'external',
              icon: 'server',
              sub: 'python 3.11 · openssl 1.1 · fails differently',
            },
          ],
        },
      ],
      edges: [{ source: 'app', target: 'hosts', label: 'same bytes' }],
    },
    {
      id: 'fix',
      label: 'The container: ship the row, not just the top box',
      pattern: 'group',
      icon: 'box',
      flow: 'LR',
      children: [
        { id: 'code', label: 'your code', pattern: 'network', icon: 'filecode' },
        { id: 'deps', label: 'libraries', pattern: 'network', icon: 'boxes' },
        { id: 'runtime', label: 'interpreter', pattern: 'network', icon: 'gears' },
        { id: 'sysroot', label: 'system libraries', pattern: 'network', icon: 'layers' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'ship', target: 'fix', label: 'one artifact, no unwritten contract' }],
}
