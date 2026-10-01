import type { Scene } from '@graphlearning/flow'

// §9 backup-restore-migrate — there is no `docker volume backup`, and people look for one. The
// technique is the whole section: a volume is a directory, so mount it into a throwaway container
// alongside a host bind mount and tar between them. The database caveat is not optional — a tar of
// a live Postgres data directory is a torn copy that may not restore.
export const backupSession: Scene = {
  id: 'backup-session',
  title: 'A volume is a directory. Tar it.',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '# There is no "docker volume backup". There is this, and it is enough:',
        '$ docker run --rm \\',
        '    -v pgdata:/from:ro \\',
        '    -v "$(pwd)":/to \\',
        '    alpine tar czf /to/pgdata.tgz -C /from .',
        '#   a throwaway container that can see BOTH the volume and your cwd',
        '',
        '# Restore is the same trick, the other way round:',
        '$ docker volume create pgdata-new',
        '$ docker run --rm -v pgdata-new:/to -v "$(pwd)":/from \\',
        '    alpine tar xzf /from/pgdata.tgz -C /to',
        '',
        '# Migrate between hosts: tar, scp, untar. Or straight through:',
        '$ docker run --rm -v pgdata:/d alpine tar cz -C /d . \\',
        '    | ssh host2 "docker run --rm -i -v pgdata:/d alpine tar xz -C /d"',
        '',
        '# THE CAVEAT, and it is not optional:',
        '#   tar-ing a RUNNING database is a torn copy. It may restore. It',
        '#   may restore into something subtly corrupt, which is worse.',
        '#   Stop the container first, or use the database’s own dump tool:',
        '$ docker exec pg pg_dump -U postgres app > app.sql',
        '#   A backup you have never restored is not a backup. Test it.',
      ].join('\n'),
    },
  ],
  edges: [],
}
