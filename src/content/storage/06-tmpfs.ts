import type { Section } from '../types'

export const tmpfs: Section = {
  id: 'tmpfs',
  title: 'tmpfs mounts',
  scene: 'tmpfs-and-syntax',
  slide: `## RAM. Never a disk. Gone on stop.

\`\`\`bash
docker run --tmpfs /tmp:size=64m,mode=1777 myapp
\`\`\`

### The three things it's for
- **Secrets** — a decrypted credential that should never be recoverable from a disk afterwards
- **Hot scratch** — a cache or sort area where the copy-on-write tax (§2) is the bottleneck
- **A writable path in a read-only container** — \`--read-only\` plus a tmpfs \`/tmp\` is the standard hardened shape (security course)

### Two constraints
- **Always set \`size\`.** A tmpfs grows into the container's **memory limit** — so an unbounded one gets you OOM-killed at exit 137 (course 2 §6), and it will look like a memory leak
- **Linux only.** Not available for Windows containers

It is genuinely faster than the writable layer, but speed is rarely the reason to reach for it — *"must not survive"* is.`,
  narration:
    "The third mount type, and the shortest section in the course. A tmpfs mount is a RAM-backed filesystem mounted at a path in your container. Files written there behave exactly like files — you can open them, list them, set permissions on them — and none of it ever touches a disk. When the container stops, it's gone. Not deleted; it was never anywhere to delete from. Three genuine uses. The first is secrets. Your application receives an encrypted credential, decrypts it, and needs it on disk because some library only reads from a file. Write it to a tmpfs and the plaintext exists in memory only. It isn't in the writable layer, so it isn't in a commit or an export, and it isn't recoverable from the host's disk afterwards by someone who gets the machine. That's a meaningful improvement over writing it to slash tmp in the container's own filesystem. The second is hot scratch space. Remember section two: the writable layer pays a copy-on-write tax and goes through the union filesystem on every operation. If your workload is dominated by short-lived temporary files — a sort area, a render cache, a compilation scratch directory — a tmpfs bypasses all of that and is straightforwardly faster. Though be honest about whether it's actually your bottleneck; usually it isn't. The third use is the one you will definitely meet, in the security course. A hardened container runs with dash dash read-only, which makes its entire root filesystem immutable — nothing can be written anywhere, which removes a whole family of attacks. But almost every program needs to write somewhere: a pid file, a temporary file, a socket. So the standard hardened shape is dash dash read-only plus a tmpfs at slash tmp and wherever else the program genuinely needs. Read-only everywhere except a small RAM-backed area that vanishes on restart. Two constraints. Always set a size. A tmpfs with no limit can grow until it consumes the container's entire memory allowance, at which point the kernel OOM-kills your process — course two, section six, exit code 137. And the symptom is thoroughly misleading: your application looks like it has a memory leak, because from the outside memory usage climbs steadily until it dies, while your heap profiler shows nothing wrong. The memory is the filesystem. Colon size equals 64m, and pick a number you've thought about. And it's Linux only. Windows containers don't have it. On Docker Desktop for Mac it works, because your containers are Linux containers in a Linux VM, and the RAM it consumes comes out of the VM's allocation rather than your Mac's directly. Finally, a framing worth keeping. It is faster than the writable layer, but speed is rarely the right reason to choose it. The right reason is must not survive. When the requirement is that this data does not outlive the process, tmpfs expresses that requirement in the run command, where anyone can see it. Next: the two syntaxes, and the typo that starts your database with no data.",
}
