import type { Section } from '../types'

export const cgroups: Section = {
  id: 'cgroups',
  title: 'cgroups — the limits',
  scene: 'cgroup-limits',
  slide: `## The limits are files on disk

A **control group** is a directory under \`/sys/fs/cgroup\`. The limits are files in it. \`--memory=512m\` is \`dockerd\` writing \`536870912\` into \`memory.max\`. No magic layer — you can \`cat\` it.

### What the kernel accounts for
- **memory** — \`memory.max\` the ceiling, \`memory.current\` live usage (what \`docker stats\` reads)
- **cpu** — \`cpu.max\` as *quota per period*: \`150000 100000\` = 1.5 cores' worth
- **io** — read/write bandwidth per device · **pids** — a cap on process count

### The trap: the two failures don't look alike
- Hit the **memory** ceiling → the OOM killer ends the process. **Exit 137**, no log line, nothing in your app's output
- Hit the **CPU** ceiling → nothing dies. It is **throttled**: still healthy, just slow

A mysteriously slow container and a mysteriously dead one are usually the same thing — a limit.`,
  narration:
    "Namespaces gave the container its own view. Nothing so far stops it consuming the whole machine — a container with a memory leak will happily take every byte on the host and get your database killed. The second primitive is what fixes that, and it is refreshingly unmagical. Control groups, cgroups. A cgroup is a directory. It lives under slash sys slash fs slash cgroup, and the limits are files inside it. Look at the path on the diagram: system dot slice, then docker dash and the container id dot scope. Inside that directory, cgroup dot procs is a plain text file listing the process ids that this cgroup accounts for. And memory dot max contains a number. When you type docker run dash dash memory equals 512m, this is the entire mechanism: dockerd converts that to bytes and writes 536870912 into memory dot max. There is no Docker layer policing your container at runtime. Docker wrote one number into one file, and from then on the Linux kernel is doing the accounting, exactly as it would for a systemd service. You can cat these files yourself. You can echo into them yourself, if you like. And memory dot current, next to it, holds live usage — that is the file docker stats is reading. Four controllers matter in practice. Memory, with a ceiling and live accounting. CPU, which is worth pausing on because the encoding confuses everyone: cpu dot max holds two numbers, a quota and a period, both in microseconds. A hundred and fifty thousand over a hundred thousand means this cgroup may use a hundred and fifty milliseconds of CPU time in every hundred millisecond window — which is one and a half cores' worth. That is what dash dash cpus equals one point five compiles to. IO, which limits read and write bandwidth per device. And pids, which caps how many processes can exist — the cheap defence against a fork bomb. Now the trap, and it is the reason this section exists rather than being a footnote about flags. The two limits fail in completely different ways, and neither announces itself. Exceed the memory ceiling and the kernel's OOM killer terminates the process. Immediately, with no grace period, no signal your application can handle, nothing written to your logs. What you see is a container that stopped, and an exit code of 137. Remember that number — 137 is 128 plus 9, and 9 is SIGKILL. Exit 137 means out of memory, essentially always. Exceed the CPU ceiling and nothing dies at all. The container is throttled: the kernel simply stops scheduling it until the next period begins. Your health checks pass. Your logs look fine. Your latency has quietly tripled. So when you meet a container that died for no reason, check memory; when you meet one that is inexplicably slow, check CPU. In both cases the answer is usually a limit, and the limit is a file you can read. Two primitives down. The third is about what the container's filesystem actually is.",
}
