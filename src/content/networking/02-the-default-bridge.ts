import type { Section } from '../types'

export const theDefaultBridge: Section = {
  id: 'the-default-bridge',
  title: 'The default bridge',
  scene: 'bridge-dns',
  slide: `## \`docker0\` has **no DNS**

Every container you start without \`--network\` lands on it. They can reach each other — but **only by IP**.

\`\`\`bash
docker exec api ping db
ping: bad address 'db'
\`\`\`

And IP is not a usable answer: recreate the container and it gets a different one. There is no stable way to name anything.

### It's also not a boundary
Every container on the host without a network of its own is on \`docker0\`, so unrelated containers can reach each other freely.

### Why it's still there
Backwards compatibility with 2013. \`--link\` was the old workaround — it wrote \`/etc/hosts\` entries — and it is **deprecated**; you'll still find it in old blog posts.

### The fix is one command
\`docker network create\` — which is §3, and the reason Compose makes one for you without being asked.`,
  narration:
    "Start two containers the normal way, with no network flags, and try to make one talk to the other by name. It won't work, and the error is so plain that people assume they've misconfigured something. Bad address. Here's why. Containers started without dash dash network go onto the default bridge, docker0. They get addresses on it, they can route to each other, and if you find container B's IP with docker inspect, container A can absolutely reach it. But the default bridge has no name resolution at all. There is no resolver on it. The name db means nothing there. And IP is not a workable substitute, for the reason that matters most in container work: addresses are assigned in order as containers start, and a container that is removed and recreated — which, per course six, is how you change anything at all — comes back with a different address. So any configuration you write down is stale by the next deploy. That's the practical problem: not that you can't connect, but that you can't name. The default bridge has a second problem, which is more of a security one. Every container on the host that doesn't have a network of its own is on docker0. Together. So a container from a completely unrelated project, perhaps something you pulled from Docker Hub to try out for five minutes, is on the same flat network as your database, and can reach it. There's no isolation boundary because there's no boundary at all. So why does this thing exist, and why is it the default? History. Docker0 is from 2013, before named networks existed, and changing the default would break an enormous amount of old material and old scripts. And there was a workaround at the time, which you will still find in blog posts: the dash dash link flag. Link wrote entries into the container's slash etc slash hosts, so names did resolve. It's deprecated, it doesn't survive a restart of the linked container properly, and it produces a dependency graph you have to spell out by hand for every pair. If you see dash dash link in a tutorial, you're reading something written before 2016 and probably shouldn't follow the rest of it either. The fix is one command, and it's the next section: docker network create. Make a network, attach your containers to it, and names resolve. It costs nothing, it takes one line, and it's what Compose does for you automatically without mentioning it — which is precisely why people who start with Compose never hit this problem and are baffled when it appears the first time they run containers by hand. Next: the network you should have made.",
}
