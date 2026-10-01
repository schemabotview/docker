import type { Section } from '../types'

export const dockerfileFrontends: Section = {
  id: 'dockerfile-frontends',
  title: 'The syntax directive',
  scene: 'buildx-bake',
  slide: `## \`# syntax=\` versions the *language*

\`\`\`docker
# syntax=docker/dockerfile:1
\`\`\`

BuildKit reads that first line, **pulls that image**, and uses it to parse the rest. The Dockerfile language is no longer tied to the Docker you have installed — it ships as an image.

Which is why \`--mount\` works on a two-year-old daemon, and why omitting the line makes \`--mount\` a **parse error** rather than an unsupported feature.

### Use the floating \`:1\`
It gets new features and fixes within major 1 forever, and no breaking changes. Pin a patch only to reproduce an old build exactly.

### What it has unlocked
\`RUN --mount\` in all its forms · heredocs (\`RUN <<EOF … EOF\`) for multi-line scripts without \`&& \\\` · \`COPY --parents\` · \`ADD\` from git · \`--exclude\`.

### One consequence
The first build after a frontend update **pulls an image**. On an air-gapped host, mirror it or pin one you already have.`,
  narration:
    "Short section, about one comment that is not a comment. The first line of a modern Dockerfile is hash syntax equals docker slash dockerfile colon one. It looks like a comment and every parser except BuildKit's treats it as one. BuildKit reads it, and it changes what happens next entirely: BuildKit pulls that image and uses it to parse the rest of your Dockerfile. The image is a frontend — a program that turns Dockerfile text into the build graph. Think about what that decouples. Before this, the Dockerfile language was whatever your installed Docker understood. A new instruction meant upgrading Docker on every machine and every CI runner, which in a large organisation is a quarter of work. Now the language ships as an image, versioned separately. A colleague on an older Docker can build your Dockerfile with dash dash mount in it, because the frontend that understands dash dash mount is pulled at build time. That's why the syntax line matters so much in practice, and why leaving it out produces such a confusing error. Without it, BuildKit uses its built-in frontend, which is deliberately conservative and does not know dash dash mount. So you don't get feature not supported — you get a parse error, complaining about unexpected input at the flag. It reads like a typo in your own file. If a mount flag is rejected, check line one before anything else. Use the floating colon one tag. Docker's compatibility promise for it is real: within major version one you get new features and bug fixes and no breaking changes, so the floating tag is the intended way to use it. That's an interesting exception to the pinning advice from course three, and the reason is that this is a build-time tool rather than a runtime dependency — the risk profile is different, and the benefit of getting fixes automatically is high. Pin a specific patch only when you're trying to reproduce a build from a particular point in time. What has it given us? Dash dash mount, in all four forms — cache, secret, ssh, bind — which is most of this course. Heredocs, which let you write a multi-line shell script inside a single RUN without the trailing-backslash-double-ampersand chain that makes long RUN blocks so unpleasant to read and so easy to break. COPY dash dash parents, which preserves directory structure when copying a glob. ADD from a git URL, which we met in course four. And dash dash exclude on COPY, for the cases where dot-dockerignore is too blunt. Those all arrived without anyone upgrading their Docker installation. One consequence to be aware of. The first build after the frontend image updates pulls that image, so a build occasionally does a small download before it starts, which is fine on a laptop and surprising on a host with no outbound network. On an air-gapped builder, mirror the frontend image into your internal registry and point the syntax line at that, or pin a version you already have locally. It's a small thing, and it's the kind of small thing that stops a release at the wrong moment. One section left: let's put the course together.",
}
