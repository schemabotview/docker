import type { Section } from '../types'

export const troubleshooting: Section = {
  id: 'troubleshooting',
  title: 'Troubleshooting',
  scene: 'net-troubleshoot',
  slide: `## Four questions, in this order

"It can't reach the database" has four different causes. Asking in order rules out a layer each time, so the answer arrives in four commands.

1. **Same network?** \`docker network inspect\` — are *both* actually attached? Surprisingly often, no
2. **Does the name resolve?** \`getent hosts db\` from inside. No answer → the default bridge (§2)
3. **Is the port open?** \`nc -z db 5432\`. *Refused* means nothing is listening there; *timeout* means something is dropping it
4. **What is it bound to?** \`ss -lntp\` **inside the target**. \`127.0.0.1:5432\` is unreachable from another namespace (§6) — the most common answer of the four

### When the image has no tools
\`docker run --net container:api nicolaka/netshoot\` — join its namespace and you have \`dig\`, \`ss\`, \`tcpdump\`, \`curl\` on the same stack (course 2 §9).

### Refused vs timeout
**Refused** = reached the host, nothing listening. **Timeout** = never arrived. Two different problems.`,
  narration:
    "The container can't reach the database. That sentence covers at least four unrelated problems, and the difference between five minutes and an afternoon is asking the questions in an order that rules out a layer each time. Question one: are they on the same network? Docker network inspect, the network name, and look at what's attached. This is first because it's the cheapest and because the answer is no more often than anyone expects — a container started without the network flag, two Compose projects that each made their own network, a service renamed in one place and not the other. If they're not on the same network, nothing else you investigate matters. Question two: does the name resolve? From inside the source container, getent hosts and the target's name. If that returns nothing, you have a DNS problem, and there are exactly two likely causes: you're on the default bridge, which has no resolver at all — section two — or the name is wrong. Note it's the container name or alias, not the image name and not the hostname you set, which is a distinction that catches people. Use getent rather than ping, because ping may not be installed, and rather than dig, because dig bypasses libc and can give you a different answer from the one your application gets. Question three: is anything listening on that port? Netcat dash z against the name and port. And here the distinction between the two failure modes does real work. Connection refused means the packet arrived at the target and the kernel there said nothing is listening on this port — so networking is fine and the problem is the service. Timeout means the packet never got an answer at all, which points at a network policy, a firewall, or the wrong host entirely. Those are different investigations and the error text tells you which one you're in. Question four, and this is the most common answer of the four: what is the target actually bound to? Get into the target container and run ss dash lntp. If you see 127 dot 0 dot 0 dot 1 colon 5432, there's your answer — section six. The service is listening on its own loopback, which is unreachable from any other namespace. Everything else in your setup is correct. One configuration line in the target service fixes it. This is worth checking early with databases in particular, because several of them default to localhost-only in their shipped configuration and the container image may not override it. Now, all four of those commands need tools that a slim or distroless image doesn't have. That's course two, section nine, and the answer is the same: run a debugging container joined to the target's network namespace. Docker run with dash dash net container colon and the container name, using netshoot, and you have dig, ss, tcpdump, curl, ip and everything else, operating on exactly the same network stack as the application. You are not approximating its view; you are inside it. Two extras for the harder cases. Tcpdump in that netshoot container shows you whether packets are leaving at all, which settles arguments quickly. And on the host, iptables dash t nat dash L DOCKER dash n shows the published-port rules, which is where to look when a published port doesn't answer and the container is definitely listening. One section left: let's put the course together.",
}
