import type { Section } from '../types'

export const cache: Section = {
  id: 'cache',
  title: 'Cache',
  scene: 'final-dockerfile',
  slide: `## 94 s → 6 s → 4 s

Three changes, and none of them touches the image.

**1. Reorder.** \`COPY package*.json ./\` then \`RUN npm ci\` then \`COPY . .\`. A source edit no longer invalidates the install. **94 s → 6 s** (course 4 §11).

**2. A cache mount.** \`RUN --mount=type=cache,target=/root/.npm npm ci\`. Now when the install *does* re-run — because a dependency changed — it re-downloads only what's new instead of everything. The 90-second miss becomes about 6 (course 5 §4).

**3. \`.dockerignore\`.** \`.git\`, \`node_modules\`, \`dist\`, \`*.log\`. Context upload 412 MB → 3 MB, and a stray \`.git\` write no longer busts \`COPY . .\`. **6 s → 4 s** (course 4 §5).

### The shape to remember
**Reorder first** — it's free and it's the big one. The cache mount is for the *miss*, not the hit. \`.dockerignore\` is both a speed fix and a leak fix.`,
  narration:
    "Second pass: speed. Three changes, none of which touches the image at all — the output is byte-identical, and the rebuild goes from ninety-four seconds to four. Change one is the reorder, and it's the big one. Instead of copying everything and then installing, copy just package dot json and package-lock dot json, run npm ci, and then copy the source. Now a source edit invalidates only the final COPY, and npm ci is a cache hit, and the ninety seconds of dependency installation is skipped entirely. Ninety-four seconds to six. That's course four, section eleven, and it is free — no new tools, no flags, just four lines in a different order. If you do one thing to a slow Dockerfile, do this. Change two is a cache mount, and it addresses a different case. The reorder helps when dependencies haven't changed. But when you add a package, the manifest changes, npm ci misses, and it reinstalls from an empty filesystem — downloading every dependency again, not just the new one. A cache mount on the npm cache directory means the download cache persists across builds, outside any layer, so the re-run finds everything already downloaded and fetches only what's new. That ninety-second miss becomes about six. Course five, section four, and note what it's for: it doesn't make the hit faster, it makes the miss cheaper. Those are different wins and you want both. Change three is a dot-dockerignore, which I'd argue is the most underrated file in this entire subject. Ignore dot-git, node_modules, dist and log files. Two things improve at once. The context upload goes from four hundred and twelve megabytes to three, which removes several seconds before the build even starts. And — the subtler one — a write into dot-git no longer invalidates COPY dot dot. Git writes into that directory constantly, on every command, so without the ignore file your final COPY was busting on activity that had nothing to do with your code, and your build times were mysteriously inconsistent. Six seconds to four, and much more importantly, four seconds reliably. There's a security dimension too: without the ignore file your dot-env and your entire git history were being uploaded to the daemon on every build. Course four, section five. So the shape to remember. Reorder first, because it's free and it's the largest single win. Add a cache mount for the case where the install does re-run. And write the dot-dockerignore on day one, not when the build gets slow, because by then you've paid for it several hundred times. And notice what didn't change across this whole section: the image is still a hundred and ninety-eight megabytes. Speed and size really are independent. Next: the hardening, and what it costs.",
}
