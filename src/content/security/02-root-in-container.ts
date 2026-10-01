import type { Section } from '../types'

export const rootInContainer: Section = {
  id: 'root-in-container',
  title: 'Root in the container',
  scene: 'root-and-socket',
  slide: `## uid 0 inside **is** uid 0 outside

The pid namespace remaps process ids. The mount namespace remaps the filesystem. **Neither remaps user ids** — that's the *user* namespace, and it is **off by default** (§7).

So a container with no \`USER\` line runs as the host's root, wearing namespaces.

### What that means concretely
- Any writable bind mount can be rewritten **as root**
- It holds every capability Docker grants by default (§5)
- Any kernel bug it reaches, it reaches with full privilege

### Why images default to root
Because installing packages at build time needs it, and most authors never add a \`USER\` line at the end. So the default is inherited, not chosen.

### The fix is one line
\`USER 10001:10001\` (course 4 §8), with \`COPY --chown\` so the files are readable. Late in the Dockerfile, after the installs. It is the highest-value line in this entire subject.`,
  narration:
    "Here's a fact that surprises people who've been using Docker for years: the root user inside a container is the root user on your host. Not a similar user. Not a sandboxed equivalent. The same user id — zero — with the same meaning to the kernel. Go back to course one, section three. Namespaces give a process a different view of one kernel resource each. The pid namespace remaps process ids, so the container's pid 1 is pid 4417 on the host. The mount namespace remaps the filesystem, so slash is the image's root. And user ids are remapped by the user namespace — which is a separate namespace, and it is off by default. Docker does not enable it unless you configure it, which is section seven. So a container with no USER line in its Dockerfile is running as the host's root, wearing a pid namespace and a mount namespace and a network namespace, but with uid zero meaning exactly what uid zero always means. Three concrete consequences. First, any bind mount you've given it that isn't read-only, it can write as root. Files it creates are owned by root on the host. Files it modifies, it can modify regardless of their permissions. If someone bind-mounted a host configuration directory for convenience, a compromised container rewrites it. Second, it holds every capability Docker grants by default, which is around fourteen of them, and we'll go through those in section five. Third, and this is the multiplier: any kernel vulnerability it can reach, it reaches with full privilege. A lot of kernel bugs are only exploitable by a privileged process. Running as root hands that precondition over for free. So why do images default to root? Not because anybody decided it was a good idea. Because building an image needs it — installing packages, writing to system directories, creating users — and the natural end of a Dockerfile is the last RUN, with nobody adding a USER line afterwards. The default is inherited rather than chosen, and it propagates: your image is FROM something that was FROM something, and unless one of those authors added a USER, you're root. You can check any image in one command with docker inspect on Config dot User, and an empty string means root. Try it on a few images you use; the results are sobering. The fix is one line, and it's course four section eight. USER, then a numeric uid and gid, late in the Dockerfile — after the installs, before the CMD. Use a number rather than a name so it works on images with no passwd entry. And make sure the files your application needs are owned by that uid, which means COPY dash dash chown with the same number, rather than a separate RUN chown that would double the size of what it touches. If you do one thing from this entire course, do this. It doesn't prevent your application from being compromised — nothing in this course does — but it changes what a compromise gets. An attacker with a non-root process and no capabilities is in a much weaker position than one with root, and the difference costs you a single line. Next: the ways people hand the host over deliberately.",
}
