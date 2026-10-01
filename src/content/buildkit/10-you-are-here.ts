import type { Section } from '../types'

export const youAreHere: Section = {
  id: 'you-are-here',
  title: 'You are here',
  scene: 'build-dag',
  slide: `## A graph, not a list

The diagram is §2's. Everything here needed the builder to stop being a loop.

- **§1** — a solver over content-addressed steps, default since Docker 23
- **§2–3** — parallel branches, dead stages never built, and \`COPY --from\` so **files cross and layers don't**
- **§4–5** — \`RUN --mount\`: a cache that survives a miss, a secret that's recorded **nowhere**
- **§6** — \`buildx create --driver docker-container\`, the step tutorials skip; then \`bake\` so CI and your laptop run one build
- **§7** — two platforms from one command. QEMU is easy and slow; cross-compiling with \`TARGETARCH\` is neither
- **§8** — \`mode=max\`, or you export only the cheap layers
- **§9** — \`# syntax=\` versions the language itself

### You can now
Build an image that's small, reproducible, multi-arch, leaks no credential, and rebuilds in seconds on a **cold** CI runner.

### Next
Five courses of images. Course 6 is where containers keep **data**.`,
  narration:
    "Let's close the loop. The diagram is section two's, and the single idea underneath this whole course is that the builder stopped being a loop and became a solver over a graph. Section one laid that out. The legacy builder walked a list: container, commit, repeat, top to bottom. BuildKit parses the whole file into a graph of content-addressed steps and solves it — and it has been the default since Docker 23, so you were already using it throughout course four. Sections two and three were what the graph gives you structurally. Independent branches build at the same time, so a hundred and ten seconds of work finishes in ninety with no flags and no changes. A stage nothing copies from is never built at all, which is why you can keep test and lint stages in the same file for free. The cascade rule from course four still holds along a branch but not across branches, so editing your CSS no longer re-runs your dependency install. And multi-stage builds, where COPY dash dash from carries files across a stage boundary while the layers stay behind — which is a size win of about seven to one on a typical Node app, and more importantly means the compiler, the dev dependencies, the source and anything the build downloaded are simply not in the shipped image. Sections four and five were RUN dash dash mount, and the thing to hold is that both are un-committed by design. A cache mount keeps a package manager's download cache between builds without it ever entering a layer, which turns a ninety-second cache miss into a six-second one — the partial credit that layer caching cannot give you. A secret mount makes a credential available as a file for exactly one instruction and records it nowhere, which is the real answer to the ARG problem course four left open. And an ssh mount forwards your agent so a private key is used without being copied anywhere at all. Section six was the practical gate everybody trips over: plain docker build uses BuildKit embedded in the daemon, and that driver cannot do multi-platform or export cache. Buildx create with the docker-container driver takes five seconds and unlocks both. And bake, because the command line by the end of this course is five wrapped lines that nobody types identically twice — put it in a file and CI and your laptop run the same build by construction. Section seven was two architectures from one command, and the three ways to execute foreign instructions. QEMU is trivial to set up and five to twenty times slower for anything that compiles. Native nodes are full speed and need machines. Cross-compilation avoids the problem entirely, and TARGETARCH is handed to you free, which makes a Go Dockerfile that builds both architectures at full speed about two lines of work. Plus the surprise: push, don't load. Section eight was why CI is slow for a reason that isn't your Dockerfile — a fresh runner has an empty cache, every time — and the fix is exporting the cache to a registry, with mode equals max, because the default exports only the final stage's layers, which on a multi-stage build are precisely the cheap ones. And section nine was the line at the top of the file that versions the Dockerfile language itself, ships it as an image, and turns a missing feature into a parse error when you leave it out. So what can you do now? You can build an image that is small, reproducible, built for both architectures, leaks no credential, and rebuilds in seconds on a machine that has never seen your project before. That is, genuinely, the whole build story. And it means five courses have now gone by without a single container keeping any data. Everything we have run has been ephemeral: the writable layer dies with the container, and we have been treating that as fine. Course six is where that stops being fine — volumes, bind mounts, and what it actually costs to write a file inside a container.",
}
