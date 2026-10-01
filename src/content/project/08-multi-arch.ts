import type { Section } from '../types'

export const multiArch: Section = {
  id: 'multi-arch',
  title: 'Multi-arch',
  scene: 'ship-it',
  slide: `## Cross-compile. Don't emulate.

\`\`\`bash
docker buildx build --platform linux/amd64,linux/arm64 \\
  -t acme/api:1.4.2 -t acme/api:git-$SHA --push .
\`\`\`

Needs the \`docker-container\` driver — the embedded one can't (course 5 §6). And \`--push\`, not \`--load\`: the local store holds one platform per tag.

### The 12-minute difference
Under QEMU, the ARM build's native dependency compiles at emulated speed: **~11 min**. Pinning the build stage to the native architecture with \`FROM --platform=$BUILDPLATFORM\` and letting the toolchain cross-target: **~90 s** (course 5 §7).

That's the difference between multi-arch being routine and being something the team turns off.

### Two tags, one digest
\`1.4.2\` never moves — it's what a rollback names. \`git-$SHA\` answers *"what's actually running?"* (course 9 §5). One build, one digest, both names.`,
  narration:
    "Both architectures, from one command. Buildx build with dash dash platform naming linux amd64 and linux arm64, a couple of tags, and dash dash push. Out comes two real images, each with binaries for its platform, and an index pushed over them so a single reference serves both. Two prerequisites from course five that trip people up. You need the docker-container driver — buildx create with that driver and dash dash use — because the builder embedded in the daemon can't do multi-platform. And you need dash dash push rather than dash dash load, because the local image store holds one image per tag and you just made two; a multi-platform load fails with an error about the exporter. Now the number that matters. The naive way to do this is QEMU emulation, which is what you get by default on Docker Desktop: the ARM build's instructions are translated on your x86 machine. It works, and this application has a native dependency that compiles during install, so that compile runs emulated. Eleven minutes. Every build. Which is the point at which a team quietly removes arm64 from the platform list and the whole thing was for nothing. The fix is to not emulate. Pin the build stage to the native architecture with FROM dash dash platform equals dollar BUILDPLATFORM — an argument BuildKit sets for you — so all the compilation happens at full speed on the machine you're on. Then use TARGETARCH, which BuildKit also provides, to tell the toolchain what to target. Ninety seconds instead of eleven minutes. Course five, section seven. That's the difference between multi-arch being a routine part of the pipeline and being an experiment somebody abandons. And note it needs a toolchain that can cross-target; for a pure-JavaScript service it's trivial because there's nothing to compile, and for the native dependency it means using prebuilt binaries for the target platform where they exist. The tags are course nine, section five: an immutable version tag and a commit tag, both pointing at the same digest from one build. The version tag is what a rollback names — without it, go back to the previous release has no name to refer to. The commit tag answers what is actually running, which is otherwise a question you answer by correlating timestamps. Both, on every build, because they cost nothing: tags are pointers, and pushing four of them doesn't store four images. And for the deploy itself, neither tag: the digest. Course nine, section six. Pin production to the digest and record which digest you shipped, because a push is not a deploy and the gap between them is where we deployed but nothing changed lives. Next: the pipeline that does all of this.",
}
