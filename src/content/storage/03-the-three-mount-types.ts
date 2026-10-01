import type { Section } from '../types'

export const theThreeMountTypes: Section = {
  id: 'the-three-mount-types',
  title: 'The three mount types',
  scene: 'mount-types',
  slide: `## The question is *who owns the storage*

All three put a path inside the container **outside the union**. They differ in ownership.

- **Volume** — **Docker** owns it, under \`/var/lib/docker/volumes\`. You never touch that path directly; you refer to it by name
- **Bind mount** — **you** own it. An exact host path, mounted straight in
- **tmpfs** — **nobody** owns it. RAM, never written to a disk, gone on stop

### Which, for what
- **Data → volume.** Databases, uploads, anything with a backup story. Portable across hosts via a driver, and Docker handles ownership
- **Source → bind.** The dev loop, and **development only** — a bind mount in production ties the container to one host's directory layout
- **Scratch → tmpfs.** Secrets, caches, and the \`/tmp\` a \`--read-only\` container still needs

### The failure mode of guessing
A bind mount used as a data volume works on one machine and nowhere else.`,
  narration:
    "Three kinds of mount, and every tutorial presents them as three options with a comparison table. That framing makes it feel like a performance choice. It isn't. All three do the same technical thing — put a path inside the container that is not part of the layer stack — and what differs is who owns the storage behind it. Get that question right and the choice makes itself. A volume is owned by Docker. You create it with a name, and Docker decides where it lives — under slash var slash lib slash docker slash volumes on Linux, or inside the virtual machine on Docker Desktop, where that path does not exist on your Mac at all. You refer to it by name and never by path. That indirection is the feature: Docker manages its lifecycle, sets up its initial ownership to match the image, and can put it somewhere else entirely if you use a volume driver — an NFS share, a cloud disk. A bind mount is owned by you. You give an exact host path and Docker mounts it. There is no indirection and no management: it's that directory, on that machine, with that content and those permissions. Which makes it perfect for a workflow where you want the host and the container looking at the same files, and poor for anything you intend to run somewhere else. A tmpfs mount is owned by nobody, because there's no storage behind it. It's a RAM-backed filesystem. Nothing is ever written to a disk, and when the container stops, it's gone — not deleted, just never existed anywhere persistent. So the routing. Data goes on a volume. Your database directory, your uploaded files, anything with a backup story. Docker handles the ownership seeding, the volume survives the container, and you can move it to another host. This is the default answer for persistence and you should need a reason to deviate. Source code goes on a bind mount, and only during development. You edit a file in your editor and the process inside the container sees it immediately, with no rebuild, which is the tight loop that makes container development bearable. But in production a bind mount is a liability: it ties that container to one specific host having one specific directory laid out one specific way, which is the opposite of what an image is for. Scratch data goes on tmpfs. Secrets you don't want touching a disk. A cache that's worthless after a restart. And the case you'll meet in the security course: a container running with dash dash read-only still needs somewhere to write temporary files, and a tmpfs at slash tmp is exactly that. One failure mode worth naming, because it's the common one. Someone uses a bind mount for data — dash v slash srv slash appdata colon slash data — and it works. It works perfectly, on their machine. Then it goes to a second host where slash srv slash appdata doesn't exist, and dash v silently creates an empty directory, and the container starts happily with no data at all. That's section seven, and it's the single strongest argument for the longer syntax. Next: volumes properly, and the one behaviour of theirs nobody documents loudly enough.",
}
