import type { Section } from '../types'

export const namedVolumes: Section = {
  id: 'named-volumes',
  title: 'Named volumes',
  scene: 'volume-session',
  slide: `## The seeding rule

Mount an **empty** volume over a path that **has content in the image**, and Docker copies the image's content into the volume — **once**, and including its ownership.

That's why \`-v pgdata:/var/lib/postgresql/data\` works first time despite the volume starting empty. And a **bind mount never does this** — it always just hides what was there.

### Which is also how it bites
Rebuild the image with new seed data, re-run with the same volume — the volume is no longer empty, so **nothing is copied** and you're still serving yesterday's files. \`docker volume rm\` and start again.

### The rest
- \`-v NAME:/path\` = volume · \`-v /host/path:/path\` = bind · \`-v /path\` = **anonymous** volume
- The mountpoint is real, and **not yours to edit** — on Desktop it isn't even on your machine
- To look inside: \`docker run --rm -v vol:/d alpine ls /d\`
- \`volume rm\` refuses while a container references it — **including a stopped one**`,
  narration:
    "Volumes, and one behaviour that explains a lot of confusion in both directions. Start with the commands, which are short. Docker volume create and a name makes one. Docker run with dash v, the name, a colon and a path inside the container mounts it. Docker volume ls lists them, docker volume inspect shows you where it actually lives, docker volume rm removes it. And a volume you didn't create explicitly gets created on first use, which is convenient and is also how people end up with volumes they don't remember. Now the rule that makes volumes different from every other kind of mount, and that most documentation mentions in a sentence you skim past. If you mount an empty named volume over a path that has content in the image, Docker copies the image's content into the volume. Once, at first use. Including the file ownership, which matters enormously and we'll come back to in section eight. This is why Postgres works. You run postgres with a fresh volume at slash var slash lib slash postgresql slash data, and the image's initialisation finds the directory in the state it expects, because Docker seeded it. If mounting simply replaced the path with an empty directory — which is what you'd assume, and what a bind mount actually does — that would fail. Three qualifications. It only happens for volumes, not bind mounts: a bind mount always hides what was at the path, with no copying, ever. It only happens when the volume is empty: a volume with anything in it wins outright and nothing is copied. And it happens once, at first mount. That third point is how the rule bites. You build an image with some seed data — a default config, an initial dataset — and run it. The volume seeds. You improve the seed data, rebuild the image, run again with the same volume. The volume is no longer empty, so nothing is copied, and your container is serving the old files from a volume you'd forgotten was involved. The image is correct. The container is correct. The volume is stale. And nothing in any log mentions it. When new image content mysteriously doesn't appear, check whether a volume is mounted over it, and docker volume rm to start clean. A few practical notes. The dash v syntax decides what kind of mount you get from the shape of the first part: a name gives a volume, something that looks like a path gives a bind mount, and just a container path with nothing before it gives an anonymous volume — a volume with a random hex name that you will never identify again, which is how people accumulate gigabytes of them. Docker volume inspect will tell you the real mountpoint on disk, and it's genuinely there on Linux, but treat it as read-only: writing into it behind Docker's back is asking for a corrupt state, and on Docker Desktop the path is inside the virtual machine so it doesn't exist on your Mac anyway. To look inside a volume safely, mount it into a throwaway alpine container and use ordinary commands. And docker volume rm refuses while any container references the volume — including a stopped one, which is usually the thing you'd forgotten. Next: the other kind, and why it breaks node_modules for everyone exactly once.",
}
