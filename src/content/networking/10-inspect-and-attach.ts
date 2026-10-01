import type { Section } from '../types'

export const inspectAndAttach: Section = {
  id: 'inspect-and-attach',
  title: 'Inspect and attach',
  scene: 'net-inspect',
  slide: `## A container can join a second network while running

\`\`\`bash
docker network connect backend api
docker network disconnect backend api
\`\`\`

No restart. \`api\` now has a second interface and can resolve names on both networks — which is exactly how a gateway container sits on a public and a private network with nothing else bridging them.

### Reading what exists
\`\`\`bash
docker network inspect appnet --format \\
  '{{range .Containers}}{{.Name}} {{end}}'
\`\`\`
The first question in any connectivity problem (§11): **are both containers actually on it?**

### Aliases
\`--network-alias\` adds extra names on a network, and several containers can **share** one — the resolver returns them all. That's a blue/green swap with no proxy: attach the new container with the alias, detach the old.

### Note
\`docker network connect\` doesn't work on the default bridge — another reason not to use it (§2).`,
  narration:
    "Two capabilities here that people don't know exist, and one command you'll use constantly. Start with the constant one. Docker network inspect, with a network name, shows you everything attached to it and what address each container has. The raw output is large, so use dash dash format with a Go template that ranges over Containers and prints the name and the address — that's a one-liner worth keeping in your notes, because it answers the first question in any connectivity problem: are both of these containers actually on this network? Surprisingly often the answer is no. Someone started one without the dash dash network flag, or Compose put them in different projects, and everything else you might investigate is wasted effort until you've checked. Now the capability. A running container can be attached to an additional network with docker network connect, and detached with disconnect, without restarting it. When you attach it, it gets a new interface inside its namespace, a new address, and the ability to resolve names on that network. When you detach it, they go away. Live. What's that for? The clean answer is a gateway pattern. You have a front network with your reverse proxy and a back network with your database. Your API sits on both. Nothing else crosses. The proxy has no route to the database — not a rule denying it, no route at all — and if the proxy is compromised, the database is unreachable from it. You can build that at creation time with two dash dash network flags, or you can build it incrementally with connect, which is useful when you're adding a service to an existing stack. It's also genuinely useful for debugging: attach a diagnostic container to a network temporarily, look around, detach it. No changes to anything that's running. The second capability is network aliases. Dash dash network-alias gives a container an extra name on a network, in addition to its container name. Two things follow. You can give a container a name that describes its role rather than its identity — a container called api-v2-blue answering to api. And several containers can share an alias, in which case the embedded resolver returns all of their addresses, and the client picks one. That's round-robin load balancing at the DNS level, which is crude — no health checking, and clients cache — but it exists and it's free. The better use is a blue-green swap. Bring up the new version attached with the shared alias. Now both answer. Detach the old one. All new lookups get only the new version, with no proxy, no configuration reload, and no dropped connections on the old one's in-flight requests. One limitation worth knowing: docker network connect doesn't work on the default bridge. You can't attach a running container to docker0 after the fact. It's one more entry on the list of things the default bridge can't do, and one more reason to create your own. Next: what to do when none of this works.",
}
