import type { Section } from '../types'

export const hardened: Section = {
  id: 'hardened',
  title: 'Hardened',
  scene: 'final-dockerfile',
  slide: `## The whole of course 10, and both numbers are unchanged

**198 MB. 4 s.** That's the headline: hardening is free.

### In the Dockerfile
\`USER 10001:10001\`, with \`COPY --from=build --chown=10001:10001\` so the files are readable. \`CMD ["node","dist/server.js"]\` in **exec form**, so the process is pid 1 and \`SIGTERM\` reaches it. A \`HEALTHCHECK\` with \`--start-period=30s\`.

### At run time
\`--cap-drop=ALL\`, \`--security-opt no-new-privileges\`, \`--read-only\` with a \`tmpfs /tmp\`, \`--pids-limit\`, and memory and CPU limits.

### The build secret
The private npm token is a \`--mount=type=secret\`, not an \`ARG\` — so \`docker history\` has nothing, and the earlier stage that used it isn't in the image anyway.

### What broke
Two things: \`dist\` was owned by root until the \`--chown\`, and the app wrote a lockfile to \`/app\` — which \`--read-only\` surfaced. That second one was a real bug: state in the image directory, silently lost on every restart.`,
  narration:
    "Third pass: hardening. And here's the headline, which I think is the most persuasive number in this course. After applying essentially all of course ten, the image is a hundred and ninety-eight megabytes and rebuilds in four seconds. Both unchanged. Hardening cost nothing measurable. In the Dockerfile, three things. USER with a numeric uid, late in the file, and the COPY dash dash from gets a dash dash chown with the same numbers so the copied files are owned by the user that will run them — which also avoids a chown layer that would have duplicated everything it touched. CMD in exec form with a JSON array, so the Node process is pid 1 and receives SIGTERM directly, which means a graceful shutdown in two hundred milliseconds instead of the ten-second timeout-and-kill we had with npm start. And a HEALTHCHECK with a start period of thirty seconds, because this app loads some configuration at boot and would otherwise be marked unhealthy while it was still perfectly normally starting. At run time — or in the Compose file, which is where it actually lives — cap-drop all, and nothing added back, because the app listens on 8080 and needs no capabilities at all. No-new-privileges, which closes the setuid escalation path. Read-only with a tmpfs at slash tmp. A pids limit, and memory and CPU limits, which are a blast radius as much as a resource control. The build secret is the private npm token, and it's a BuildKit secret mount rather than a build argument. So docker history shows the RUN line with the mount flag and no value anywhere — and beyond that, the stage that used it isn't in the final image at all, so there are two independent reasons nothing leaked. Compare with the ARG version, where the token would be in the history in plain text forever. Now, two things broke, and both are worth telling you about because they're what actually happens. The first: after adding USER, the app couldn't read its own dist directory, because COPY dash dash from had brought the files across owned by root. The fix is the dash dash chown on that COPY, and it's a two-minute fix once you know to look. The second is more interesting. With read-only on, the app crashed at startup writing a lock file into slash app. And that turned out to be a real bug that had been there all along: it was keeping state in its own image directory, which meant that state was silently discarded every time the container was replaced, which is constantly. Nobody had noticed because nothing ever read it back after a restart. Read-only found a data-loss bug by refusing to allow the write. That's the second benefit of read-only I mentioned in course ten: it's a design test. If your application wants to write in surprising places, you want to know. Next: the development loop for all of this.",
}
