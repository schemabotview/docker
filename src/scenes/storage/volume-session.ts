import type { Scene } from '@graphlearning/flow'

// §4 named-volumes — the commands, plus the one behaviour that makes volumes different from every
// other mount and that nobody documents prominently: an EMPTY named volume mounted over a path that
// has content in the image is SEEDED from the image. A bind mount never does this. It is why a
// Postgres volume works first time, and why a stale volume keeps serving yesterday's files.
export const volumeSession: Scene = {
  id: 'volume-session',
  title: 'Named volumes — and the seeding rule',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '$ docker volume create pgdata',
        '$ docker run -d -v pgdata:/var/lib/postgresql/data postgres:16',
        '#           ^^^^^^^ a NAME, not a path — that is what makes it a volume',
        '',
        '$ docker volume inspect pgdata --format "{{.Mountpoint}}"',
        '/var/lib/docker/volumes/pgdata/_data',
        '#   real, and NOT yours to edit. On Desktop it is inside the VM,',
        '#   so that path does not even exist on your Mac.',
        '',
        '# THE SEEDING RULE — volumes only, and only when EMPTY:',
        '#   mount an empty volume over a path that has files in the image',
        '#   -> the image content is COPIED into the volume, once',
        '#   mount a NON-empty volume -> nothing is copied; the volume wins',
        '#   a BIND mount -> never seeds; it always hides what was there',
        '',
        '# Which is why this bites: rebuild the image with new seed data,',
        '# rerun, and the old volume still serves yesterday. Remove it:',
        '$ docker volume rm pgdata          # refuses while a container uses it',
        '',
        '$ docker volume ls -f dangling=true    # referenced by nothing',
        '$ docker run --rm -v pgdata:/d alpine ls /d   # look inside safely',
      ].join('\n'),
    },
  ],
  edges: [],
}
