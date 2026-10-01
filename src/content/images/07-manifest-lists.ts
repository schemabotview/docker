import type { Section } from '../types'

export const manifestLists: Section = {
  id: 'manifest-lists',
  title: 'Multi-arch and manifest lists',
  scene: 'manifest-list',
  slide: `## One tag, one manifest *per platform*

Behind \`nginx:1.25\` is usually not a manifest at all. It's an **index**: a list of manifests, each tagged with an \`os\` and an \`architecture\`, each with **its own digest and its own layers**.

The daemon reads the index, picks the entry matching itself, and pulls that. You never see the step.

### Why it shows up as a bug
Until it doesn't work. An image published for \`amd64\` only has **no index and no matching entry**, so on an ARM Mac you get either:

- \`no matching manifest for linux/arm64\`, or
- worse — a silent fall back to **QEMU emulation**: it runs, 5–20× slower, and nobody notices for a week

### Working with it
- \`docker manifest inspect nginx:1.25\` — see the platforms
- \`docker pull --platform linux/amd64\` — force one deliberately
- Building them is \`buildx\` — course 5`,
  narration:
    "Here is a question that exposes something we've been quietly ignoring. An image contains compiled binaries. Binaries are built for a processor architecture — x86-64, or ARM64. So how does nginx colon 1.25 work on both an Intel server and an Apple Silicon laptop? Not by being architecture-neutral; it isn't. The answer is that the thing behind that tag is usually not a manifest at all. It's an index — the spec's name is an image index, and you'll also see the older term manifest list. An index is a small JSON document listing several manifests, each annotated with an operating system and an architecture. One entry for linux slash amd64, one for linux slash arm64, perhaps others. Each entry has its own digest and points at its own manifest, which points at its own layer blobs containing binaries compiled for that platform. They are genuinely different images sharing one name. When you pull, the daemon fetches the index, looks at the list, finds the entry matching the platform it is running on, and pulls that manifest and its layers. You never see any of it. It looks like a single image that simply works everywhere, and ninety-five percent of the time that is a fine model to hold. The other five percent is why this section exists, because when it doesn't work the failure is strange. Suppose a publisher only ever built for amd64 — very common for smaller projects and for internal images built on an Intel CI runner. There is no index, just a plain amd64 manifest. Now someone on an ARM laptop pulls it. One of two things happens. The good outcome is an error: no matching manifest for linux slash arm64 in the manifest list entries. That's clear, and you go and fix the build. The bad outcome is that it works. Docker Desktop will fall back to running the amd64 image under QEMU emulation, translating instructions at runtime. The container starts, the application responds, the tests pass — and everything is between five and twenty times slower than it should be. Nobody notices immediately, because nobody has a baseline. Then a week later somebody says the test suite has got slow. You may see a warning about the requested image's platform not matching the host, and that warning is worth treating as an error rather than noise. Three practical things. Docker manifest inspect, with an image reference, prints the index so you can see exactly which platforms a publisher shipped — worth checking before you standardise a team on an image. Docker pull dash dash platform, with a platform string, forces a specific entry, which is how you deliberately pull an amd64 image onto an ARM machine to reproduce a production problem. And docker image inspect will tell you the architecture of what you actually have locally, which settles the argument quickly. Building multi-platform images is the other half of this, and it belongs with buildx in course five — it needs either emulation or a second machine, and the trade-off between those is a section of its own. Next: reclaiming disk, and the prune command that has ended careers.",
}
