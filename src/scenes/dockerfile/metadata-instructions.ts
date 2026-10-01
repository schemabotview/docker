import type { Scene } from '@graphlearning/flow'

// §8 metadata — four instructions that change the config and touch no files, so each is a zero-byte
// layer. The useful framing is what each one is really for, because two of them are widely
// misunderstood: EXPOSE publishes nothing at all (it is documentation the tooling can read), and
// USER is the one line that does the most for security in this whole course.
export const metadataInstructions: Scene = {
  id: 'metadata-instructions',
  title: 'The zero-byte instructions — config, not files',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'Dockerfile',
      label: [
        'EXPOSE 8080',
        '#  Publishes NOTHING. It is documentation, recorded in the config.',
        '#  docker run -P reads it; `docker run` without -p still exposes nothing.',
        '#  Useful anyway: it tells a reader, and Compose, which port to expect.',
        '',
        'LABEL org.opencontainers.image.source="https://github.com/acme/api"',
        'LABEL org.opencontainers.image.revision="$GIT_SHA"',
        '#  The OCI standard label set. `image.source` is what makes a registry',
        '#  link the image back to its repository — worth doing for every image.',
        '',
        'USER 10001:10001',
        '#  The highest-value line in this file. Everything after it, at BUILD',
        '#  time and at RUN time, is this uid. A numeric uid works even where',
        '#  /etc/passwd has no entry — which is the case on distroless.',
        '#  Files must already be owned by it: COPY --chown=10001:10001 . .',
        '',
        'STOPSIGNAL SIGQUIT',
        '#  What docker stop sends instead of SIGTERM. nginx wants SIGQUIT for',
        '#  a graceful drain; the default would kill it mid-request (c2 §3).',
        '',
        'VOLUME /data',
        '#  Declares a mount point, and it is stickier than it looks: every',
        '#  container gets an ANONYMOUS volume there whether you asked or not.',
        '#  Usually better left to `docker run -v` or to Compose.',
      ].join('\n'),
    },
  ],
  edges: [],
}
