import type { Section } from '../types'

export const publishingPorts: Section = {
  id: 'publishing-ports',
  title: 'Publishing ports',
  scene: 'net-inspect',
  slide: `## \`-p HOST:CONTAINER\`

Host first. It's the one flag people reverse, and reversing it usually still *starts* — you just can't reach anything.

- \`-p 8080:80\` — host 8080 → container 80
- \`-p 127.0.0.1:8080:80\` — **loopback only.** The single most useful form: reachable from the host, not from the network
- \`-p 80\` — container 80, host port chosen for you. \`docker port\` tells you which
- \`-P\` — every \`EXPOSE\`d port, each to a random host port (course 4 §8)

### The default binds **everything**
\`-p 8080:80\` means \`0.0.0.0:8080\` — every interface on the machine. On a cloud VM with a public IP, that is the internet, whatever you assumed about the firewall (§6).

For anything that doesn't need to be public, prefix \`127.0.0.1:\`.

### And containers don't need it to reach each other
On a shared network they use the **container port directly** (§7). Publishing is only for traffic from *outside*.`,
  narration:
    "Dash p, and the order: host first, then container. It's the flag people reverse, and the reversal is nasty because it frequently still works — dash p 80 colon 8080 when you meant 8080 colon 80 binds host port 80 to container port 8080, which starts perfectly and is simply unreachable. Nothing errors. Four forms worth knowing. Dash p 8080 colon 80 is the everyday one. Dash p with an IP in front — 127 dot 0 dot 0 dot 1 colon 8080 colon 80 — binds only that interface, and I'd argue it's the most useful form in the set, for reasons I'll get to. Dash p with just a container port lets Docker pick a free host port, which is what you want when you're running several copies and don't care about the numbers; docker port tells you what it chose. And capital dash P publishes every port the image declared with EXPOSE, each to a random host port — which ties back to course four, where we said EXPOSE publishes nothing on its own and is documentation that tooling can read. This is the tooling reading it. Now the thing that deserves a warning, because it has caused real incidents. Dash p 8080 colon 80 with no IP prefix binds 0 dot 0 dot 0 dot 0 — every interface on the machine. On your laptop that's fine. On a cloud VM with a public address, that is the internet. And the next section explains why the host firewall you assumed was protecting you often isn't: Docker's rules are evaluated before UFW's, so a UFW deny rule that looks like it covers the port simply doesn't apply to published container ports. So the habit worth building: if a service doesn't need to be reachable from outside the machine, prefix it with 127 dot 0 dot 0 dot 1. Your database's admin port, your metrics endpoint, a debugging interface — all of those should be loopback-bound, and then reached over an SSH tunnel when you need them. It costs ten characters and removes an entire class of accident. And then the thing people get wrong in the other direction, which is much more common than the security mistake. Containers do not need published ports to talk to each other. If your API and your database are on the same user-defined network, the API connects to db colon 5432 — the container port, directly — and no dash p is involved at all. Publishing is only about traffic arriving from outside Docker's networks. Yet an enormous number of Compose files publish the database's port to the host for no reason, which exposes it and gives you a port conflict the moment you run two projects. If nothing outside Docker needs to reach it, don't publish it. A couple of details. You can publish a UDP port by adding slash udp, and if you need both protocols on one port you need two dash p flags. You can publish a range with a colon-separated pair, which is occasionally handy and expands into a lot of iptables rules. And docker port on a running container tells you exactly what got mapped, which is the fastest way to settle an argument about whether the flag was right. Next: what the flag actually does to your machine.",
}
