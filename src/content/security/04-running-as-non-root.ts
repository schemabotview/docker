import type { Section } from '../types'

export const runningAsNonRoot: Section = {
  id: 'running-as-non-root',
  title: 'Running as non-root',
  scene: 'root-and-socket',
  slide: `## The line, and the three things that break

\`\`\`docker
RUN adduser -u 10001 -D app
COPY --chown=10001:10001 . /app
USER 10001:10001
\`\`\`

Numeric, late in the file, and with ownership fixed by the \`COPY\` rather than a \`RUN chown\` — which would copy every file it touched into a new layer (course 4 §4).

### What breaks, and what to do
- **Ports below 1024.** Don't chase \`CAP_NET_BIND_SERVICE\` — listen on 8080 and publish to 80 on the host. Free, and simpler
- **Writing to paths the image owns.** \`chown\` them at build time, while you're still root
- **A bind-mounted host directory.** The uid mismatch from course 6 §8 — \`--user $(id -u)\` in dev, or a volume

### Enforce it
\`--user 10001\` at run time overrides the image, so you can harden an image whose author didn't. And a policy check on \`Config.User\` catches the ones that slip through.`,
  narration:
    "Section two said run as non-root and called it one line. It is one line, and three things break the first time you do it, so let's go through them, because the reason people give up on this is that it fails in a way that looks like the approach is wrong. The Dockerfile pattern is three lines. Create a user with an explicit numeric uid — adduser with dash u, or useradd, depending on the base. Copy your files in with dash dash chown naming that same uid and gid. And USER with the numeric id, placed late in the file, after all your installs, because those need root. Two details matter. Numeric rather than a name: a name has to be resolvable in the image's passwd file, and on a distroless or scratch base there isn't one, so the container fails to start with an error about an unknown user. And ownership set by the COPY rather than by a later RUN chown: chown modifies metadata, and overlayfs has to copy every file up to do that, so a chown on your application directory duplicates it in a new layer. Course four, section four. Now what breaks. First, binding to a port below 1024. Those are privileged ports and a non-root process can't use them. The instinct is to add back CAP_NET_BIND_SERVICE, and you can. Don't bother. Listen on 8080 inside the container and publish it to 80 on the host with dash p 80 colon 8080. The port mapping from course seven makes the internal port irrelevant to anyone outside, and you've avoided granting a capability for no benefit. This is a case where the right fix is simpler than the workaround. Second, writing to paths the image owns. Your application wants to write a cache directory, or a pid file, or a log. Those paths were created during the build, owned by root, and your non-root process can't write them. The fix is to chown them at build time, while you're still root — one RUN, before the USER line, creating the directory and giving it to your uid. Do it deliberately for the specific paths that need it rather than chowning the whole filesystem. Third, a bind-mounted host directory, which is course six section eight arriving here: the host directory is owned by your host uid, the container runs as a different uid, and writes fail with permission denied. In development, dash dash user with your own id and group resolves it. In production, prefer a volume, where Docker seeds the ownership from the image and there's no host user to disagree with. Two more things worth knowing. Dash dash user at run time overrides whatever the image specifies, which means you can harden somebody else's image without rebuilding it. That's genuinely useful for third-party images whose authors never added a USER line — though it will break if the image expects to write somewhere it owns, so test it. And if you're running this across a team, the check is mechanical: docker inspect on Config dot User, and flag anything empty or zero. Wire that into CI and the problem stops recurring. Next: what root actually consists of.",
}
