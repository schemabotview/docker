import type { Section } from '../types'

export const userDefinedBridges: Section = {
  id: 'user-defined-bridges',
  title: 'User-defined bridges',
  scene: 'bridge-dns',
  slide: `## One command buys you DNS

\`\`\`bash
docker network create appnet
docker run -d --network appnet --name db postgres:16
docker run -d --network appnet --name api myapi
\`\`\`

Now \`http://db:5432\` works from \`api\`, and keeps working when \`db\` is recreated with a different IP. That is the **entire reason** user-defined networks exist.

### What else you get
- **A real boundary** — only what you attach is on it. Two stacks can't reach each other
- **Attach and detach at runtime** — \`docker network connect\` (§10), which the default bridge can't do
- **Aliases** — \`--network-alias\` gives a container extra names on that network

### The shape to use
**One network per stack.** Add a second, private one for anything that shouldn't be reachable from the front: the API on both, the database only on the back.

Compose does exactly this, per project, automatically (course 8).`,
  narration:
    "Docker network create, a name. That's it. Attach containers to it with dash dash network, and they can find each other by container name. Why does that work here and not on the default bridge? Because a user-defined bridge gets an embedded DNS server. Docker runs a resolver reachable at 127.0.0.11 from inside each container's namespace, writes that address into the container's resolv dot conf, and the resolver knows the name of every container attached to that network. Ask for db and you get the current address of the container named db — current, meaning it's looked up at the time you ask, so when db is recreated with a different address, the next lookup returns the new one. Nothing you wrote down goes stale. That alone is the reason to always create a network, and if it were the only benefit it would still be worth it. But there are three more. A user-defined network is a real isolation boundary. Only containers you explicitly attach are on it. So two stacks running on the same host — your application and a colleague's, or staging and a scratch experiment — genuinely cannot reach each other, rather than merely not knowing each other's addresses. You can attach and detach while containers are running, with docker network connect and disconnect, which the default bridge does not support. And you get network aliases: dash dash network-alias gives a container additional names on that network, and several containers can share an alias, in which case the resolver returns all of their addresses. That's a crude load balancer, and more usefully it's how you do a blue-green swap — bring up the new container with the same alias, take the old one off — without any proxy involved. Now the shape to use, because one network is the obvious answer and two is often the better one. Put everything in your stack on one network, so it can all talk. Then, if something shouldn't be reachable from the front door, give it a second, private network and attach only what needs it. Concretely: a reverse proxy and your API on the front network; your API and your database on the back network; the database not on the front network at all. Now even a fully compromised proxy has no route to the database — not a firewall rule denying it, no route. That's a meaningful boundary and it costs you one extra line. A few notes. Docker picks a subnet for you from a private range, and you can override it with dash dash subnet if it collides with something in your corporate network, which does happen and produces a very confusing outage. Docker network ls shows what exists; docker network inspect shows what's attached and with which addresses, and that's the first command in the troubleshooting walk in section eleven. And if you use Compose, all of this happens for you: every project gets its own network, every service is reachable by its service name, and you never type any of these commands. Which is lovely, and is also why it's worth understanding what it's doing, because when it goes wrong the error is about DNS and the cause is about networks. Next: the five drivers, and the one whose trade-off is usually misdescribed.",
}
