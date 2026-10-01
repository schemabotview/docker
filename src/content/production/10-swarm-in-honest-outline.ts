import type { Section } from '../types'

export const swarmInHonestOutline: Section = {
  id: 'swarm-in-honest-outline',
  title: 'Swarm, in honest outline',
  scene: 'swarm-outline',
  slide: `## What changes when one host becomes several

Four things, and Compose does none of them: **placement** (which host), **rescheduling** (a host dies), **a network across hosts** (overlay, course 7 §4), and **rolling updates**.

### Swarm does all four, in about ten minutes
\`docker swarm init\`, then join tokens. No separate control plane to operate. And \`docker stack deploy\` takes **the Compose file you already have**.

### Why it lost anyway
Not because it's bad — it's stable and maintained. Because the **ecosystem** went to Kubernetes: operators, Helm, CNI, service meshes, managed control planes, and the hiring market. The skills transfer one way, and it isn't this way.

### The honest decision
- **One host** → Compose. Genuinely fine; plenty of production runs this way
- **Two or three, small team** → Swarm is reasonable, and far less to operate
- **Beyond that** → Kubernetes, and that's its own concept

Every concept transfers either way.`,
  narration:
    "The predecessor material for this subject gave Swarm sixteen sections. This is one, and the reason is not that Swarm is bad — it's that the decision is what matters now, not the command set. So let's do the decision properly. Start with what actually changes when one host becomes several, because Compose does none of it. Placement: something has to decide which host runs a given container, and to know how much capacity each host has. Rescheduling: a host dies at three in the morning, and its containers need to reappear somewhere else without anyone waking up. A network across hosts: containers on different machines need to reach each other by name, which needs an overlay network — the multi-host bridge from course seven. And rolling updates: replacing replicas one at a time, waiting for each to report healthy, with a way to roll back. Those four are what an orchestrator is. Swarm does all four, and the striking thing is how little setup it takes. Docker swarm init on one machine, then a join command on the others, and you have a cluster. There's no separate control plane to install and operate — it's the Docker daemons you already have, talking to each other with mutual TLS they set up themselves. And docker stack deploy takes a Compose file. The same file, with a deploy section added for replicas and update policy. So the distance from a working Compose stack to a three-node cluster is genuinely an afternoon. Compare that to standing up and operating Kubernetes and it's not close. So why did it lose? Not on technical merit for small clusters, and not because it's abandoned — it's maintained and stable, and stacks that run on it keep running. It lost because the ecosystem went elsewhere. Every operator, every Helm chart, every CNI plugin, every service mesh, every managed offering from every cloud, every monitoring integration, and most of the documentation written since about 2018 targets Kubernetes. If you need a Postgres operator that handles failover, one exists for Kubernetes and doesn't for Swarm. And the hiring market followed: Kubernetes experience transfers to a Swarm shop and the reverse is much less true. So, the honest decision. One host: Compose, and don't apologise for it. A great deal of production software runs on a single well-managed machine, and the operational simplicity is worth real money. Two or three hosts with a small team and no need for the ecosystem: Swarm is a defensible answer and a fraction of the operational burden — you should just know you're choosing a road with less traffic on it. Beyond that, or any time you'll want something from the ecosystem, or if the people running it need the skills to be portable: Kubernetes. And that's a separate concept, with its own course, because it is genuinely a large subject. What I'd leave you with is that none of the concepts are wasted either way. Services, replicas, desired state, rolling updates, health-gated deploys, overlay networking, declarative configuration in version control — Swarm teaches all of them, and Kubernetes uses all of them under different names. Learning Swarm is not a detour; it's the same ideas at a smaller scale. One section left.",
}
