import type { Section } from '../types'

export const disk: Section = {
  id: 'disk',
  title: 'Disk',
  scene: 'disk-map',
  slide: `## Four places, and \`docker images\` shows you one

Which is why people delete images and free nothing.

- **images** — the one people look at, and often not the largest
- **containers** — a writable layer **each**, stopped ones included (course 2 §4)
- **volumes** — your data. Never prune these in a hurry (course 3 §8)
- **build cache** — unbounded by default, and usually the **biggest** item on a CI host

### The order to work in
1. \`docker system df -v\` — per object, with a \`RECLAIMABLE\` column
2. \`docker builder prune\` — the safest large win. Nothing is lost; the next build is slow
3. \`docker container prune\`, then images. **Volumes last**, and read the list

### Make it boring
A weekly \`docker system prune --filter "until=168h"\` on a timer, so nobody makes this decision at 2am under pressure.`,
  narration:
    "The disk is full. That's the incident that actually happens, and this section is the map. Bytes go in four places under slash var slash lib slash docker, and docker images shows you one of them — which is why the usual reflex of deleting some images frees a disappointing amount and people conclude Docker is lying about its usage. Images are the visible one, and they're often not the largest. Containers are the second: each one has a writable layer, and that includes stopped containers, which persist until removed. A machine that's been running CI for a few months can have hundreds, each holding whatever its build wrote. Volumes are the third, and those are your data — the one category where the cleanup command is dangerous rather than tedious. And the build cache is the fourth, which is unbounded by default and on any machine that builds regularly is usually the single biggest item. Plus the logs from section three, which live under the containers directory and are the fifth thing, and the one that fills a disk fastest when unrotated. The order to work in matters, because it goes from safest to most dangerous. First, look: docker system df with dash v gives you per-object sizes and, importantly, a reclaimable column telling you how much of each category nothing is using. Read that before you run anything. Second, docker builder prune. That's the safest large win available: it clears the build cache, nothing is lost that can't be recomputed, and the only cost is that the next build is slow. On a CI host this frequently frees more than everything else combined. Third, docker container prune, which removes stopped containers and their writable layers. Then images, where plain image prune only removes dangling ones and dash a removes everything no container references — and remember from course three that a stopped container counts as a reference, so the order of these two matters. And volumes last, deliberately, because volume prune deletes data and the window where your database's volume looks unreferenced is real — it's exactly after a compose down. Read the list it prints before confirming. Now the actual advice, which is to make none of this necessary. Put a prune on a timer. Docker system prune with a filter of until equals 168h keeps anything touched in the last week and removes the rest, and running it weekly means the disk never approaches full and nobody is ever making a deletion decision at two in the morning with a production outage in progress. That's the whole point: every bad prune I've seen was run under pressure by someone who needed space immediately. A scheduled prune removes the pressure. And on a machine that builds a lot, configure BuildKit's own garbage collection with size limits on the builder, so the cache stays bounded by itself rather than needing a command. One last thing worth checking on any host you inherit: the size of slash var slash lib slash docker as a whole, against the size of the filesystem it's on. Some installations put it on the root filesystem with everything else, so Docker filling up means the system filling up. Moving it to its own volume is a small change that turns a host-wide outage into a Docker-only one. Next: what to do when something breaks.",
}
