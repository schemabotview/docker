import type { Section } from '../types'

export const aLocalRegistry: Section = {
  id: 'a-local-registry',
  title: 'A registry of your own',
  scene: 'local-registry',
  slide: `## One container. That's the installation.

\`\`\`bash
docker run -d -p 5000:5000 \\
  -v regdata:/var/lib/registry registry:2
\`\`\`

Then \`docker tag myapp:1.4 localhost:5000/myapp:1.4\` and push. \`localhost:5000\` is read as a **registry** because of the colon (course 3 §4).

### The two things that bite
- **TLS.** The daemon refuses plain HTTP to anything but \`localhost\`. Over a network you need a certificate, or the host in \`insecure-registries\` in \`daemon.json\` — which is fine on an isolated LAN and not otherwise
- **Auth.** \`registry:2\` has **none**. Anyone who can reach port 5000 can push anything, including replacing your images. Put a reverse proxy with auth in front, or use Harbor

### When it's worth it
An air-gapped environment. A CI cluster that shouldn't depend on the internet. A homelab. For a team, a managed registry is usually less work than operating this well.`,
  narration:
    "Running your own registry is a two-minute job, and knowing that is worth something even if you never do it, because it tells you how simple the thing actually is. Docker run, detached, publish port 5000, mount a volume at slash var slash lib slash registry so the data survives, restart unless-stopped, and the image registry colon two. That's it. There's no database to provision, no configuration file required, no schema. It starts and it works. To use it, tag an image with the registry's address in front — localhost colon 5000 slash myapp colon 1.4 — and push. And that address works as a registry rather than a namespace because of the colon, which is course three's rule about how a reference is parsed: a dot or a colon in the first segment means it's a hostname. Now the two things that will bite you, and they'll both bite in the first hour. The first is TLS. The Docker daemon refuses to talk plain HTTP to a registry, with one exception: localhost, which it treats as safe. So everything works while you're testing on one machine, and the moment another machine tries to pull from your registry by its hostname or IP, you get an error about an HTTP response to an HTTPS client. That message is confusing because it sounds like your registry is doing something wrong, and what it means is that Docker won't downgrade. Two ways out. Give the registry a real certificate — Let's Encrypt if it's reachable, or your internal CA — which is the right answer. Or add the host to insecure-registries in daemon dot json on every client, which tells Docker to allow plain HTTP. That's acceptable on an isolated build network and it is not acceptable on anything routable, because it means anyone who can intercept the connection can serve you images. And note it has to be configured on every client, which is a nuisance that scales badly. The second is authentication, and this one is worse because it fails silently in the direction of being too permissive. Registry colon two ships with no authentication at all. Not weak authentication — none. Anyone who can reach port 5000 can pull anything, and more importantly can push anything, including pushing over an existing tag with different content. If that registry is reachable from your network and your CI pulls from it, that's a straightforward supply-chain compromise waiting for someone to notice the port. The registry supports htpasswd-based auth and token auth, but you configure it; nothing prompts you. The usual shape is a reverse proxy in front handling TLS and auth together. Or use Harbor, which is the open-source registry that comes with authentication, a UI, image scanning, replication and retention policies built in — considerably more to run, and if you're standing up a registry for a team rather than for yourself, it's the more honest starting point. When is this worth doing? An air-gapped environment, where you have no choice. A CI setup that shouldn't depend on the public internet for every build. A homelab where you're the only user. And for a team of any size, a managed registry — your cloud provider's, or GitHub's, or Docker Hub — is almost always less work than operating your own well, because operating it well means TLS renewal, authentication, backups, garbage collection and monitoring. Next: the same image, pointed at Docker Hub, to fix rate limits.",
}
