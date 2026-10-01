import type { Section } from '../types'

export const theDrivers: Section = {
  id: 'the-drivers',
  title: 'The drivers',
  scene: 'network-drivers',
  slide: `## You'll use \`bridge\`. Know the others exist.

- **\`bridge\`** — the model from §1. Almost always, and **make your own** (§3)
- **\`host\`** — see below
- **\`none\`** — a namespace with only loopback. A batch job that must not reach the network
- **\`overlay\`** — a bridge spanning several hosts over VXLAN. Swarm's; in Kubernetes the CNI does this job
- **\`macvlan\`** — the container gets its own MAC on the physical LAN and looks like a real machine. For legacy software that insists on it

### \`host\` is not "faster networking"
It means **no network namespace at all** — the container uses the host's stack directly. So:

- \`-p\` is **ignored**. The app binds the host's ports
- Two containers can no longer both use port 80
- No isolation: it can reach anything the host can, **including other services on \`localhost\`**

Reach for it when you genuinely need the real client IP or the host's interfaces — a reverse proxy, a monitoring agent. Not for performance.`,
  narration:
    "Five network drivers. The honest summary is that you'll use bridge nearly always, occasionally host, and the other three are worth recognising rather than learning. Bridge is the model from section one — a virtual switch, a veth per container, NAT on the way out — and the advice from section three stands: make your own rather than using docker0. Host is the interesting one, because its trade-off is routinely misdescribed as faster networking. What host mode actually does is not give the container a network namespace at all. The container's processes use the host's network stack directly. Its eth0 is your eth0. Binding port 80 inside the container binds port 80 on the host, really, with no translation. There is a genuine performance argument — you skip the NAT and the veth hop — but it's small for almost every workload, and the costs are not small. Dash p is ignored entirely, and Docker doesn't even warn you; the flag is silently meaningless. Two containers can no longer both use a port, because they're sharing one port space with each other and with the host. And there's no isolation: the container can reach anything the host can reach, including services bound to the host's own localhost that you assumed nothing could get at. So use host mode when you need what it actually gives you, which is the host's real network view. A reverse proxy that must see genuine client IP addresses rather than the bridge gateway's. A monitoring agent that needs to enumerate the host's interfaces. Something that uses a protocol NAT breaks — multicast, or a service that advertises its own address. Those are real cases. Performance alone is usually not. None gives the container a network namespace with nothing but loopback in it. No route anywhere. That's exactly right for a job that processes data from a mounted volume and should have no way to phone home — an untrusted build step, a batch transform. It's a strong, simple control that costs one flag. Overlay is a bridge that spans multiple hosts. Containers on different machines get addresses on one logical network and talk as if they were on the same switch, with the traffic encapsulated in VXLAN between hosts. It's Swarm's networking, and it's how multi-host container networking worked before Kubernetes. In Kubernetes this job belongs to a CNI plugin — Calico, Cilium, Flannel — and the concept transfers directly even though the implementation doesn't. Macvlan gives the container its own MAC address directly on your physical LAN, so it appears to be a separate machine: your DHCP server hands it an address, other machines on the network can reach it without any port mapping. That's useful for legacy software that insists on being a real host, or for a service that needs to receive broadcast traffic. It also requires promiscuous mode on the interface, which many cloud providers and many switches won't give you, so it's more common on a home lab than in production. Ipvlan is its close relative, sharing the host's MAC, and it exists largely because of those restrictions. Next: publishing a port, and what the flag does underneath.",
}
