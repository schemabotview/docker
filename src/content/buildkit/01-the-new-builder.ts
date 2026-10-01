import type { Section } from '../types'

export const theNewBuilder: Section = {
  id: 'the-new-builder',
  title: 'The new builder',
  scene: 'legacy-vs-buildkit',
  slide: `## A loop became a solver

You have been using BuildKit since course 4 — it's been the default since Docker 23. What changed isn't speed, it's the **model**.

The legacy builder walked a **list**: run a container, commit a layer, repeat, strictly top to bottom. BuildKit builds a **graph** of content-addressed steps and solves it.

### What that unlocks
- **Parallelism** — independent branches build at the same time (§2)
- **Dead-stage elimination** — a stage nothing needs is never built
- **Incremental context** — only changed files are sent (course 4 §5)
- **Mounts** — cache, secret, ssh: things a commit-per-step builder *cannot* express (§4–5)
- **Exportable cache** — the cache leaves the machine (§8)
- **Multiple outputs** — an image, a tar, a registry push, or plain files

### Everything after this needs the graph
The rest of this course isn't extra features bolted on. Each one is only possible because the builder stopped being a loop.`,
  narration:
    "Here's a small surprise to start with: you have been using BuildKit for the whole of the last course. It has been Docker's default builder since version 23, so every build you ran while learning Dockerfile syntax went through it. So this course is not about switching to something new. It's about the capabilities you already have and have not been using. And the first thing to get right is what actually changed, because the usual summary — BuildKit is faster — is true, useless, and hides the interesting part. The legacy builder worked exactly the way course four described: a loop over instructions. Take the layers so far, start a container, run the instruction, commit the diff, discard the container, move to the next line. Strictly sequential, strictly top to bottom, one container and one layer per step. BuildKit does something structurally different. It parses the whole Dockerfile first and turns it into a graph — a directed acyclic graph of steps, where an edge means this step needs that step's output. Then it solves the graph. Each node is identified by the content of its inputs rather than by its position in a list, and the result of each node is cached against that content hash. That sounds abstract, so let's make it concrete by listing what it buys, because every remaining section of this course is one of these. Parallelism: if two branches of the graph don't depend on each other, they run at the same time. A list cannot do that; a graph can, for free, with no change to your Dockerfile. That's section two. Dead-stage elimination: if you have a test stage and nothing in the final image copies from it, BuildKit never builds it at all. The legacy builder built every stage, always, because a list has no notion of what's needed. Incremental context: rather than tarring the whole directory and shipping it on every build, BuildKit syncs only what changed since last time. That's why the sending build context line got much less painful. Mounts: RUN dash dash mount, which gives a step a directory or a file that exists only while that step runs and is not committed into the layer. That's a thing a commit-per-step builder fundamentally cannot express, and it's the answer to two problems we've already hit — package caches you want to keep but not ship, and secrets that must leave no trace. Sections four and five. Exportable cache: because cache entries are content-addressed blobs rather than a chain of local layers, they can be pushed to a registry and pulled by a completely different machine. Which is the difference between a CI pipeline that rebuilds everything every time and one that doesn't. Section eight. And multiple outputs: the result of a build doesn't have to be a local image. It can be a tar, a direct push to a registry, or just files written to a directory — which is genuinely useful when you're using the builder to compile something rather than to produce an image. Keep one contrast in mind as we go. The old cache was a chain: hit, hit, miss, and everything after the miss is gone. BuildKit's cache is a graph of content hashes, so a miss invalidates what actually depends on it and nothing else. Next: what that looks like on a real Dockerfile.",
}
