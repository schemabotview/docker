import type { Scene } from '@graphlearning/flow'

// §3 run — the instruction that produces essentially all of an image's size, and the three habits
// that decide whether that size is justified. The `apt-get update` split is a correctness bug, not
// a style preference: update and install in separate RUNs means the cached update layer can be
// months old while install is re-run, and you get "404 Not Found" on a package that exists.
export const runLayers: Scene = {
  id: 'run-layers',
  title: 'RUN — one layer each, and the three habits that matter',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'Dockerfile',
      label: [
        '# WRONG — three layers, and a latent correctness bug',
        'RUN apt-get update                  # layer A: a package index',
        'RUN apt-get install -y curl         # layer B: cached A may be stale',
        'RUN rm -rf /var/lib/apt/lists/*     # layer C: hides A, ships it anyway',
        '',
        '# RIGHT — one layer, and update is always fresh alongside install',
        'RUN apt-get update && \\',
        '    apt-get install -y --no-install-recommends curl ca-certificates && \\',
        '    rm -rf /var/lib/apt/lists/*',
        '',
        '# Why each piece is there:',
        '#   &&                        one RUN = one layer = one net result',
        '#   --no-install-recommends   skips "suggested" packages; often 100s of MB',
        '#   rm -rf .../lists          the index is useless at runtime — 40 MB',
        '',
        '# Shell form vs exec form — RUN has both, and they differ:',
        'RUN echo $HOME && ls | wc -l        # shell form: a shell interprets it',
        'RUN ["/usr/bin/somebin", "--flag"]  # exec form: no shell, no $ or |',
        '',
        '# Set the shell explicitly when you depend on its behaviour:',
        'SHELL ["/bin/bash", "-eo", "pipefail", "-c"]',
        '#   without -o pipefail, `false | true` SUCCEEDS and the build goes on',
      ].join('\n'),
    },
  ],
  edges: [],
}
