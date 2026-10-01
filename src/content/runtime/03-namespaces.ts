import type { Section } from '../types'

export const namespaces: Section = {
  id: 'namespaces',
  title: 'Namespaces — the isolation',
  scene: 'namespace-views',
  slide: `## A namespace is a *view*, not a wall

A namespace doesn't hide a process from the host. It changes the answer the kernel gives that process about **one global resource**.

### The six that make a container
- **pid** — its own process tree; your app is **1** in there, \`4417\` out here
- **mnt** — its own root filesystem, so \`/\` is the image
- **net** — its own interfaces, routes and firewall rules
- **uts** — its own hostname (that hex string is the container id)
- **ipc** — its own shared memory and message queues
- **user** — maps container uids to host uids (off by default; see the security course)

### The part to keep
Bottom row: the host sees **ordinary processes**, real pids and all. \`ps aux\` on the host lists everything in every container. Isolation runs **one way only**.`,
  narration:
    "So, the first primitive. And the reason to get this one exactly right is that the wrong mental model — a container is a sealed box — will mislead you for years. Here is the right one. A namespace does not hide anything. A namespace changes what the kernel tells a particular process when it asks about one particular global resource. That is all it is. Take the pid namespace. Normally there is one process table for the machine, and every process has one number in it. Put a process in a new pid namespace and the kernel gives it a second, private numbering that starts at one. So inside container A, nginx asks what processes exist, and the kernel answers with that namespace's answer: nginx is pid 1, and nothing else exists. Inside container B, redis asks the same question and also gets told it is pid 1. Two processes, both pid 1, same machine, no contradiction — because the number was never a property of the machine, it was a property of a view. The mount namespace does the same trick for the filesystem tree. Give a process its own mount namespace and its own root, and slash means the image's root directory instead of the host's. That is why an Alpine container on an Ubuntu host genuinely has Alpine's files: it isn't emulation, it's a different root. The network namespace gives it its own interfaces, its own routing table, its own iptables rules — which is why a container has an eth0 with an address of its own, and why two containers can both listen on port 80 without a conflict. The uts namespace gives it its own hostname, and that hex string you see at the shell prompt is the container id. The ipc namespace separates shared memory and message queues. And the user namespace maps user ids — root inside becoming an unprivileged id outside — which is the one that is off by default, and we'll spend real time on it in the security course. Now the bottom row of the diagram, which is the part I want you to keep. Run ps aux on the host. You see nginx, at pid 4417. You see redis at 4489. You see dockerd. They are ordinary host processes. Not shadows, not proxies — those exact processes. You can kill 4417 from the host and the container stops, because it was never anywhere else. So the isolation runs one way only: the container cannot see out, the host sees everything. And that asymmetry is a gift when you are debugging, because every tool you already own — ps, top, strace, lsof — works on containers from the host without any Docker command at all. Namespaces answer what a process can see. They say nothing at all about how much it can consume — one container can still eat all the memory on the box. That's the second primitive.",
}
