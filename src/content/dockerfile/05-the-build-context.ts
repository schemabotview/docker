import type { Section } from '../types'

export const theBuildContext: Section = {
  id: 'the-build-context',
  title: 'The build context',
  scene: 'build-context',
  slide: `## The \`.\` is **uploaded**, not "where to look"

\`docker build .\` tars that directory and sends it to the daemon **before the first instruction runs**. That's the *"Sending build context to Docker daemon"* line, and on a repo with a 2 GB \`.git\` it's 40 seconds of nothing happening.

### Three consequences
- **\`COPY ../secret\` fails.** The parent was never uploaded. There is no flag; move the file or move the context
- **Your \`.env\` is uploaded** even if no \`COPY\` mentions it. It reaches the daemon — which may be a *remote* machine (course 1 §8)
- **It breaks the cache.** \`COPY . .\` with no \`.dockerignore\` busts on any changed file — a log, an editor swapfile, a \`.git\` write

### \`.dockerignore\` is a build-speed tool
Same syntax as \`.gitignore\`, filters **before** the upload. Write it first, not when the build gets slow:

\`\`\`text
.git
node_modules
**/*.log
.env*
\`\`\``,
  narration:
    "There's a dot at the end of docker build dot, and almost everyone reads it as where to find the Dockerfile. It isn't. That argument is the build context, and context means a directory that gets packed into a tar and uploaded, in full, to the daemon, before the first instruction runs. Remember from course one that the CLI is an HTTP client and the daemon might be on another machine entirely. The daemon does the building, so everything the build could possibly need has to be sent to it first. That's the line you've seen and skimmed past: Sending build context to Docker daemon, and then a number. On a clean little project that number is a few megabytes and the line flashes by. On a real repository with a two-gigabyte dot-git directory, a four-hundred-megabyte node_modules and a few build output folders, that number is two and a half gigabytes, and you sit there for forty seconds watching nothing happen before the first instruction even starts. Three consequences, and all three are things people run into. The first: COPY cannot reach outside the context. Write COPY dot dot slash shared slash config and the build fails with a message about the path not being in the context, and there is no flag that fixes it, because the parent directory was never uploaded — it doesn't exist as far as the daemon is concerned. The fix is to move the file inside, or to build from a higher directory with dash f pointing at the Dockerfile. That second option is the one people miss: the context and the Dockerfile's location are independent. The second consequence is a security one, and it's quiet. Everything in the context is uploaded, whether or not any instruction refers to it. Your dot-env file with the database password. Your private SSH key if it happens to live there. Your dot-git directory, which contains every version of every file you have ever committed, including the credentials you removed three years ago. None of that ends up in the image — but all of it crossed the network to the daemon, and on a shared or remote builder that is a real disclosure. The third is about speed, and it is the one that costs you every single day. The cache, which we'll do properly in section eleven, invalidates COPY when the copied files change. COPY dot dot with no ignore file means every file in the context is an input. So your dependency install layer is invalidated by a log file being written, by your editor dropping a swapfile, by git updating an index in dot-git. Your build is randomly slow and you have no idea why. Dot-dockerignore fixes all three at once. Same syntax as gitignore, and it filters before the upload — not before the copy, before the upload, so the tar is smaller and the transfer is faster too. Ignore dot-git, node_modules or vendor, build output, log files, and anything matching dot-env. And write it when you write the Dockerfile, not later when the build has become slow, because by then you've spent the time. One more thing worth knowing: with BuildKit, which is the default now and is the whole of course five, the context transfer is incremental — it sends only what changed since last time. That makes the first build no faster but every subsequent one much better. It does not make dot-dockerignore unnecessary, because the cache-invalidation problem is unchanged. Next: the instruction that makes RUN cd work.",
}
