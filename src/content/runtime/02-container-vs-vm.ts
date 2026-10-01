import type { Section } from '../types'

export const containerVsVm: Section = {
  id: 'container-vs-vm',
  title: 'Container vs virtual machine',
  scene: 'container-vs-vm',
  slide: `## One row of difference

Compare the two stacks. They are identical except for one row: the VM brings **its own kernel**, the container **borrows the host's**.

### Everything else follows from that
| | VM | Container |
|---|---|---|
| Kernel | its own | the host's |
| Start | ~30 s | ~50 ms |
| Size | ~1 GB | ~50 MB |
| Isolation | hardware | kernel features |

### The consequences people trip on
- A **Linux container needs a Linux kernel** — on macOS and Windows, Docker Desktop is quietly running a Linux VM for you
- **Weaker isolation**: one kernel bug is one blast radius for everything on the host
- A container is **not a small VM** — it is one confined process, with no init, no syslog, no sshd`,
  narration:
    "This comparison is drawn on every Docker slide in the world, and it is usually drawn badly, so let's be precise, because the precision is the whole lesson. On the left, virtual machines. Physical hardware at the bottom. Above it a hypervisor, whose job is to pretend to be hardware — it presents each guest with what looks like its own CPU, its own memory, its own disk controller. On top of each of those fake machines, a complete guest operating system, and crucially its own kernel, booting as if it owned the box. And only then, at the top, your application. On the right, containers. The same physical hardware. Then one kernel — the host's — and that kernel is shared. And then straight to your application with its libraries. Look carefully at what is missing on the right: there is no guest operating system row at all. That single absent row is the entire difference, and every claim anyone makes about containers is a consequence of it. Start time: a VM has to boot an operating system, so tens of seconds; a container has nothing to boot, it just starts a process, so tens of milliseconds. Size: a VM carries a kernel and a userland, so about a gigabyte; a container carries only what your app needs above the kernel, so often tens of megabytes. Density: you run a handful of VMs on a host and hundreds of containers. And isolation, which is where the trade bites. A VM is isolated by the hypervisor at the hardware boundary, which is a very strong wall. A container is isolated by features of the shared kernel, and a wall built inside the thing you're sharing is a weaker wall. One kernel vulnerability is potentially one blast radius across every container on the host. That's not a reason to avoid containers; it is the reason security work in Docker is real work, and we give it a whole course. Two consequences catch people out in the first week. The first: because a container uses the host's kernel, a Linux container needs a Linux kernel. So how does it run on your Mac? It doesn't — Docker Desktop is running a Linux virtual machine, and your containers are inside that. Containers on top of a VM, which is worth knowing when you wonder why file access from a bind mount is slow. The second is a mental model correction. A container is not a tiny VM. A VM boots an init system, starts syslog, starts sshd, runs cron. A container, by default, is one process. There is no init, there is nothing to ssh into, and nothing collects your logs. Trying to treat it like a small server is the single most common early mistake. Now, the isolation on the right comes from kernel features, and I have been vague about which. Time to stop being vague. There are three primitives, and the next three sections are one each.",
}
