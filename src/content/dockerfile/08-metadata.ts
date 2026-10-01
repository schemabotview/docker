import type { Section } from '../types'

export const metadata: Section = {
  id: 'metadata',
  title: 'Metadata instructions',
  scene: 'metadata-instructions',
  slide: `## Config, not files — so each is a **0-byte** layer

### \`EXPOSE 8080\` publishes nothing
It is documentation, recorded in the config. \`docker run -P\` reads it; \`docker run\` without \`-p\` still exposes nothing. Write it anyway — for the reader, and for Compose.

### \`USER 10001:10001\` is the highest-value line here
Everything after it, at build **and** run time, is that uid. Use a **numeric** uid so it works where \`/etc/passwd\` has no entry (distroless). The files must already be owned by it — \`COPY --chown=10001:10001\` (§4).

### \`LABEL\`
Use the OCI set. \`org.opencontainers.image.source\` is what makes a registry link the image back to its repo.

### \`STOPSIGNAL\`
What \`docker stop\` sends instead of SIGTERM. nginx wants \`SIGQUIT\` to drain gracefully (course 2 §3).

### \`VOLUME /data\` — usually don't
Every container gets an **anonymous volume** there whether you wanted one or not. Leave it to \`-v\` or Compose.`,
  narration:
    "Five instructions that change the image's configuration and touch no files, so each one produces a layer of exactly zero bytes. They're easy to skip, and two of them are widely misunderstood. Start with EXPOSE, because the misunderstanding here is near-universal. EXPOSE 8080 does not publish a port. It does not open a firewall. It does not make anything reachable. It writes a note in the image config saying this image expects to listen on 8080, and that's all. If you run the image without dash p, nothing is published, exactly as if the line weren't there. So why write it? Two reasons. Docker run dash capital P — publish all — reads it and maps every exposed port to a random host port. And more importantly, it's documentation that lives with the image: a person reading the Dockerfile knows what port to map, and Compose and other tooling can read it too. It's a useful line. It just doesn't do what its name suggests. Then USER, which is the single highest-value line in this entire course from a security perspective. Without it, your container runs as root — uid 0, which as we saw in course one is the host's uid 0, and if a container escape happens that's the difference between an incident and a catastrophe. USER changes the user for everything after it, both during the rest of the build and at run time. Two practical notes. Use a numeric uid rather than a name: a name has to be resolvable in slash etc slash passwd, and on a distroless or scratch image there isn't one, so the container fails to start with a confusing error. And the files your application needs must already be owned by that uid, which means COPY dash dash chown with the same number — because once you've switched to a non-root user, you can't chown anything any more. Put USER as late as possible: after the installs, before the CMD. LABEL attaches key-value metadata. The convention worth following is the OCI standard set, particularly org dot opencontainers dot image dot source, which is the repository URL. Registries read that and link your image back to its source, which is the difference between an image someone can investigate and an anonymous blob. Image dot revision with the git SHA is the other one worth always setting. STOPSIGNAL changes what docker stop sends. The default is SIGTERM, which is right for most programs, but not all: nginx treats SIGTERM as a fast shutdown and SIGQUIT as a graceful drain, so an nginx image without STOPSIGNAL SIGQUIT cuts connections it could have finished. It pairs directly with the pid 1 material from course two — the signal has to be both the right one and received by the right process. And VOLUME, which I'd suggest you usually leave out. VOLUME slash data declares a mount point, and the effect is stronger than it reads: every container started from this image gets an anonymous volume mounted there, whether the person running it wanted one or not, and those accumulate invisibly. It also means any later build instruction writing to that path silently does nothing. If data needs to persist, express that where the container is run — a dash v flag or a Compose file — where the person deciding can see it. Next: the health check, and the surprising amount of nothing Docker does with it.",
}
