import type { Section } from '../types'

export const buildVsImage: Section = {
  id: 'build-vs-image',
  title: 'build vs image',
  scene: 'compose-file',
  slide: `## \`up\` does **not** rebuild

A service with \`build:\` gets built once, on the first \`up\`. After that, \`up\` finds an image with the expected name and uses it — **even if your source has changed**.

That's the most common Compose confusion there is: you edit code, run \`up\`, and nothing changes.

\`\`\`bash
docker compose up --build   # rebuild, then start
docker compose build api    # just build
docker compose watch        # §10 — better, for dev
\`\`\`

### \`build\` and \`image\` together
\`build:\` plus \`image: acme/api:1.4\` means *build it and tag it that*. Then \`compose push\` publishes it. That's the shape for a stack you build **and** ship.

### The build block is the full BuildKit surface
\`context\`, \`dockerfile\`, \`target\` (course 5 §3), \`args\`, \`cache_from\`, \`secrets\`, \`platforms\`. Everything from course 5, in YAML.`,
  narration:
    "A service gets its image one of two ways. Image, with a reference, pulls a published image. Build, with a path, builds one from a Dockerfile. Simple enough, and there's one behaviour here that confuses more people than anything else in Compose. Up does not rebuild. The first time you run up, Compose sees a service with a build section, notices there's no image for it, and builds one — tagging it project-dash-service. Every subsequent up finds that image already exists and uses it. It does not check whether your source changed. It does not check whether the Dockerfile changed. It finds an image with the right name and starts a container from it. So the loop everybody hits in their first week: edit some code, run docker compose up, watch it start, see the old behaviour, conclude that Compose is caching something weird or that your editor didn't save. Nothing is broken. Compose simply never claimed to rebuild. Dash dash build makes it explicit: up dash dash build rebuilds services with a build section before starting them. A lot of people end up typing that always, which is fine, though it means every up pays for a build check — cheap with BuildKit's cache from course five, but not free. Compose build, on its own, builds without starting anything, which is what you want in a CI pipeline before running tests. And there's a better answer for the development loop specifically, which is compose watch, and that's section ten. Now, build and image are not mutually exclusive, and the combination is genuinely useful. If a service has both, Compose builds from the build section and tags the result with the image name. Which means docker compose push publishes it, and anyone who pulls your Compose file without your source gets the published image. That's the right shape for a stack you both develop and ship: developers build locally, CI builds and pushes, and a deployment target just pulls. Finally, the build block is not a simplified version of docker build — it's the whole of course five, expressed in YAML. Context and dockerfile for where things are. Target, to stop at a named stage — which is how you get a dev image with the toolchain and a prod image without, from the same Dockerfile and the same Compose file with an override. Args for build arguments. Cache_from and cache_to for the registry cache from section eight of the last course. Secrets for build secrets. And platforms for multi-architecture. So everything you learned about building applies here, unchanged, just written differently. One practical note: the build context in Compose is relative to the Compose file's location, not to where you ran the command, which is the right behaviour and occasionally surprising when you're running compose from a parent directory. Next: the six commands, and the one that deletes your database.",
}
