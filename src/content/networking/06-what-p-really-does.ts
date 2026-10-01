import type { Section } from '../types'

export const whatPReallyDoes: Section = {
  id: 'what-p-really-does',
  title: 'What -p really does',
  scene: 'publish-dnat',
  slide: `## It writes an \`iptables\` DNAT rule

\`-p 8080:80\` adds a rule to the \`nat\` table: packets arriving for host port 8080 get their **destination rewritten** to \`172.17.0.2:80\` and routed across the veth pair.

\`\`\`bash
iptables -t nat -L DOCKER -n
\`\`\`

### Four things this explains
- **The container sees port 80**, and has no idea 8080 was involved. So health checks and config inside must use the *container* port
- **Bind \`0.0.0.0\`, not \`127.0.0.1\`.** Loopback inside the namespace is unreachable from outside it. The single most common "port published, nothing answers"
- **The source IP is the gateway**, not the client. Your access logs say \`172.17.0.1\` until you put a real proxy in front
- **UFW doesn't apply.** DNAT happens in \`PREROUTING\`, *before* the \`filter\` chain UFW writes to. Your deny rule is real and irrelevant

### The fix for that last one
Bind to \`127.0.0.1\` and put the proxy in front — don't fight iptables.`,
  narration:
    "Dash p is not a Docker feature in any deep sense. It's dockerd writing a firewall rule. Specifically, a DNAT rule — destination network address translation — in iptables' nat table. You can look at it: iptables dash t nat dash L DOCKER dash n, and there's your mapping, in a chain Docker maintains. Follow a packet. A client connects to your host on port 8080. It arrives on the host's real interface and hits the PREROUTING chain of the nat table, where Docker's rule matches and rewrites the destination address and port to the container's address and port 80. The packet is then routed — and the route for 172 dot 17 dot 0 dot 2 goes across the veth pair into the container's namespace. The container's application, listening on port 80, receives an ordinary connection. Four consequences, and they're four of the most common Docker networking questions. First: the container sees port 80. Not 8080. It has no idea 8080 was ever involved, because the rewriting happened before the packet reached it. So anything inside the container — a health check URL, a config file, a self-referential link — must use the container port. People put the host port in a HEALTHCHECK and it fails for reasons that look supernatural. Second, and this is the most common failure in all of Docker networking: your application must bind 0 dot 0 dot 0 dot 0, not 127 dot 0 dot 0 dot 1. Remember these are separate namespaces. Localhost inside the container is the container's own loopback, and a packet arriving over the veth pair is not on loopback, so a process bound to localhost inside the container is unreachable from outside it. Everything looks right — the port is published, docker port confirms the mapping, the process is running and listening — and connections are refused. Almost every framework defaults to localhost in development and needs telling to bind all interfaces in a container. Third: the source address your application sees is the bridge gateway, 172 dot 17 dot 0 dot 1, not the real client. So your access logs are useless for anything IP-based, your rate limiting by IP limits everyone as one, and your geolocation thinks everyone is in the same place. The fix is the ordinary one for any reverse-proxied system: put a real proxy in front, have it set X-Forwarded-For, and have your application trust it. Fourth, and this one has caused real breaches: UFW does not protect published ports. UFW writes rules into the filter table's INPUT chain. Docker's DNAT happens in the nat table's PREROUTING chain, which runs first, and the rewritten packet is then forwarded rather than delivered locally, so it goes through FORWARD rather than INPUT. Your UFW deny rule is real, correctly written, and simply on a path the packet never takes. People publish a database port on a cloud VM, check that UFW denies 5432, and conclude they're safe. They're not. There are ways to fight this — a DOCKER-USER chain exists specifically so you can insert rules that run before Docker's — but the much better answer is not to fight it. Bind the port to 127 dot 0 dot 0 dot 1 so it's never publicly exposed in the first place, and put a proxy in front for anything that genuinely should be public. Next: how containers reach each other without any of this.",
}
