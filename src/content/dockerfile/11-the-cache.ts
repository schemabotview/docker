import type { Section } from '../types'

export const theCache: Section = {
  id: 'the-cache',
  title: 'The cache, and instruction order',
  scene: 'cache-rule',
  slide: `## A miss **cascades**

A step is reused if its inputs are unchanged **and every step before it was reused**. So one miss invalidates everything below it — which turns Dockerfile authoring into an ordering problem.

### The single highest-leverage habit
Copy the **dependency manifest** first, install, *then* copy the source:

\`\`\`docker
COPY package*.json ./
RUN npm ci          # ← cached until dependencies change
COPY . .            # ← the only thing a code edit busts
\`\`\`

Reversed, every one-character edit re-runs the install. **94 s vs 4 s.**

### What counts as "changed"
- **\`COPY\`** — file **content** (checksummed). An mtime alone doesn't bust it
- **\`RUN\`** — **the command string only.** Docker never looks at what it does. So \`RUN apt-get upgrade\` is a cache hit forever and never actually upgrades anything
- **\`ARG\`** — a changed value busts every step that uses it

\`--no-cache\` is the escape hatch. Reordering is the fix.`,
  narration:
    "This is the most valuable section in the course, because it is the difference between a build you run happily twenty times an hour and one you avoid running. The rule is one sentence: a step is reused if its own inputs are unchanged and every step before it was also reused. The second half is the part that matters. A cache miss is not local. It cascades. The moment one instruction misses, every instruction below it misses too, regardless of whether their own inputs changed — because their input includes the layer underneath, and that layer is new. So the question when you write a Dockerfile is not is this instruction cacheable, it is where in this file is the first thing that changes often. Everything below that point is re-run on every build, so you want that point to be as late as possible. Look at the two columns on the left. Same four instructions, same image, and one source file has been edited. On the left, COPY dot dot comes before the install. The source file changed, so the COPY misses, so npm ci misses by cascade, and ninety seconds of dependency installation runs again — for a change that had nothing to do with dependencies. Every build. On the right, package dot json is copied first, on its own, then npm ci, then the rest of the source. The package files did not change, so that COPY is a hit. npm ci is a hit, and those ninety seconds are skipped entirely. The source COPY misses, and it's the last expensive thing in the file, so nothing cascades past it. Four seconds instead of ninety-four. Nothing was optimised — the instructions are identical. Only the order changed. That pattern generalises to every ecosystem: copy the manifest, install, then copy the source. Package and package-lock for Node, requirements dot txt or pyproject for Python, go dot mod and go dot sum for Go, Cargo dot toml for Rust, pom dot xml for Maven. If you learn one habit from this course, this is it. Now, what counts as changed, because the three instruction types answer differently and one of them is dangerous. For COPY and ADD, Docker checksums the file contents. Content, not timestamps — so touching a file doesn't bust the cache, and a file that git rewrote with identical content doesn't either. For RUN, and this is the important one, the input is the command string and nothing else. Docker does not look at what the command does. It does not check whether the remote repository changed. So RUN apt-get upgrade is a cache hit forever: you wrote it to get security patches, and after the first build it never runs again, and your image quietly stops receiving them. Same for RUN git clone of a branch, RUN curl of a moving URL, RUN pip install without a lock file. If the freshness matters, you need something that changes — a build argument holding a date or a commit SHA, or the whole thing pulled out of the Dockerfile into a step that runs in CI. For ARG, a changed value invalidates every instruction that references it, which is exactly why an ARG holding a git SHA is a deliberate cache-buster and should therefore go as late in the file as possible. Two escape hatches. Dash dash no-cache rebuilds everything from scratch, which is what you want when you suspect the cache is lying to you or before a release build. And dash dash pull re-checks the base image, which the cache otherwise holds onto indefinitely. Both are occasional tools; reordering is the actual fix. And a closing note that points forward: everything here describes the classic linear cache, where one miss ruins everything downstream. BuildKit changes that in a real way — the build becomes a graph rather than a line, independent branches cache independently, and there are cache mounts that survive a miss entirely. That's the next course. One section left: let's put this one together.",
}
