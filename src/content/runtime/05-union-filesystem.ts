import type { Section } from '../types'

export const unionFilesystem: Section = {
  id: 'union-filesystem',
  title: 'The union filesystem',
  scene: 'layer-stack',
  slide: `## Many read-only layers, one writable layer

\`overlayfs\` takes a list of directories, stacks them, and presents **one merged tree**. The topmost version of each path wins.

### The two directions
- **Read** — the kernel searches down the stack until it finds the path
- **Write** — if the file lives in a read-only layer it is **copied up** into the writable layer first, then edited there. **Copy-on-write.**

### Why this makes images cheap
The \`lowerdir\` layers are never modified, so they are **shared**. Ten containers from the same image = one copy of those 127 MB on disk, plus ten small writable layers.

### The costs, which are real
- First write to a large file pays the **whole copy** — a 2 GB log file, copied, to append one line
- Delete a file from a lower layer and it isn't freed: a **whiteout** marker hides it, and the bytes stay`,
  narration:
    "Third primitive. A container needs a root filesystem — we said the mount namespace gives it one — but where does that filesystem come from, and why isn't it a gigabyte per container? The answer is a union filesystem, and on Linux today that means overlayfs. Here is the idea. Overlayfs takes a list of directories and presents them as a single merged directory tree. If the same path exists in more than one of them, the topmost one wins. That's it. Now read the diagram from the bottom. The bottom four boxes are the lowerdir layers, and together they are the image. The first is a Debian root filesystem — bin, etc, usr — seventy-four megabytes. The second is what an apt-get install of Python added: a set of new and changed files, forty-one megabytes. The third is what pip install added. The fourth is your app dot py, four kilobytes. Each layer is not a whole filesystem; it is a diff, the set of files that changed at that step. All of them are read-only. Above them sits one more directory, the upperdir, and this one is writable, and it belongs to this container alone. And at the top, the merged view: the single slash that your process actually sees. Reading is straightforward. The process opens slash usr slash bin slash python3, the kernel searches the stack top-down, finds it in the second layer, serves it. Writing is where the interesting behaviour is. Suppose the process opens slash etc slash hosts for writing. That file lives in a read-only lower layer, and read-only means read-only. So the kernel copies the file up into the writable layer first, and then edits the copy. Copy-on-write. From that moment on, the topmost version of slash etc slash hosts is the container's private one, and the lower layer is untouched. That untouched is the payoff, and it's the reason images are cheap. Because no container ever modifies a lower layer, all of them can share it. Run ten containers from the same image and you have one copy of those hundred and twenty-seven megabytes on disk, plus ten small writable layers holding only what each container actually changed. That is how you fit hundreds of containers on a host, and it is also why a second pull of a related image is nearly instant — the layers it shares are already there. Two costs come with this, and both bite in real systems. The first: the first write to a file pays for copying the entire file, not the part you changed. Append one line to a two-gigabyte log inside a container and you copy two gigabytes. That is the single best argument for volumes, which is a whole course later on. The second: deleting a file that lives in a lower layer does not free any space. The lower layer is immutable, so the delete is recorded as a marker in the upper layer — a whiteout — that hides the path. The bytes are still on disk. Which is why a Dockerfile that installs a large package and then deletes it in a later step produces an image containing both. We now have all three primitives: namespaces for what it sees, cgroups for what it may consume, layers for what its disk is. Next: which program actually assembles them.",
}
