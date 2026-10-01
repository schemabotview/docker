import type { Section } from '../types'

export const containerToContainer: Section = {
  id: 'container-to-container',
  title: 'Container to container',
  scene: 'net-topology',
  slide: `## Use the container port. Don't publish.

On a shared network, \`api\` reaches the database at **\`db:5432\`** — the container's own port, resolved by name. No \`-p\`, no host port, no NAT. The packet goes down a veth, across the bridge, up another veth.

### The three mistakes
- **Publishing so containers can talk.** Unnecessary, and it exposes the service and creates a host port conflict
- **\`localhost\` from another container.** Each has its own loopback (§1). \`localhost:5432\` inside \`api\` means *\`api\`'s* port 5432
- **The host's IP as a workaround.** Works, and routes out and back in through NAT for no reason. \`host.docker.internal\` is for reaching a service on the **host**, not another container

### Say it once
**Publish for outside traffic. Use names for inside traffic.**

If nothing outside Docker needs it, it needs no \`-p\` — and a database almost never does.`,
  narration:
    "This section is short and it fixes the single most common structural mistake in Docker setups. Two containers on the same user-defined network. The API needs the database. The correct answer is: connect to db colon 5432. The container name, resolved by the embedded DNS from section three, and the port the database is actually listening on inside its own container. No dash p anywhere. No host port. No NAT. The packet goes down the API's veth, across the bridge, up the database's veth, and arrives. That's it, and it's both simpler and faster than any alternative. Now the three ways people get there instead, all of which I've seen in real repositories. The first is publishing the database port so the API can reach it. Dash p 5432 colon 5432 on the database, and then the API connects to the host's address. This works, and it's wrong in two ways: you've exposed your database to everything that can reach the host — on a default bind that's every interface, per section five — and you've taken a host port, so you can't run a second project on the same machine. The traffic also takes a longer path, out to the host and back in through the NAT rule. If nothing outside Docker needs to reach a service, it needs no dash p. A database almost never does. The second is using localhost. Someone writes localhost colon 5432 in the API's configuration, because that's what it says on their laptop, and it fails inside the container in a way that looks like the database isn't running. It's section one again: each container has its own network namespace, so its own loopback. Localhost inside the API container means the API container. The database is a different machine as far as the network stack is concerned. This one is worth internalising properly, because it's also the reason a multi-process container feels like it works — two processes in the same container do share a loopback — and that's a trap for a different reason. The third is using the host's IP address as a bridge between containers. It works, technically: the packet leaves the container, gets NAT'd out, arrives at the host, hits Docker's DNAT rule, and comes back into the other container. A long way around for something the bridge could have done directly, and it depends on the host's address, which differs between your laptop and production. There is a legitimate relative of this: host dot docker dot internal, a name Docker Desktop resolves to the host itself. That's for reaching something running on your host — a database you're running natively, a service in your IDE — from inside a container. It is not for container-to-container, and it doesn't exist on Linux by default. So, the rule, and it's worth saying as one sentence: publish for outside traffic, use names for inside traffic. Every port you publish is a decision that something outside Docker needs to reach this. If that isn't true, don't publish it. Applying that one rule to a typical Compose file usually removes two or three port mappings and closes two or three unintended exposures. Next: the driver that has no namespace at all.",
}
