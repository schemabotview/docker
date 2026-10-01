import type { Section } from '../types'

export const resourceLimits: Section = {
  id: 'resource-limits',
  title: 'Resource limits',
  scene: 'cgroup-limits',
  slide: `## The flags are §4 of course 1, typed

The diagram is the cgroup one, deliberately. \`--memory=512m\` **is** \`dockerd\` writing \`536870912\` into \`memory.max\`. Nothing else happens.

- \`--memory 512m\` → the ceiling. Exceed it and the **OOM killer** ends the process: **exit 137**, no log line
- \`--memory-reservation 256m\` → a **soft** target, honoured only under host pressure
- \`--cpus 1.5\` → \`cpu.max = 150000 100000\` — quota per period. Exceed it and you are **throttled**, not killed
- \`--cpuset-cpus 0,1\` → pin to specific cores · \`--pids-limit 100\` → cap process count

### Unset means unlimited
A container with no \`--memory\` can take **every byte on the host** — including the one your database needed.

### Watch it live
\`docker stats\` reads \`memory.current\`. **Java and Node need telling**: older runtimes read the *host's* RAM, size a heap for it, and get OOM-killed inside a 512 MB box.`,
  narration:
    "This section has no new diagram, and that is deliberate — it is course one's cgroup picture, back, because the whole point is that the flags you are about to learn are not a new mechanism. Dash dash memory equals 512m is dockerd converting that to bytes and writing five hundred and thirty-six million, eight hundred and seventy thousand, nine hundred and twelve into a file called memory dot max. That is the entire implementation. There is no Docker component watching your container's memory; the Linux kernel is doing the accounting, as it would for any cgroup. Start with memory. Dash dash memory sets a hard ceiling, and exceeding it means the kernel's OOM killer terminates the process. Not throttles, not warns — terminates, immediately, with exit code 137 and nothing at all in your application's logs, because the process never got a chance to write one. There is also dash dash memory-reservation, which is a soft limit: the kernel only pushes you back toward it when the host is actually under memory pressure. Think of the reservation as what you expect to use and the limit as what you must never exceed. Then CPU. Dash dash cpus takes a decimal — one point five means one and a half cores' worth — and compiles into cpu dot max as a quota and a period in microseconds. And I want to repeat the contrast from course one because it is the thing that turns a limit into a mystery. Exceeding the memory limit kills you. Exceeding the CPU limit does not kill anything: the kernel simply stops scheduling your processes until the next hundred-millisecond window opens. Your container stays up. Your health check passes. Your latency quietly goes through the roof. If you want to pin a container to particular cores rather than give it a share of all of them, dash dash cpuset-cpus takes a list — which matters for latency-sensitive work where being moved between cores costs you cache. And dash dash pids-limit caps how many processes may exist, which is the cheap defence against a fork bomb or a runaway worker pool. Now the default, which people do not think about until it bites: unset means unlimited. A container with no memory flag can allocate every byte on the host. Docker does not impose a sensible default for you. So one leaky container on a shared host can get the database OOM-killed instead of itself, because the kernel picks its victim by a badness score and not by whose fault it was. Setting a limit is not only about constraining the container — it is about containing the blast radius. Watch it all with docker stats, which reads memory dot current and the CPU accounting live. And finally, a trap specific to managed runtimes, which is worth knowing because it produces a container that is OOM-killed while apparently using very little memory. Older JVMs and older Node versions determine how much memory they can use by asking the operating system how much RAM the machine has. Inside a container, that question returns the host's total — sixty-four gigabytes, say — so the runtime happily sizes itself a twenty-gigabyte heap while living in a five-hundred-megabyte cgroup. Modern Java is container-aware and reads the cgroup instead, but if you are on anything older, or on Node, you have to tell it explicitly: dash XX MaxRAMPercentage for the JVM, dash dash max-old-space-size for Node. Next: the four places an environment variable can come from, and which one wins.",
}
