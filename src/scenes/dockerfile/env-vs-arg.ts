import type { Scene } from '@graphlearning/flow'

// §7 env-vs-arg — two variables that look the same and live in different times. ARG exists only
// while the build runs; ENV is written into the image config and exists at run time too. The trap
// is that people reach for ARG to pass a secret because "it does not end up in the image" — and it
// does, in the build history, in plain text, forever (course 3 §5).
export const envVsArg: Scene = {
  id: 'env-vs-arg',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'times',
      label: 'Two different times — that is the whole distinction',
      pattern: 'group',
      icon: 'clock',
      flow: 'LR',
      children: [
        {
          id: 'arg',
          label: 'ARG — build time only',
          pattern: 'group',
          icon: 'workflow',
          flow: 'TB',
          children: [
            { id: 'a1', label: 'ARG VERSION=1.4', pattern: 'service', icon: 'pencil', sub: 'declared in the Dockerfile, with a default' },
            { id: 'a2', label: '--build-arg VERSION=2', pattern: 'network', icon: 'terminal', sub: 'overridden per build from the command line' },
            { id: 'a3', label: 'gone at run time', pattern: 'external', icon: 'circleslash', sub: 'the process never sees it in its environment' },
          ],
          edges: [
            { source: 'a1', target: 'a2' },
            { source: 'a2', target: 'a3' },
          ],
        },
        {
          id: 'env',
          label: 'ENV — build time AND run time',
          pattern: 'group',
          icon: 'package',
          flow: 'TB',
          children: [
            { id: 'e1', label: 'ENV NODE_ENV=prod', pattern: 'service', icon: 'pencil', sub: 'written into the image config, permanently' },
            { id: 'e2', label: 'later instructions see it', pattern: 'network', icon: 'layers', sub: 'every RUN below this line has it set' },
            { id: 'e3', label: 'and so does the process', pattern: 'network', icon: 'box', sub: 'overridable at run with -e (course 2 §7)' },
          ],
          edges: [
            { source: 'e1', target: 'e2' },
            { source: 'e2', target: 'e3' },
          ],
        },
      ],
      edges: [],
    },
    {
      id: 'trap',
      label: 'The trap: ARG is NOT a secret mechanism',
      pattern: 'group',
      icon: 'skull',
      flow: 'LR',
      children: [
        { id: 't1', label: 'it is in the history', pattern: 'warn', icon: 'search', sub: 'docker history shows the value, in plain text' },
        { id: 't2', label: 'and it travels', pattern: 'warn', icon: 'cloud', sub: 'to everyone who can pull the image' },
        { id: 't3', label: 'the real answer', pattern: 'service', icon: 'lock', sub: 'RUN --mount=type=secret — course 5 §5' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'times', target: 'trap' }],
}
