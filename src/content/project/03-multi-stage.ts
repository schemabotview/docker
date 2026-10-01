import type { Section } from '../types'

export const multiStage: Section = {
  id: 'multi-stage',
  title: 'Multi-stage',
  scene: 'final-dockerfile',
  slide: `## 1.24 GB → 198 MB. And 94 s → **94 s**.

The build stage keeps \`node:20\` with the toolchain. The runtime stage starts fresh from \`node:20-slim\` and \`COPY --from\` brings across \`dist\` and \`node_modules\`. Files cross; **layers don't** (course 5 §3).

### What left the image
The compiler, the headers, the dev dependencies, the source, the npm cache — and the private-registry token, which was in the build stage and isn't in this one.

### Now the useful part
**The rebuild time didn't move.** Editing one source file still costs 94 seconds, because \`COPY . .\` is still above \`npm ci\`. Multi-stage fixed the size and did **nothing** for the speed.

Those are two separate problems with two separate fixes, and conflating them is why people do half the work and are disappointed. Size is a *stage* problem. Speed is an *ordering* problem.

### Also fixed here
\`node:20-slim\` not \`alpine\` — the native dependency has a glibc wheel (course 4 §2).`,
  narration:
    "First pass: size. Split the Dockerfile into two stages. The first keeps node colon twenty with the full toolchain, installs everything including dev dependencies, copies the source in and runs the build. The second starts fresh from node colon twenty slim — a completely new filesystem, nothing carried over — and uses COPY dash dash from to bring across just the dist directory and the production node_modules. Course five, section three: files cross the stage boundary, layers don't. The result is one point two four gigabytes down to a hundred and ninety-eight megabytes. And look at what actually left, because it's more than the number suggests. The C compiler is gone. The header files are gone. The dev dependencies — test runners, linters, type definitions, several hundred megabytes of them — are gone. Your source code is gone; only the built output is there. The npm cache is gone. And the private registry token that the build needed is gone, because it was used in the build stage, and none of that stage's layers are in the final image. So the size win and a meaningful part of the security win arrive together. Now the part I actually want you to take from this section. Rebuild after editing one source file: ninety-four seconds. Exactly what it was before. Not improved at all. Because COPY dot dot is still sitting above npm ci in the build stage, so a source edit still invalidates the install and it still reinstalls everything from nothing. Multi-stage did nothing whatsoever for the development loop. And that's the lesson: image size and build speed are two separate problems with two separate fixes, and they don't help each other. Size is a stage problem — what ends up in the final image. Speed is an ordering problem — what invalidates what. People do multi-stage, see the impressive size number, and stop, and then wonder why their builds are still slow. The next section is the other half. One more decision made in this section that's worth naming: node colon twenty slim rather than alpine. Alpine would be about seventy megabytes smaller. But this application has a native dependency, and course four section two explained why that matters — Alpine is musl, not glibc, so the prebuilt binary wouldn't match and npm would compile it from source, which means the runtime stage suddenly needs a compiler, which undoes the entire point. Slim is Debian, the wheel matches, the install is fast. Seventy megabytes is not worth reintroducing a toolchain for. That's the kind of trade this course is about: the smaller number is not automatically the better answer. Next: the ordering.",
}
