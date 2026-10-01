import type { Scene } from '@graphlearning/flow'

// §6 tmpfs and §7 v-vs-mount share this transcript, one purpose each. The -v vs --mount comparison
// is here because of a specific failure: `-v` creates what is missing rather than failing, so a
// typo'd host path becomes a NEW EMPTY VOLUME and the container starts perfectly with no data.
// `--mount` errors instead. That difference is the whole argument for the longer syntax.
export const tmpfsAndSyntax: Scene = {
  id: 'tmpfs-and-syntax',
  title: 'tmpfs, and why --mount is worth the typing',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '# tmpfs — RAM, never a disk, gone when the container stops',
        '$ docker run --tmpfs /tmp:size=64m,mode=1777 myapp',
        '$ docker run --mount type=tmpfs,dst=/tmp,tmpfs-size=64m myapp',
        '#   the size cap matters: without it, it can grow into the',
        '#   container’s MEMORY limit and get you OOM-killed (c2 §6)',
        '#   pairs with --read-only: a read-only rootfs still needs a /tmp',
        '',
        '# -v vs --mount: same three mounts, and one real difference',
        '$ docker run -v pgdata:/data pg        # a NAME  -> named volume',
        '$ docker run -v /srv/x:/data pg        # a PATH  -> bind mount',
        '$ docker run -v /data pg               # neither -> ANONYMOUS volume',
        '',
        '$ docker run --mount type=volume,src=pgdata,dst=/data pg',
        '$ docker run --mount type=bind,src=/srv/x,dst=/data,ro pg',
        '',
        '# The difference that matters — a typo in the host path:',
        '$ docker run -v /srv/dta:/data pg      # creates the dir. Starts EMPTY.',
        '$ docker run --mount type=bind,src=/srv/dta,dst=/data pg',
        'Error: bind source path does not exist: /srv/dta',
        '#   -v invents what is missing. --mount refuses. In production,',
        '#   "started fine with no data" is the worse of the two outcomes.',
      ].join('\n'),
    },
  ],
  edges: [],
}
