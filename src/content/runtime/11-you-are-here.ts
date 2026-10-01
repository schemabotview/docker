import type { Section } from '../types'

export const youAreHere: Section = {
  id: 'you-are-here',
  title: 'You are here',
  scene: 'engine-chain',
  slide: `## One chain, three primitives

The diagram is §6's, deliberately — every section was a piece of it.

- **§1–2 why · vs VM** — the missing *guest kernel* row is the whole trade
- **§3 namespaces** — what \`runc\` sets up: the container's *view*
- **§4 cgroups** — what \`runc\` writes: what it may *consume*
- **§5 layers** — what \`containerd\` unpacks: its *disk*
- **§7 OCI** — all of it is specified, so none of it is Docker's alone
- **§8–9 install · first run** — the chain, printing its own version numbers

### You can now
Read \`docker version\` and \`docker info\` as a description of this diagram. Tell exit **137** from a throttle. Find a container from the host with \`ps\`. Say why the socket is root.

### You can't yet
**Build an image** — you've run other people's. Course 2 drives containers properly; course 4 builds one.`,
  narration:
    "Let's close the loop. The diagram on the left is section six's, and it's back on purpose, because every section of this course was a piece of it. We started with the failure. An application needs far more than the code you ship — an interpreter, libraries, system libraries — and when the host supplies those from itself, the environment becomes an unwritten contract that no two machines honour the same way. The container's answer is to put that whole lower stack inside the artifact. Then section two drew the comparison precisely: the container stack is the VM stack with exactly one row removed, the guest kernel. Everything true about containers — that they start in milliseconds, that they're tens of megabytes, that their isolation is weaker than a VM's, that a Linux container needs a Linux kernel and therefore a hidden VM on your Mac — is a consequence of that single missing row. Sections three, four and five were the three kernel primitives, and you can now point at where each one happens on this diagram. Namespaces are what runc sets up just before it execs: the container's view of the process table, the filesystem, the network, the hostname. And the thing to hold onto is that the isolation runs one way — the host sees every container process as an ordinary process, with a real pid, which makes every debugging tool you already own work from outside. Cgroups are what runc writes: files under sys fs cgroup that the kernel then enforces. Memory over the ceiling means the OOM killer and exit 137; CPU over the ceiling means silent throttling, which looks like a performance mystery rather than a limit. Layers are what containerd unpacks: read-only lowerdirs shared by every container from that image, one writable upperdir each, copy-on-write when something in a lower layer is edited. Section six assembled them into the chain: a CLI that is only an HTTP client, a daemon, containerd, one shim per container, and runc, which does the confinement work and then exits. Which is what explains docker over SSH, containers surviving a daemon restart, the socket being root-equivalent, and Kubernetes dropping dockerd while keeping containerd. Section seven made the point that none of this is Docker's private property — three OCI specifications, many implementations — so what you're learning is the interface to the whole ecosystem. And sections eight and nine made all of it visible: two version blocks, containerd and runc printing their own versions, overlay2 named in docker info, and a first run where pid 1, an Alpine root filesystem and a hex hostname could be checked at a prompt rather than taken on trust. So what can you do now? You can read docker version and docker info as a description of this diagram. You can tell the difference between a container that was killed for memory and one that is being throttled. You can find a container's process from the host and inspect it with ordinary Linux tools. And you can say, correctly, why mounting the Docker socket is handing over root. What you cannot do yet is build an image — everything we've run belongs to somebody else. Next, course two drives containers properly: the full anatomy of docker run, pid 1 and signal handling, restart policies, resource limits, logs and exec. Then course three on images and digests, and course four, where you write your first Dockerfile.",
}
