import type { Scene } from '@graphlearning/flow'

// §11 secrets — four ways to get a credential into a container, three of which leak, and the leaks
// are all in different places. The point is not "use secrets" but that ENV is visible to anyone who
// can reach the API, and a build ARG is in the image forever — two facts already established in
// earlier courses and now collected.
export const secretsPaths: Scene = {
  id: 'secrets-paths',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'bad',
      label: 'Three that leak, and where each one leaks to',
      pattern: 'group',
      icon: 'skull',
      flow: 'LR',
      children: [
        {
          id: 'b1',
          label: 'baked into the image',
          pattern: 'warn',
          icon: 'package',
          sub: 'in a layer forever — everyone who can pull it has it',
        },
        {
          id: 'b2',
          label: 'ARG at build time',
          pattern: 'warn',
          icon: 'workflow',
          sub: 'in docker history, plain text, and it ships (c3 §5)',
        },
        {
          id: 'b3',
          label: '-e DB_PASSWORD=…',
          pattern: 'warn',
          icon: 'braces',
          sub: 'docker inspect prints it; so do crash dumps and child procs',
        },
      ],
      edges: [],
    },
    {
      id: 'good',
      label: 'The shape that does not: a file, mounted, read once',
      pattern: 'group',
      icon: 'circlecheck',
      flow: 'LR',
      children: [
        {
          id: 'g1',
          label: 'at build time',
          pattern: 'service',
          icon: 'lock',
          sub: 'RUN --mount=type=secret — recorded nowhere (c5 §5)',
        },
        {
          id: 'g2',
          label: 'at run time',
          pattern: 'service',
          icon: 'file',
          sub: 'a file at /run/secrets — Compose secrets, or a tmpfs',
        },
        {
          id: 'g3',
          label: 'images support it',
          pattern: 'service',
          icon: 'database',
          sub: 'the _FILE convention — a path, not the value itself',
        },
      ],
      edges: [],
    },
    {
      id: 'real',
      label: 'And the honest ceiling',
      pattern: 'network',
      icon: 'cloud',
      sub: 'no rotation, no audit — a real secret manager is the next step up',
    },
  ],
  edges: [
    { source: 'bad', target: 'good' },
    { source: 'good', target: 'real' },
  ],
}
