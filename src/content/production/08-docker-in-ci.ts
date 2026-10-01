import type { Section } from '../types'

export const dockerInCi: Section = {
  id: 'docker-in-ci',
  title: 'Docker in CI',
  scene: 'runtime-layer',
  slide: `## Every runner is a cold machine (course 5 §8)

Which is why the pipeline is slow, and why remote cache is the fix — \`--cache-to type=registry,…,mode=max\`, or \`type=gha\` on GitHub.

### The shape that works
\`\`\`bash
buildx build --cache-from … --cache-to …,mode=max \\
  --secret id=npm,env=NPM_TOKEN \\
  --platform linux/amd64,linux/arm64 \\
  -t acme/api:1.4.2 -t acme/api:git-$SHA --push .
\`\`\`
Everything from course 5, plus course 9's tagging. Put it in \`docker-bake.hcl\` so CI and a laptop run the same build.

### Docker-in-Docker is usually the wrong answer
\`dind\` needs \`--privileged\` (course 10 §3), which on a shared runner is root on the host. Prefer **mounting the daemon's socket**? No — that's the same grant.

The right answer is a **rootless builder**: \`buildx\` with the \`docker-container\` driver, or a remote BuildKit the runners share. No privilege, and a warm cache for everyone.

### And authenticate with OIDC
Not a long-lived registry password (course 9 §3).`,
  narration:
    "Docker in a CI pipeline is four decisions, and most pipelines get two of them wrong in ways that cost either time or safety. The first is caching, which we covered in course five and which bears repeating because it's the reason pipelines are slow. Every CI runner is a fresh machine with an empty Docker cache, so all the instruction ordering you did in course four buys you nothing there. The fix is exporting the build cache to somewhere the next runner can reach: dash dash cache-to with type registry and mode equals max, and dash dash cache-from on the way in. Mode max matters — the default only exports the final stage's layers, which on a multi-stage build are the cheap ones. On GitHub Actions, type equals gha uses their cache service and needs no registry credentials. The second is the shape of the build command, which by now includes cache flags, secret mounts, platforms and several tags, and is five wrapped lines nobody types the same way twice. Put it in a bake file. Then CI runs docker buildx bake and you run docker buildx bake, and the question of whether the local build matches the CI build stops being a question. The third decision is how the runner gets access to a builder at all, and this is where pipelines commonly take a bad trade. The traditional answer is Docker-in-Docker — running a Docker daemon inside the CI container — and it requires dash dash privileged. Course ten, section three: privileged is every capability, all devices, and seccomp off, which on a shared runner is effectively root on the host. Anyone who can open a pull request can then run a build, and a build that gets privileged can take the runner. The other traditional answer is mounting the host's Docker socket into the job container, and that is exactly the same grant by a different route — the socket is root on the host. Both are common and both are worth being uncomfortable about. The better answer is a rootless builder. Buildx with the docker-container driver gives you a BuildKit instance that doesn't need privileged, and BuildKit can run rootless. Or run a shared remote BuildKit that the runners connect to, which has the additional benefit that its cache is warm for everybody rather than per-job. That's more setup and it removes the privilege requirement entirely, which on a runner that builds untrusted pull requests is not a small thing. The fourth is authentication, which is course nine, section three. Don't put a long-lived registry password in your CI configuration. Use a scoped token at minimum, and prefer a short-lived credential minted by the CI system's identity — GitHub Actions can authenticate to its own registry with the workflow token, and the cloud registries all support OIDC federation now. Then there's no durable secret to leak. One more small thing that saves confusion: tag with an immutable version and the commit SHA on every build, per course nine section five, and push both. When someone asks later what's running in staging, you'll be able to answer it from the image reference rather than from timestamps. Next: the container as your development environment.",
}
