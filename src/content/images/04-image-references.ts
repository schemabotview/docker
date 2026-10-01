import type { Section } from '../types'

export const imageReferences: Section = {
  id: 'image-references',
  title: 'Image references',
  scene: 'image-reference',
  slide: `## \`nginx\` is three defaults in a trench coat

\`\`\`text
[registry/][namespace/]name[:tag | @digest]
\`\`\`

\`nginx\` expands to **\`docker.io/library/nginx:latest\`**.

- **\`docker.io\`** — the default registry, always
- **\`library/\`** — the namespace for Docker **Official Images**, reviewed and maintained
- **\`:latest\`** — the default tag (§3)

### Why \`library/\` matters
\`nginx\` and \`bitnami/nginx\` are **different repositories with different owners**. Dropping a namespace you didn't mean to drop is how you pull an image nobody vetted.

### How the registry is detected
There's no flag. If the **first segment contains a \`.\` or a \`:\`**, it's a registry — otherwise it's a namespace. So \`localhost:5000/api\` is a local registry, and \`myteam/api\` is not.

### The digest wins
\`nginx:1.25@sha256:7e1a…\` — the tag is **decoration**; the digest decides.`,
  narration:
    "An image reference has a grammar, and it is worth knowing exactly, because the shortest form hides three separate defaults and one of them has security consequences. The full form is: optionally a registry, then a slash; optionally a namespace, then a slash; then the repository name; then either a colon and a tag, or an at sign and a digest. Now take the shortest thing you ever type. Nginx. That expands to docker dot io, slash, library, slash, nginx, colon, latest. Three defaults filled in silently. The registry defaults to docker dot io, always — there is no configuration that changes this in the way people expect, and a private registry always has to be named explicitly. The tag defaults to latest, which we just did. And the namespace defaults to library, which is the one worth pausing on. Library is the namespace for what Docker calls Official Images: a curated set — nginx, postgres, python, node, alpine and a few hundred others — that are reviewed, maintained, rebuilt for security patches, and published by Docker in cooperation with the upstream projects. When you type nginx and get library slash nginx, you are getting that. Now consider bitnami slash nginx. Also a fine image, from a reputable publisher, but a completely different repository with a different owner, a different build process and a different update cadence. And more to the point, anyone can publish under their own namespace. So a reference where the namespace has been dropped, or mistyped, or copied from a blog post, can quietly take you somewhere nobody vetted. The convention that a bare name means an official image is doing real work, and it only works if you know it exists. Then the registry detection, which surprises people because there is no flag for it. Docker looks at the first segment of the reference, and applies one rule: if that segment contains a dot or a colon, it's a hostname, so it's a registry. Otherwise it's a namespace. So ghcr dot io slash acme slash api is a registry, because of the dot. Localhost colon 5000 slash api is a registry, because of the colon — which is exactly why running a local registry on a port works without any configuration. But myteam slash api has neither, so it's a namespace on Docker Hub, and if you meant an internal registry called myteam, you'll get a confusing not-found from Hub instead. Finally, you can give both a tag and a digest: nginx colon 1.25 at sha256 and the hash. In that case the digest wins and the tag is pure decoration — though useful decoration, because it tells a human reader what the pinned thing is supposed to be. That is actually the nicest form for a Dockerfile: a readable version for people, and an exact digest for the machine. Next: reading an image backwards to find out how it was built, and what that reveals that its author may not have intended.",
}
