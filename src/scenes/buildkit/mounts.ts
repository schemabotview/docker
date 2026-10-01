import type { Scene } from '@graphlearning/flow'

// §4–§5 cache-mounts and secret-mounts — one mechanism, `RUN --mount`, and the reason it is not
// just a convenience: both of these are things a layer-based builder CANNOT do. A cache mount is
// present during the step and is not committed, so a package cache survives a cache miss without
// being in the image. A secret mount is present as a file for the duration of one RUN and is
// recorded nowhere — which is the actual answer to the ARG problem from course 4 §7.
export const mounts: Scene = {
  id: 'mounts',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'during',
      label: 'RUN --mount — present while the step runs, committed to nothing',
      pattern: 'group',
      icon: 'plug',
      flow: 'LR',
      children: [
        {
          id: 'cache',
          label: 'type=cache',
          pattern: 'service',
          icon: 'harddrive',
          sub: 'a persistent dir — survives a cache MISS, and rebuilds',
        },
        {
          id: 'secret',
          label: 'type=secret',
          pattern: 'service',
          icon: 'key',
          sub: 'a file at /run/secrets/<id>, gone when the step ends',
        },
        {
          id: 'ssh',
          label: 'type=ssh',
          pattern: 'service',
          icon: 'lock',
          sub: 'your agent socket, forwarded — for a private git dep',
        },
        {
          id: 'bind',
          label: 'type=bind',
          pattern: 'network',
          icon: 'link',
          sub: 'read a file from another stage without COPYing it in',
        },
      ],
      edges: [],
    },
    {
      id: 'why',
      label: 'Why a layer-based builder could not do either of these',
      pattern: 'group',
      icon: 'brain',
      flow: 'LR',
      children: [
        {
          id: 'w1',
          label: 'a cache is not an artifact',
          pattern: 'network',
          icon: 'funnel',
          sub: '~/.npm is worth keeping and worth never shipping',
        },
        {
          id: 'w2',
          label: 'a secret must leave no trace',
          pattern: 'warn',
          icon: 'skull',
          sub: 'ARG and ENV are both in the history, forever (c4 §7)',
        },
        {
          id: 'w3',
          label: 'so both must be un-committed',
          pattern: 'service',
          icon: 'circlecheck',
          sub: 'mounted for the step, absent from the layer it produces',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'during', target: 'why' }],
}
