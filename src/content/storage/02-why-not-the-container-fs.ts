import type { Section } from '../types'

export const whyNotTheContainerFs: Section = {
  id: 'why-not-the-container-fs',
  title: 'Two reasons, not one',
  scene: 'copy-up-cost',
  slide: `## Lifetime *and* performance

### 1 — It dies with the container
And "the container is removed" is not a rare event: \`--rm\`, a redeploy, \`compose down\`, a crash-and-recreate, a prune. In a container workflow, replacing the container **is** the normal way to change anything.

### 2 — Copy-on-write makes the first write expensive
Course 1 §5: writing to a file that lives in a lower layer copies the **whole file up** first. Append 40 bytes to a 2 GB log → **2 GB copied**.

A database is the pathological case: many small random writes, each paying the union's lookup and copy-up tax. Postgres on overlayfs is measurably slower than Postgres on a mount, with **no data-loss risk involved at all**.

### A mount fixes both
It isn't part of the union. Writes go straight to the host filesystem, and it outlives the container that used it.`,
  narration:
    "Two independent reasons not to keep things in the writable layer. Most material gives you the first and stops, so let's do both properly. Reason one: it dies with the container. That sounds like an edge case if you're used to servers, where a machine being rebuilt is an event. In a container workflow it isn't an event, it's the mechanism. You change an environment variable — course two, section seven — and the only way to apply it is to remove the container and create a new one. You deploy a new version: new container. You ran with dash dash rm, which you should for anything disposable: gone on exit. Compose down removes containers by design. A crash-looping container under a restart policy is recreated. A prune sweeps up whatever was stopped. So the question is not could the container be removed, it's how many times today. And every one of those takes the writable layer with it. Reason two has nothing to do with data loss, and it's the one worth learning because it explains performance mysteries. Go back to copy-on-write from course one. When a process writes to a file that lives in a read-only lower layer, overlayfs cannot modify that layer, so it copies the entire file up into the writable layer first, and then applies your change to the copy. The whole file. Not the block you touched. So appending forty bytes to a two-gigabyte log file that came from the image costs you two gigabytes of copying, once, the first time. That's a dramatic example but it's real, and the general version is worse in aggregate: a database. A database does many small writes to a few large files, scattered around. Every one of those files pays the copy-up the first time it's touched, and every single read and write afterwards still goes through the union filesystem's lookup — which layer is this path in? — rather than straight to the disk. Postgres running on the writable layer is measurably slower than the same Postgres on a volume, on the same hardware, with the same data. No data was at risk in that comparison. It was purely the filesystem. Put those together and the shape of the advice is clear: anything hot, anything large, anything you want to keep, belongs on a mount. And a mount is exactly what you'd guess from the diagram — a path inside the container that is not part of the layer stack at all. Reads and writes at that path go straight to wherever the mount points, bypassing overlayfs entirely, and whatever is there outlives the container that used it. Next: the three kinds, and the question that actually chooses between them.",
}
