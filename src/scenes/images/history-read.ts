import type { Scene } from '@graphlearning/flow'

// §5 inspect-and-history — `docker history` reads an image backwards into the Dockerfile that built
// it, which is both a genuinely useful skill and the reason `ARG` secrets leak: the build command
// for every layer is recorded in the config, in plain text, and travels with the image to anyone
// who can pull it.
//
// A transcript with the two readings annotated: the SIZE column tells you where the bytes went, and
// the CREATED BY column tells you what was run. The `<missing>` ids are worth explaining once,
// because they look like corruption and are not.
export const historyRead: Scene = {
  id: 'history-read',
  title: 'docker history — the image, read backwards',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '$ docker history myapp:1.4 --no-trunc --format \\',
        '    "{{.Size}}\\t{{.CreatedBy}}"        # newest layer FIRST',
        '',
        '0B       CMD ["node" "server.js"]        <- metadata only, 0 bytes',
        '4.1kB    COPY . /app                     <- your source',
        '58.2MB   RUN npm ci --omit=dev           <- where the size went',
        '221B     COPY package*.json ./',
        '0B       WORKDIR /app',
        '0B       ARG NPM_TOKEN=ghp_A1b2C3d4      <- STILL HERE. In the image.',
        '142MB    /bin/sh -c #(nop) ADD file:9f2e… in /   <- the base layer',
        '',
        '# Two readings of the same output:',
        '#   SIZE       -> which instruction is costing you megabytes',
        '#   CREATED BY -> the Dockerfile, recovered. Including your ARG.',
        '',
        '$ docker image inspect myapp:1.4 --format "{{.Config.Cmd}}"',
        '[node server.js]',
        '$ docker image inspect myapp:1.4 --format "{{.RootFS.Layers}}"',
        '[sha256:9f2e… sha256:44c1… sha256:0b7a…]   # the diff_ids, in order',
        '',
        '# "<missing>" in the ID column is not corruption: only the TOP',
        '# layer of a pulled image keeps an id locally. The rest are real.',
      ].join('\n'),
    },
  ],
  edges: [],
}
