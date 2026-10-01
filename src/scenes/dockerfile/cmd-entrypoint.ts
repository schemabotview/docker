import type { Scene } from '@graphlearning/flow'

// §10 cmd-vs-entrypoint — four combinations, and people learn them as trivia rather than as one
// rule. The rule: ENTRYPOINT is the command, CMD is its DEFAULT ARGUMENTS, and anything you type
// after the image name on `docker run` REPLACES CMD. Which is exactly why `docker run myimage bash`
// works on an image with only CMD and silently does nothing useful on one with an ENTRYPOINT.
export const cmdEntrypoint: Scene = {
  id: 'cmd-entrypoint',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'The rule: ENTRYPOINT is the command, CMD is its default arguments',
      sub: 'what you type after the image name replaces CMD — never ENTRYPOINT',
      headers: ['In the Dockerfile', 'docker run img', 'docker run img extra'],
      values: [
        ['CMD ["a","b"]', 'a b', 'extra  ← CMD replaced entirely'],
        ['ENTRYPOINT ["a"]', 'a', 'a extra  ← appended'],
        ['ENTRYPOINT ["a"] + CMD ["b"]', 'a b', 'a extra  ← CMD replaced, ENTRYPOINT kept'],
        ['neither', 'the base image’s', 'extra'],
      ],
    },
    {
      id: 'forms',
      label: 'And both have two forms — exec vs shell (course 2 §3)',
      pattern: 'group',
      icon: 'gitbranch',
      flow: 'LR',
      children: [
        {
          id: 'exec',
          label: 'CMD ["node","app.js"]',
          pattern: 'service',
          icon: 'circlecheck',
          sub: 'exec form — your process IS pid 1, and gets SIGTERM',
        },
        {
          id: 'shell',
          label: 'CMD node app.js',
          pattern: 'warn',
          icon: 'ban',
          sub: 'shell form — /bin/sh is pid 1 and swallows the signal',
        },
        {
          id: 'both',
          label: 'the entrypoint script',
          pattern: 'network',
          icon: 'scroll',
          sub: 'ENTRYPOINT a script ending in exec "$@" — setup, then hand over',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'table', target: 'forms' }],
}
