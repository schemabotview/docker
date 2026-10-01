import type { Section } from '../types'

export const theMentalModel: Section = {
  id: 'the-mental-model',
  title: 'The mental model',
  scene: 'net-topology',
  slide: `## Three Linux primitives. That's all of it.

- **Network namespace** — each container gets its own interfaces, routing table and firewall rules (course 1 §3). Which is why two containers can both listen on port 80
- **veth pair** — a virtual cable, one end inside the container (it calls it \`eth0\`), the other on the host
- **Bridge** — a virtual switch. The host end of every cable plugs into it. \`docker0\` is one

### That's the whole picture
A container's \`eth0\` is one end of a cable into a switch on your host. Outbound traffic is **NAT'd** through the host's real interface, like any home router.

### Everything else is these doing their ordinary job
DNS between containers, \`-p\`, \`host\` mode, overlay networks — none of it is Docker magic. It is namespaces, cables and switches, configured differently.

Which means every Linux networking tool you already know still works.`,
  narration:
    "Docker networking has a reputation for being mysterious, and it isn't. It's three Linux primitives that predate Docker, wired together in a way you'd probably design yourself. Get the three and nothing in this course will surprise you. The first is the network namespace, which we met in course one. A network namespace is a complete, independent copy of the kernel's networking state: its own interfaces, its own routing table, its own iptables rules, its own socket table. Each container gets one. And that immediately explains something that otherwise seems impossible — two containers both listening on port 80 with no conflict. They aren't sharing a port space. There are two port spaces. Port 80 in container A and port 80 in container B are as unrelated as port 80 on two different machines. The second is the veth pair. A veth is a virtual Ethernet device that always comes in pairs, and the pair behaves like a cable: anything sent in one end comes out the other. Docker creates a pair per container, puts one end inside the container's namespace — where it's named eth0, because from inside it looks like an ordinary network card — and leaves the other end on the host, where you'll see it in ip link with a name like veth-something-hex. The third is the bridge. A Linux bridge is a virtual switch implemented in the kernel. It has ports, it learns MAC addresses, it forwards frames — it behaves like a physical switch sitting on your desk, except in software. Docker creates one called docker0 on install, and the host end of every container's veth cable plugs into it. Now put them together, which is the diagram. Container A has eth0 with address 172.17.0.2. That's one end of a cable whose other end is plugged into the docker0 switch. Container B has 172.17.0.3, same arrangement. The switch itself has an address, 172.17.0.1, which is the gateway the containers route through. And when a container talks to the internet, the packet goes down its cable to the bridge, the host routes it, and iptables rewrites the source address to the host's own — network address translation, exactly like the router in your house does for your laptop. There's the whole model. A container is a machine on a small private switched network behind a NAT router, and the switch and the router are your host. Now, why does this matter more than just learning the flags? Two reasons. The first is that every remaining section is one of these three doing something ordinary. Container-to-container DNS is a resolver on the bridge network. Dash p is a NAT rule. Host mode is skipping the namespace. An overlay network is a bridge that spans several machines. None of it is a new mechanism. The second is that every Linux networking tool you already know works, unchanged. Ip addr, ip route, ss, tcpdump, dig, iptables dash L — they all work inside a container's namespace, and they all work on the host to look at the bridge and the veths. You are not debugging Docker; you're debugging Linux networking that Docker configured. That reframing is worth more than any individual command in this course. Next: the one thing about the default bridge that everyone gets caught by.",
}
