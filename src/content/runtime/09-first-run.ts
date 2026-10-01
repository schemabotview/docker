import type { Section } from '../types'

export const firstRun: Section = {
  id: 'first-run',
  title: 'Your first run, line by line',
  scene: 'first-run-session',
  slide: `## Three steps, and every line is one of them

\`docker run\` is not one operation. It is **pull**, then **create**, then **start** — which is why \`docker create\` and \`docker start\` exist separately.

### What the output tells you
- **"Unable to find image locally"** — not an error. No layers cached, so \`containerd\` pulls
- **\`Digest: sha256:…\`** — the image's content address (§7)
- **\`Hello from Docker!\`** — \`runc\` execed it, then runc exited (§6)

### The thing to internalise
\`docker ps\` is **empty**. The process printed and returned, so the container stopped. **A container lives exactly as long as its main process** — there is nothing else in there to keep it up. \`docker ps -a\` shows it, \`Exited (0)\`.

### Then look from inside
\`ps\` says pid **1**. \`/etc/os-release\` says **Alpine** on an Ubuntu host. \`hostname\` is the container id. §3's namespaces, checkable at a prompt.`,
  narration:
    "Let's run the first container and read every line of the output, because all of it is mechanism we've already covered. Docker run hello-world. The first line says unable to find image hello-world latest locally. That is not an error — it is a statement of fact. No layer for that image is cached on this host. So containerd pulls it: it asks the registry for the manifest, then fetches the layer blobs it doesn't already have. Here there is one, and you see Pull complete against its short digest. Then a line beginning Digest, sha256, and a long hex string. That is the image's content address — the thing we met in section seven. It is not a name; it is the hash of the manifest's bytes, and it will be identical on any machine that pulls the same image. Then Hello from Docker. And underneath that output is the whole of section six: dockerd created a container spec, containerd unpacked those layers into a root filesystem, a shim started, runc set up the namespaces and cgroups, execed the binary, and exited. Now the important bit, and it is the line that trips up nearly everybody. Docker ps. Empty. Nothing is running. Did it fail? No — it succeeded. The program printed its message and returned, and the moment its main process returned, the container was over. This is the single most important idea about containers, so let me state it plainly: a container lives exactly as long as its main process. There is no init system in there, nothing else running, nothing to keep it alive. A container is not a machine that hosts a process; a container is a process, wearing namespaces and cgroups. If the process exits, the container has exited, by definition. And it is still there — docker ps dash a shows it, with status Exited, zero, and an auto-generated name. Stopped containers are kept, with their writable layer intact, until you remove them. That's useful, because you can inspect the corpse; it's also why a busy machine accumulates hundreds of them. Second run: docker run dash i t dash dash rm alpine sh. The dash i keeps stdin open and dash t allocates a pseudo-terminal, and together they give you an interactive shell — this time the main process is a shell, so the container lives as long as you stay in it. Now check section three's claims from inside. Run ps. One process, pid 1, and it is our shell. Not pid 4417, which is what the host would say about the same process — pid 1, because we are inside a pid namespace whose numbering starts there. Cat etc os-release: Alpine Linux. On an Ubuntu host. The mount namespace gave us a different root, and this is genuinely Alpine's filesystem, not a translation. Run hostname: a short hex string, the container id, courtesy of the uts namespace. Then exit. Because we passed dash dash rm, the container is deleted on exit rather than accumulating. Three commands, and every one of them was a namespace, checkable rather than asserted. One question left before we close the course: what exactly is the difference between the image and the container?",
}
