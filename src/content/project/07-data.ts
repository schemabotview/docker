import type { Section } from '../types'

export const data: Section = {
  id: 'data',
  title: 'Data',
  scene: 'mount-types',
  slide: `## A volume, and a restore you've actually tested

Postgres gets a **named volume**, not a bind mount — so Docker seeds the ownership from the image and there's no uid clash (course 6 §4, §8). Redis gets nothing: it's a cache, and losing it is a shrug.

### The backup
No \`docker volume backup\` exists. \`pg_dump\` via \`docker exec\`, because a \`tar\` of a **running** Postgres data directory is a torn copy that may restore into something subtly corrupt (course 6 §9).

### The part that makes it a backup
**Restore it.** Into a scratch volume, start a container against it, count the rows. A backup you have never restored is a file you feel good about.

### And the trap this stack hit
\`compose down -v\` during development deleted the volume — silently, no confirmation (course 8 §5). That's fine for dev data. It is the reason \`-v\` should be typed deliberately, and the reason anything that matters gets \`external: true\` so a stray \`down -v\` can't reach it.`,
  narration:
    "The database needs to survive. Course six had the whole argument; this is what it looks like applied. Postgres gets a named volume rather than a bind mount, and the reason is specific: Docker seeds a fresh volume with the image's content and ownership, so the Postgres data directory is owned by the uid Postgres expects, and there's no host user in the picture to disagree with. A bind mount would have produced the uid mismatch from course six section eight, on the first run, with an error message about permissions that doesn't mention uids at all. Redis gets no volume. It's a cache; losing it on restart is a shrug, and adding persistence you don't need is complexity with a maintenance cost. That decision is worth making explicitly rather than by default in either direction. The backup. There is no docker volume backup command, and the technique from course six is a throwaway container that can see both the volume and a host directory, with a tar between them. But for Postgres specifically, don't do that. A tar of a running database's data directory captures files at slightly different instants, which is a torn copy — it may restore fine, or it may restore into something subtly corrupt that you discover three weeks later, which is considerably worse. So: pg_dump, through docker exec, which produces a logically consistent snapshot the database vendor supports. The tar technique is right for the uploads directory and wrong for the database, and knowing which is which is the section. And then the part everybody skips, which is the part that makes it a backup rather than a file: restore it. Create a scratch volume, restore the dump into it, start a Postgres container against it, and count the rows. Do that when you set the backup up, and periodically afterwards, because the ways a backup silently stops working are endless — a renamed volume, a changed path, a cron job whose image was pruned. The restore is the only thing that proves any of it, and it's cheap here in a way it isn't with physical infrastructure. Finally, the trap this stack actually hit during development, and it's worth the honesty. Someone ran docker compose down dash v to clean up a stuck stack, and the volume went with it. No confirmation, no listing, no undo. For development data that's a shrug and a re-seed. It's also exactly why course eight said to treat down dash v as a destructive command and type it deliberately. And there's a defence for anything that matters: declare the volume as external true in the Compose file. Then Compose uses it but never creates or removes it, and a stray down dash v cannot reach it. That's one line, and on a stack holding anything you'd miss, it's worth it. Next: both architectures.",
}
