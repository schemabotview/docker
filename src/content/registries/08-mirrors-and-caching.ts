import type { Section } from '../types'

export const mirrorsAndCaching: Section = {
  id: 'mirrors-and-caching',
  title: 'Mirrors and pull-through caching',
  scene: 'local-registry',
  slide: `## The same container, one config line

\`\`\`yaml
proxy: { remoteurl: https://registry-1.docker.io }
\`\`\`

Now it's a **pull-through cache**: it serves what it has and fetches what it doesn't, keeping a copy. Point clients at it with \`registry-mirrors\` in \`daemon.json\`.

### What it fixes
- **Rate limits.** Docker Hub limits anonymous pulls per IP — and a CI farm behind one NAT gateway is *one IP*. The cache turns a hundred builds into one upstream pull
- **Bandwidth and latency** on a build farm pulling the same base images all day
- **Availability.** Hub had an outage; your builds didn't

### The limits
- It's a **cache**, not a backup — it only has what someone already asked for
- **One upstream** per instance, and it won't proxy private images without credentials

### Symptom to recognise
\`toomanyrequests: You have reached your pull rate limit\` — in CI, at the worst moment.`,
  narration:
    "Same image as the last section, one configuration file, completely different job. Give registry colon two a config with a proxy section naming an upstream — registry dash one dot docker dot io for Docker Hub — and it becomes a pull-through cache. When a client asks for an image, it checks whether it already has the blobs; if not, it fetches them from upstream, serves them to the client, and keeps a copy. The next client asking for the same thing gets it locally. Then you point your daemons at it with registry-mirrors in daemon dot json, which is a list of URLs the daemon will try before going to Docker Hub. Every docker pull on those machines now goes through your cache, with no change to any image reference and no change to anyone's workflow. What does this fix? Three things, and the first is the one that turns into an incident. Docker Hub rate-limits anonymous pulls per IP address. A CI farm behind one NAT gateway is one IP address as far as Hub is concerned, so a few dozen builds an hour can exhaust the allowance for everybody. And the way you find out is a build failing with too many requests, you have reached your pull rate limit — at whatever moment happens to be least convenient. A pull-through cache turns a hundred builds pulling the same base into one upstream pull, and the problem disappears. Second, bandwidth and latency. A build farm that pulls the same few hundred megabytes of base images all day is doing pointless work; with a cache on the same network it's a local transfer. Third, availability. Docker Hub has outages. If your builds go through a cache that already holds your base images, you don't notice. Now the limits, because a cache is not a solution to everything. It is a cache: it only contains what someone has already asked for. If Hub is down and nobody has ever pulled the image you need, you're still stuck. If you genuinely need offline builds, you want a real registry with images deliberately mirrored into it, not a pull-through cache. A single instance proxies exactly one upstream, so if you also pull from ghcr dot io and from your cloud provider's registry, that's a separate instance per upstream, each on its own port. And a pull-through cache won't fetch private images unless you've configured it with credentials, and then it's caching them for everyone who can reach it, which is a decision worth making consciously. One more option worth knowing about, because it's the simplest fix of all: authenticating to Docker Hub raises the rate limit substantially, and a paid account raises it further. If your problem is purely the limit and not bandwidth or availability, a docker login in your CI with a cheap account may be less work than running any infrastructure. Weigh that honestly before standing up a cache. Next: what you can actually prove about an image.",
}
