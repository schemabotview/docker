import type { Section } from '../types'

export const theNaiveImage: Section = {
  id: 'the-naive-image',
  title: 'The naive image',
  scene: 'measured',
  slide: `## Make it work first — then measure it

\`\`\`docker
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
CMD npm start
\`\`\`

Five lines, and it works. That's not nothing — a thing that runs is a better starting point than a clever thing that doesn't.

### Now the numbers
**1.24 GB.** **94 s** to rebuild after editing one source file.

### And everything wrong with it, in course order
- \`node:20\` — the full toolchain ships (course 2 §2)
- \`COPY . .\` before \`npm install\` — every edit re-runs the install (course 4 §11)
- No \`.dockerignore\` — \`node_modules\` and \`.git\` are uploaded and bust the cache (course 4 §5)
- \`npm install\`, not \`npm ci\` — the lockfile isn't honoured
- \`CMD npm start\` — shell form, so \`/bin/sh\` is pid 1 and \`SIGTERM\` is swallowed (course 2 §3)
- Runs as **root** (course 10 §2)`,
  narration:
    "Here's the Dockerfile almost everyone writes first, and I want to defend it before we take it apart. Five lines: from node twenty, set a working directory, copy everything in, run npm install, start it. And it works. The container runs, the API responds, the tests pass. That is a genuinely better place to be than a clever Dockerfile that doesn't work, and if you're containerising something for the first time, writing this and then improving it is the right order. Make it work, then make it good. So let's measure it before we judge it. One point two four gigabytes. And ninety-four seconds to rebuild after editing a single source file. Hold those two numbers; everything in the next three sections is measured against them. Now what's wrong with it, and I want to go through these in the order the courses covered them, because that ordering also tells you which ones cost the most. From node colon twenty, the full image, which is about a gigabyte of Debian plus a complete build toolchain: gcc, make, Python, header files. The build needs most of that for the native dependency. The runtime needs none of it, and it all ships. Course two, section two. COPY dot dot before npm install, which is course four section eleven and is where the ninety-four seconds comes from. Any change to any file invalidates the COPY, which cascades to the install, which reinstalls every dependency from nothing. Every time. No dot-dockerignore, so the build context includes node_modules from local development and the dot-git directory, which on this project is four hundred megabytes of upload before the build starts — and worse, any write into dot-git, which git does constantly, busts the COPY. Course four, section five. Npm install rather than npm ci. Install can update the lockfile and resolve differently; ci installs exactly what the lockfile says and fails if they disagree. In a build you want the second. Not a Docker issue, but it's a reproducibility issue and this is where it bites. CMD npm start, in shell form, which means slash bin slash sh is pid 1, which means SIGTERM is swallowed, which means every deploy waits the full ten seconds and then kills the process mid-request. Course two, section three, and it's invisible until you look for it. And it runs as root, because there's no USER line and nothing in the base image adds one. Course ten, section two. Six problems. We're going to fix them in three passes — size, then speed, then hardening — and measure after each. And the order matters for the lesson: the first pass fixes the size and does nothing at all for the rebuild time, which is the most useful thing in this course. Next: multi-stage.",
}
