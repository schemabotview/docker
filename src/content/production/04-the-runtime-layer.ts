import type { Section } from '../types'

export const theRuntimeLayer: Section = {
  id: 'the-runtime-layer',
  title: 'The runtime layer',
  scene: 'runtime-layer',
  slide: `## \`runc\` is replaceable

Course 1 §6's chain, from the operator's side. \`containerd\` → shim → **an OCI runtime**, and the last box is the one you can swap, because it's a spec (course 1 §7).

- **\`runc\`** — the reference. Namespaces and cgroups, nothing more
- **\`crun\`** — the same contract in C. Faster start, lower memory. A drop-in
- **\`gVisor\`** — implements the syscall interface **in userspace**, so the host kernel is barely reachable. The strongest answer for genuinely untrusted code that isn't a VM
- **\`Kata\`** — a real lightweight VM per container. Strongest isolation, highest cost

\`\`\`json
"default-runtime": "runsc"
\`\`\`
or per container with \`--runtime\`.

### Why an operator cares
Running **other people's code** — CI on pull requests, user-submitted jobs — is where course 10 §1's shared kernel is the wrong trade. This is the dial for it. It's also the Kubernetes seam: dropping \`dockerd\` kept exactly this half.`,
  narration:
    "Course one introduced the chain: CLI, socket, dockerd, containerd, a shim per container, and runc. This section looks at the bottom of it from an operator's point of view, and the interesting fact is that the last box is replaceable. It's replaceable because it's a specification — the OCI runtime-spec from course one. Containerd hands a bundle and a config to something that implements that spec, and it doesn't care what. So you have choices. Runc is the reference implementation and the default. It's written in Go, it does what we described in course one — creates the namespaces, writes the cgroup files, execs your process — and then exits. Crun is the same contract implemented in C. It starts faster and uses less memory, which is invisible for a long-running service and meaningful if you're starting thousands of short-lived containers, as a CI system does. It's a drop-in: same spec, same behaviour, smaller footprint. Red Hat's tooling defaults to it. GVisor, which we've mentioned twice and can now place properly, is a different idea entirely. Instead of letting your container's syscalls reach the host kernel, gVisor implements the Linux syscall interface itself, in userspace, in a process called Sentry. Your container talks to Sentry; Sentry makes a much smaller and more carefully controlled set of calls to the real kernel. So the attack surface from course ten — the shared kernel being the only wall — shrinks enormously, because the container barely touches it. The cost is a performance overhead that's modest for CPU-bound work and noticeable for syscall-heavy work, and some syscalls aren't implemented, so some software doesn't run. Kata Containers goes further: each container gets a real, lightweight virtual machine with its own kernel. That's the VM isolation from course one, at container granularity and with container ergonomics. Strongest isolation available, highest cost in memory and start time. You configure either a default runtime in daemon dot json or pick one per container with dash dash runtime. Now, why would an operator care? One situation, and it's specific: when you're running other people's code. CI that builds pull requests from anyone. A platform that runs user-submitted jobs. A multi-tenant service where tenants supply the workload. That's exactly the case where course ten's shared kernel is the wrong trade, and where all the hardening in that course — non-root, capabilities, seccomp — is defence in depth rather than a boundary you'd bet on. GVisor or Kata is the dial for it, and knowing they exist means you don't have to choose between a shared kernel and a full VM per workload. For running your own code, runc is fine and you should stay with it. And one more thing this diagram settles. When Kubernetes announced it was removing dockerd support, this is the half it kept: containerd, the shim, and an OCI runtime. That's why nothing about your images or your Dockerfiles changed — the layer that was dropped was never the one that defined the artifact. Next: watching what's running.",
}
