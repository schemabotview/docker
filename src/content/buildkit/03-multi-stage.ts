import type { Section } from '../types'

export const multiStage: Section = {
  id: 'multi-stage',
  title: 'Multi-stage builds',
  scene: 'multi-stage',
  slide: `## Files cross the boundary. Layers don't.

\`\`\`docker
FROM node:20 AS build
RUN npm ci && npm run build   # gcc, dev deps, source

FROM node:20-slim
COPY --from=build /app/dist ./dist
RUN npm ci --omit=dev
USER 10001
\`\`\`

**1.2 GB → 180 MB**, and the win isn't only size: the compiler, the dev dependencies, the source and anything the build downloaded are simply **not in the image**. Nothing to exploit, nothing to patch, nothing to leak.

### Name your stages
\`AS build\` is worth it. \`COPY --from=0\` breaks the moment someone inserts a stage.

### Two things this makes free
- \`--target build\` stops at that stage — a full debug image with the toolchain, from the same file
- \`FROM build AS test\` reuses the build stage for tests and ships nothing (§2: it isn't built unless you ask)`,
  narration:
    "Multi-stage is the single biggest size win available in Docker, and the mechanism is one flag. Here's the shape. First stage: FROM node colon 20 — the full image, with gcc and make and headers and everything needed to compile native modules. Install all your dependencies including the dev ones, copy your source in, run the build. This stage is enormous, well over a gigabyte, and it contains everything: the toolchain, the test runners, your source code, the npm cache, and possibly a token the build needed. Second stage: FROM node colon 20 dash slim. Fresh start. This stage's filesystem contains nothing from the first one — it begins from the slim base and nothing else. And then COPY dash dash from equals build, and the path to your built output. That one line reaches into the first stage's filesystem and copies files out. And here is the thing to hold: files cross the boundary, layers do not. The copied files arrive in a brand-new layer belonging to the second stage. None of the first stage's layers are part of the final image — not referenced, not shipped, not pulled by anyone. So the compiler isn't in the image. The dev dependencies aren't in the image. Your source isn't in the image, only the built artifact. And whatever the build downloaded and deleted — which, remember from course three, would normally still be sitting there hidden behind a whiteout — is genuinely gone, because that whole layer chain was discarded. The size number is the headline: a typical Node application drops from around one point two gigabytes to under two hundred megabytes. But the security number is the better argument. The attack surface of the final image is a runtime and your application. There is no compiler for an attacker to use, no package manager, no test framework with a known CVE that you now have to patch in an image where it was never needed. Two practical notes. Name your stages with AS. You can refer to stages by index — COPY dash dash from equals zero — and it works right up until someone adds a stage at the top and every index shifts by one, silently copying from the wrong place. A name costs three characters and cannot break that way. And the target flag. Docker build dash dash target build stops after the named stage and gives you an image of it. So the same Dockerfile that produces your tiny production image also produces a full debug image with the entire toolchain, on demand, with no duplication and no second file to keep in sync. That is genuinely useful when you need to reproduce a build failure. The same trick gives you tests. Add FROM build AS test, then RUN npm test. Nothing in the production path copies from it, so — section two — it is never built during a normal build. But docker build dash dash target test runs your tests inside exactly the environment the build used. One file, three outputs, and you only pay for the one you ask for. Next: the mount that keeps a package cache without shipping it.",
}
