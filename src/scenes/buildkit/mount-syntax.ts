import type { Scene } from '@graphlearning/flow'

// §4/§5 companion transcript — the actual syntax, because `RUN --mount` has enough punctuation that
// seeing it written once is worth more than describing it. The `id` matching between the CLI flag
// and the mount is the part people get wrong, and the failure is a file that is simply not there.
export const mountSyntax: Scene = {
  id: 'mount-syntax',
  title: 'RUN --mount — cache, secret, ssh',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'Dockerfile',
      label: [
        '# syntax=docker/dockerfile:1      <- REQUIRED for --mount to parse',
        '',
        '# A package cache that survives a cache MISS:',
        'RUN --mount=type=cache,target=/root/.npm \\',
        '    npm ci',
        '#   the dir persists across builds; it is NOT in any layer',
        '#   sharing=locked if two builds must not use it at once',
        '',
        '# A secret, as a file, for exactly one instruction:',
        'RUN --mount=type=secret,id=npmtoken \\',
        '    NPM_TOKEN=$(cat /run/secrets/npmtoken) npm ci',
        '',
        '#   and on the command line, the id must MATCH:',
        '#   docker build --secret id=npmtoken,env=NPM_TOKEN .',
        '#   docker build --secret id=npmtoken,src=./token.txt .',
        '',
        '# An ssh agent, for a private git dependency:',
        'RUN --mount=type=ssh git clone git@github.com:acme/lib.git',
        '#   docker build --ssh default .',
        '',
        '# Nothing above appears in docker history. Compare with:',
        'ARG NPM_TOKEN            # <- in the history, in plain text, shipped',
      ].join('\n'),
    },
  ],
  edges: [],
}
