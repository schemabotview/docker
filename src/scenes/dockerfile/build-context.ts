import type { Scene } from '@graphlearning/flow'

// §5 the-build-context — the argument at the end of `docker build .` is not a working directory.
// It is a DIRECTORY THAT GETS UPLOADED, in full, to the daemon before the first instruction runs.
// Which is why a build in a repo with a 2 GB .git and a node_modules takes forty seconds before it
// prints anything, why COPY cannot reach ../secrets, and why .dockerignore is a build-speed tool
// rather than a tidiness one.
export const buildContext: Scene = {
  id: 'build-context',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'send',
      label: 'docker build . — the dot is uploaded before anything runs',
      pattern: 'group',
      icon: 'workflow',
      flow: 'LR',
      children: [
        {
          id: 'dir',
          label: 'your directory',
          pattern: 'user',
          icon: 'folder',
          sub: '.git 2 GB · node_modules 400 MB · src 4 MB · .env',
        },
        {
          id: 'ignore',
          label: '.dockerignore',
          pattern: 'service',
          icon: 'funnel',
          sub: 'filters BEFORE the upload — same syntax as .gitignore',
        },
        {
          id: 'up',
          label: 'sent to the daemon',
          pattern: 'network',
          icon: 'cloud',
          sub: '"Sending build context" — 4 MB instead of 2.4 GB',
        },
      ],
      edges: [
        { source: 'dir', target: 'ignore' },
        { source: 'ignore', target: 'up' },
      ],
    },
    {
      id: 'rules',
      label: 'Three consequences, all of them things people hit',
      pattern: 'group',
      icon: 'brain',
      flow: 'LR',
      children: [
        {
          id: 'r1',
          label: 'COPY cannot escape it',
          pattern: 'warn',
          icon: 'ban',
          sub: 'COPY ../secret fails — it was never uploaded',
        },
        {
          id: 'r2',
          label: 'secrets get uploaded',
          pattern: 'warn',
          icon: 'key',
          sub: '.env goes to the daemon even if no COPY names it',
        },
        {
          id: 'r3',
          label: 'and it breaks the cache',
          pattern: 'warn',
          icon: 'zap',
          sub: 'COPY . . with no ignore file busts on every log write',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'send', target: 'rules' }],
}
