import type { Section } from '../types'

export const backupRestoreMigrate: Section = {
  id: 'backup-restore-migrate',
  title: 'Backup, restore, migrate',
  scene: 'backup-session',
  slide: `## There is no \`docker volume backup\`

People look for one. The technique instead: a volume is a directory, so run a **throwaway container** that can see both the volume and a host directory, and \`tar\` between them.

\`\`\`bash
docker run --rm -v pgdata:/from:ro -v "$(pwd)":/to \\
  alpine tar czf /to/pgdata.tgz -C /from .
\`\`\`

Restore is the same, reversed. Migrating between hosts is tar → \`ssh\` → untar, and can be one pipeline.

### The caveat is not optional
Tarring a **running** database gives you a torn copy — files captured at different instants. It may restore. It may restore into something subtly corrupt, which is worse.

**Stop the container first**, or use the database's own tool: \`docker exec pg pg_dump …\`.

### And test the restore
A backup you have never restored is not a backup. Restore it into a scratch volume and start a container against it — that's the only thing that proves it.`,
  narration:
    "You have a volume with your data in it. How do you back it up? The first thing people do is look for docker volume backup, and there isn't one. There's no export command either. This looks like an omission and it's actually a reasonable design decision: Docker doesn't know what's in your volume or what a consistent copy of it would mean, so it doesn't pretend to. What there is, is a technique, and it's the section. A volume is a directory. You can't easily reach it from the host — it's under Docker's directory on Linux, and inside a VM on Desktop. But you can reach it from a container, trivially. So: run a throwaway container that mounts both the volume and a host directory, and tar from one to the other. Docker run dash dash rm, dash v the volume at slash from with colon r-o for safety, dash v your current directory at slash to, then alpine, then tar czf into slash to, minus C slash from, dot. The container exists for two seconds and its entire purpose is to be a process that can see both sides. Restore is the same shape reversed: create a fresh volume, mount it and the directory holding your tarball, and untar. And migration between hosts is tar, copy, untar — which can be a single pipeline if you like, tar to stdout on one host, through ssh, into tar on stdin on the other, with no intermediate file. It looks clever and it's just the same technique. Now the caveat, and I want to be blunt because this is where people get hurt. Tarring a running database's data directory does not give you a backup. It gives you a set of files captured at slightly different instants while the database was busy modifying them — a torn copy. Sometimes it restores fine. Sometimes it restores into a database that looks healthy and has subtle corruption you discover three weeks later, which is considerably worse than a backup that obviously failed. So for a database, one of two things. Either stop the container first, take the tar, start it again — perfectly good for a development database or anything with a maintenance window. Or use the database's own tool, which knows how to produce a consistent snapshot of a live system: docker exec into the container and run pg_dump, or mysqldump, or whatever the engine provides. That's a logical backup rather than a file copy, and it's what the database vendor supports. For application data that isn't a database — uploaded files, generated assets — the tar approach is fine as it stands, because those files aren't being rewritten in place under you. And then the part everybody skips. Test the restore. A backup you have never restored is not a backup; it's a file you feel good about. Restoring is cheap here — make a scratch volume, untar into it, start a container against it, and check the data is there. Do that once when you set the backup up, and periodically after, because the ways backups silently stop working are endless: a volume renamed, a path changed, a cron job whose container image was removed. The restore is the only thing that proves any of it. One section left: let's put the course together.",
}
