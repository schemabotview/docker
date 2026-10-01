import type { Section } from '../types'

export const pruning: Section = {
  id: 'pruning',
  title: 'Pruning, carefully',
  scene: 'prune-table',
  slide: `## "Unused" means something different in each one

### Look before you delete
\`docker system df -v\` — per-object sizes and a \`RECLAIMABLE\` column. The disk is usually in **stopped containers** or the **build cache**, not in images.

### The distinctions that matter
- \`image prune\` — **dangling** only: untagged, unreferenced. Safe, frees little
- \`image prune -a\` — every image **no container uses**. A *stopped* container counts as a user, so this deletes far more than it sounds like
- \`builder prune\` — the BuildKit cache. Nothing is lost; the next build is slow
- \`volume prune\` — **this is your database.** Read the list before confirming

### The one that ends careers
\`docker system prune -a --volumes\` on a host where a database volume was momentarily unreferenced.

### On a CI host, automate it
\`--filter "until=168h"\` keeps anything touched this week. Run it on a timer, not in a panic at 2am.`,
  narration:
    "Docker fills disks. Not because it is wasteful, but because every build produces layers, every container keeps a writable layer until it is removed, and the build cache grows without limit by default. Eventually a host runs out of space, and the reflex is to reach for prune. This section is about doing that without deleting something you needed. Start with the discipline: look first. Docker system df, with dash v, breaks the usage down by object and gives you a reclaimable column. Almost every time, the disk is not where people assume. Images are the visible thing, so images get blamed, but the space is usually in stopped containers — each holding a writable layer nobody thought about — or in the BuildKit cache on a machine that builds a lot. Knowing which it is tells you which command to run, and often lets you free forty gigabytes with something completely safe. Now the commands, and the point of the table is that unused means something different in every one of them. Docker image prune, plain, removes dangling images only. A dangling image is one with no tag and nothing referencing it — usually the leftover of a build whose tag got moved to a newer image. It is safe, and it frees less than you were hoping for. Docker image prune dash a is a different animal. It removes every image that no container is using — and that word container includes stopped containers. So an image you pulled this morning and ran once, where the container has exited but still exists, is protected. An image you pulled and never ran is gone. On a machine where you have tidied up your containers, dash a will remove almost everything and your next builds and runs will re-download it all. That is annoying rather than dangerous, but on a slow link or an air-gapped host it is a genuinely bad afternoon. Docker container prune removes all stopped containers, and with them their writable layers — which is the space you were looking for. Worth knowing that anything written inside those containers and not in a volume goes with them. Docker builder prune clears the BuildKit cache. This is the safest large win available: nothing is lost that cannot be recomputed, and the only cost is that the next build is slow. On a busy CI host this is routinely the single biggest item. Docker volume prune deletes volumes that no container references, and this is the one to be careful with. Volumes are where the data lives — your Postgres data directory, your uploaded files. A volume becomes unreferenced the moment the container using it is removed, which happens routinely with docker compose down. So there is a window in which your production data looks exactly like garbage to this command. Read the list it prints. Read it twice. And then docker system prune dash a dash dash volumes, which combines every one of the above. It is the command people run at two in the morning when a disk is full, and it is the one that occasionally deletes a database. If you take one thing from this section: never run that combination in a hurry on a host you do not fully understand. The good habit is to make this boring. On a CI host, run docker system prune with a filter — until equals 168h keeps anything touched in the last week — on a schedule, so the disk never gets full and nobody ever has to make this decision under pressure. Next: moving an image without a registry.",
}
