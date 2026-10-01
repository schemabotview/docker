import type { Section } from '../types'

export const hostMode: Section = {
  id: 'host-mode',
  title: 'Host mode',
  scene: 'net-topology',
  slide: `## No namespace. No cable. No bridge.

\`--network host\` removes the container from the diagram entirely: its processes use **the host's** network stack. There is no \`eth0\` of its own, no veth pair, no NAT.

### What that costs
- **\`-p\` is silently ignored.** The app binds the host's ports for real
- **Ports collide** — with the host, and with every other host-mode container
- **No isolation.** It can reach anything the host can, including services on the host's own \`localhost\` that you assumed were private
- **Not on Docker Desktop.** "The host" there is the Linux VM, not your Mac

### When it's right
A reverse proxy that needs **real client IPs**. A monitoring agent that must see the host's interfaces. A protocol NAT breaks — multicast, or a service that advertises its own address.

### When it isn't
Performance. The NAT hop is real and it is small; nearly every workload's bottleneck is somewhere else entirely.`,
  narration:
    "Host mode is the same diagram with a piece removed. Dash dash network host means the container gets no network namespace at all: its processes use the host's network stack directly. No eth0 of its own, no veth pair, no bridge, no NAT. When the process inside binds port 8080, it is binding the host's port 8080, in the same way any other process on the machine would. Four consequences. Dash p is ignored, silently. You can pass it, Docker accepts it, and it does nothing — there is no mapping to make, because there's nothing to map between. That's confusing the first time you see a Compose file with both host mode and port mappings; the mappings are decoration. Ports collide, properly. Two host-mode containers both wanting port 80 conflict, just as two ordinary processes would, and they conflict with anything already running on the host. You've given up the main thing namespaces bought you. There's no isolation, which is the one to think hardest about. The container can reach anything the host can reach — including services bound to the host's own loopback. A lot of software binds to 127 dot 0 dot 0 dot 1 on the assumption that only local processes can reach it: an admin interface, a metrics endpoint, an unauthenticated database on a developer machine. A host-mode container is a local process. And it's not really available on Docker Desktop. There is a flag, and what it means there is the host stack of the Linux virtual machine your containers run in — not your Mac. So a host-mode container on a Mac doesn't see your Mac's interfaces, and the behaviour differs from Linux in ways that will waste your afternoon. Now the legitimate uses, because there are some and they're specific. A reverse proxy that must see real client IP addresses: in bridge mode, every connection appears to come from the bridge gateway, so your logs, your rate limiting and your geolocation are all useless. You can solve that with X-Forwarded-For if something upstream sets it, but if this proxy is the edge, there is nothing upstream, and host mode is the clean answer. A monitoring agent — a node exporter, a network collector — that is supposed to see the host's real interfaces and traffic. That's its whole job. And protocols NAT breaks: multicast and broadcast discovery, mDNS, and anything where a service advertises its own address to a peer, because the address it knows about is its private bridge address, which means nothing to anyone else. And the reason that isn't good enough: performance. Host mode does skip the NAT and the veth hop, and that's measurable if you're pushing millions of small packets a second. For essentially every application — a web service, an API, a worker — the bottleneck is your code, your database, or the internet, and the NAT hop is noise. Giving up isolation and port independence for it is a bad trade. If you think you need it for performance, measure first; the answer is usually no. Next: what happens when a container looks up a name.",
}
