import type { Section } from '../types'

export const multiPlatform: Section = {
  id: 'multi-platform',
  title: 'Multi-platform builds',
  scene: 'multi-platform',
  slide: `## One command, two images, one index

\`\`\`bash
docker buildx build --platform linux/amd64,linux/arm64 \\
  -t acme/api:1.4 --push .
\`\`\`

Two real images, and an **index** pushed over them (course 3 §7). Needs the \`docker-container\` driver (§6).

### Three ways to execute the foreign instructions
- **QEMU** — one machine, \`binfmt_misc\` translates. Trivial to set up, and **5–20× slower** for anything that compiles
- **Native nodes** — one builder per architecture. Full speed; you need the machines
- **Cross-compile** — build on your own arch, target the other. Go, Rust and Zig do this well, and it beats both

### Two first-time surprises
- **\`--push\`, not \`--load\`.** The local image store holds one platform, so loading a multi-arch result fails. Push it, or build one platform at a time
- **\`TARGETPLATFORM\` is free.** Declare \`ARG TARGETARCH\` and use it: \`GOARCH=$TARGETARCH go build\` is the whole cross-compile story`,
  narration:
    "Course three explained how one tag serves several architectures: an index listing one manifest per platform, and the daemon picking the entry that matches itself. Now we build one. The command is buildx build with dash dash platform and a comma-separated list, a tag, and dash dash push. What comes out is two genuinely separate images, each with its own layers containing binaries for that architecture, and an index pushed over the top pointing at both. Anyone pulling the tag gets the right one automatically. You need the docker-container driver from the last section; the embedded one can't do this. Now, the part worth thinking about, because there are three fundamentally different ways to execute instructions for an architecture your machine isn't. The first is emulation. Linux has a mechanism called binfmt_misc that lets the kernel hand a foreign binary to an interpreter, and QEMU is that interpreter. Register it once and your x86 machine can run ARM binaries, so BuildKit can run every RUN instruction for the ARM image on your Intel laptop. It's the easiest to set up — essentially one command — and it's what happens by default on Docker Desktop. The cost is speed. QEMU translates instructions as it goes, and for compute-heavy work that's between five and twenty times slower. For a Dockerfile that just copies files in, you won't notice. For one that compiles a native extension or runs a webpack build, a ninety-second step becomes fifteen minutes, and your CI times out. The second is native nodes. You create a builder with more than one node, each on hardware of its own architecture — an ARM machine and an x86 machine — and buildx dispatches each platform's work to the machine that speaks it natively. Full speed for both. The cost is that you need the machines, though on any cloud that's an ARM instance, which is cheap and often cheaper than x86. For a project where ARM matters, this is the grown-up answer. The third avoids the problem entirely: cross-compilation. Some toolchains can produce a binary for another architecture without running anything foreign. Go does this natively — set GOARCH and it emits an ARM binary from an x86 machine at full speed. Rust and Zig do it well too. If your language supports it, this is strictly the best option: no emulation, no extra machines, no slowdown. And BuildKit makes it easy, which brings us to the second surprise. Inside a multi-platform build, BuildKit sets some arguments for you: TARGETPLATFORM, TARGETOS and TARGETARCH. Declare them with a bare ARG and they're available. So a Go Dockerfile becomes: ARG TARGETARCH, then RUN with GOARCH equals dollar TARGETARCH, go build. The builder stays on your native architecture the whole time — the FROM dash dash platform equals dollar BUILDPLATFORM idiom pins it there — and the compiler does the cross-targeting. That's a build that produces both architectures at full speed on one machine. The other surprise is the one everybody hits first. Dash dash load, which puts the result into your local image store, does not work for a multi-platform build, because the local store holds one image per tag and you just made two. You get an error about the docker exporter not supporting multiple platforms. Use dash dash push to go straight to a registry, which is what you want for a real build anyway, or build a single platform when you want to test locally. Next: making the cache survive a CI runner.",
}
