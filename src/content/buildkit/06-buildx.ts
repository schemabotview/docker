import type { Section } from '../types'

export const buildx: Section = {
  id: 'buildx',
  title: 'buildx and builders',
  scene: 'buildx-bake',
  slide: `## Why \`buildx create\` exists at all

\`docker build\` uses the **\`docker\` driver** — BuildKit embedded in the daemon. It works, and it cannot do multi-platform builds or export cache to a registry.

\`\`\`bash
docker buildx create --name multi \\
  --driver docker-container --use
\`\`\`

That runs BuildKit in its **own container**, and unlocks §7 and §8. It's the step missing from most tutorials, which then fail with an error about the current builder not supporting the feature.

### The drivers
- \`docker\` — embedded, default, limited
- \`docker-container\` — the one you want locally
- \`kubernetes\` / \`remote\` — a shared builder for a team or CI

### \`bake\`, because that command line gets long
Platforms, two cache flags, a secret, tags, push. Nobody types that identically twice. Put it in \`docker-bake.hcl\` and run \`docker buildx bake\` — so CI and a laptop run **the same build**.`,
  narration:
    "Buildx is the CLI in front of BuildKit, and there is one thing about it worth understanding before anything else, because it's the step that most tutorials skip and it's why their instructions fail for you. When you run plain docker build, you're using BuildKit — but a particular instance of it, embedded inside the Docker daemon. That's called the docker driver. It builds fine. It supports the graph, the mounts, everything we've covered so far. But it has two limitations, and they're exactly the two features in the next two sections. It cannot produce multi-platform images, and it cannot export its cache to a registry. So you'll follow a guide, run docker buildx build with dash dash platform and two architectures, and get an error saying the current builder instance doesn't support the specified feature. Nothing is broken. You're on the wrong driver. The fix is one command: docker buildx create, a name, dash dash driver docker-container, and dash dash use. That starts BuildKit as its own container on your machine rather than using the one inside the daemon, and the containerised BuildKit has the full feature set. Dash dash use makes it the active builder, so subsequent buildx build commands go to it. That's the whole of it, it takes a few seconds, and you do it once per machine. There are four drivers worth knowing. Docker, the embedded default — fine for everyday local builds. Docker-container, which you just created, and which is what you want locally for anything involving platforms or cache export. Kubernetes, which runs builders as pods, so a team shares one warm build cache instead of each laptop having its own cold one. And remote, which connects to a BuildKit you're running somewhere else — the same idea, useful when your CI has a big machine and your laptop doesn't. Docker buildx ls shows what you have and what each can do, including the platforms it supports. Now the second half, which is about a much more mundane problem. By the end of this course the command you actually want to run looks like this: buildx build, dash dash platform with two architectures, dash dash cache-from with a registry reference, dash dash cache-to with the same reference and mode equals max, dash dash secret with an id and a source, dash t with your tag, dash dash push, and a dot. That's five wrapped lines. Nobody types it the same way twice. It lives half in a CI configuration file and half in somebody's shell history, and the two drift apart, and then a build behaves differently in CI than it does locally and nobody can say why. Bake is the fix, and it's the same idea as Compose: put the invocation in a file. Docker-bake dot hcl declares targets, each with its platforms, its cache settings, its tags and its context. Then docker buildx bake, and the target name. CI runs that command. You run that command. They are the same build by construction, not by discipline. Bake also handles multiple images in one file with shared settings, and it can build them in parallel — which matters once a repository produces three or four images and you'd otherwise be running three or four commands. Next: two architectures from one command.",
}
