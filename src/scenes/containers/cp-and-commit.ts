import type { Scene } from '@graphlearning/flow'

// §10 moving-data-and-state — two commands that both move bytes out of a container and are morally
// opposite. `docker cp` is a legitimate debugging tool: copy a file out, look at it, move on.
// `docker commit` freezes a container's writable layer into a new image, and it is here so that it
// can be recognised and NOT used: the resulting image has no record of how it was made, so nobody —
// including whoever made it — can reproduce or audit it.
//
// Two bands, and the second one deliberately ends at the Dockerfile rather than at the image, which
// is the actual advice.
export const cpAndCommit: Scene = {
  id: 'cp-and-commit',
  padding: 0.09,
  // Three bands STACKED. Left to the default the three top-level groups sat side by side — nine
  // cards wide, 4.2:1, and 10pt type.
  flow: 'TB',
  nodes: [
    {
      id: 'cp',
      label: 'docker cp — fine, and genuinely useful',
      pattern: 'group',
      icon: 'copy',
      flow: 'LR',
      children: [
        { id: 'host1', label: 'host filesystem', pattern: 'external', icon: 'harddrive', sub: 'your machine, or the daemon’s' },
        { id: 'ct1', label: 'the container', pattern: 'service', icon: 'box', sub: 'works even when it is EXITED' },
        { id: 'use', label: 'what it is for', pattern: 'network', icon: 'bug', sub: 'pull a core dump or a config out to read it' },
      ],
      edges: [
        { source: 'host1', target: 'ct1', label: 'cp in' },
        { source: 'ct1', target: 'use', label: 'cp out' },
      ],
    },
    {
      id: 'commit',
      label: 'docker commit — recognise it, then do not use it',
      pattern: 'group',
      icon: 'ban',
      flow: 'LR',
      children: [
        {
          id: 'ct2',
          label: 'a live container',
          pattern: 'service',
          icon: 'box',
          sub: 'hours of undocumented changes in its upperdir',
        },
        {
          id: 'img',
          label: 'a new image',
          pattern: 'warn',
          icon: 'skull',
          sub: 'one opaque layer · no record of what is in it',
        },
        {
          id: 'why',
          label: 'why it is a trap',
          pattern: 'warn',
          icon: 'circleslash',
          sub: 'unreproducible, unauditable, and undiffable in review',
        },
      ],
      edges: [
        { source: 'ct2', target: 'img', label: 'freezes it' },
        { source: 'img', target: 'why' },
      ],
    },
    {
      id: 'instead',
      label: 'The reproducible way to reach the same image',
      pattern: 'group',
      icon: 'circlecheck',
      flow: 'LR',
      children: [
        { id: 'df', label: 'a Dockerfile', pattern: 'service', icon: 'filecode', sub: 'in version control, reviewable line by line' },
        { id: 'bld', label: 'docker build', pattern: 'service', icon: 'workflow', sub: 'anyone can run it and get the same thing' },
      ],
      edges: [{ source: 'df', target: 'bld', label: 'course 4' }],
    },
  ],
  edges: [
    { source: 'cp', target: 'commit', label: 'and the one beside it, which is not' },
    { source: 'commit', target: 'instead', label: 'what to do instead' },
  ],
}
