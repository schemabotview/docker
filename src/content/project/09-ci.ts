import type { Section } from '../types'

export const ci: Section = {
  id: 'ci',
  title: 'CI',
  scene: 'ship-it',
  slide: `## 4 min → 38 s, and the order is the content

1. **Auth with OIDC**, not a long-lived registry password (course 9 §3)
2. **Import the cache** — \`--cache-from\`, or the runner is cold and all §4's work bought nothing (course 5 §8)
3. **\`--target test\`** — the tests run in the build stage, which ships nothing (course 5 §3)
4. **Build both platforms**, cross-compiled (§8)
5. **Scan, then push** — with \`--attest\` for SBOM and provenance (course 9 §9)
6. **Record the digest**, and verify the running container matches it (course 9 §4)

### \`mode=max\` is the whole difference
\`--cache-to …,mode=max\`. The default exports only the **final stage's** layers — which on a multi-stage build are precisely the cheap ones. With \`min\`, this pipeline stayed at 3 min 40 and looked like the cache wasn't working.

### And not docker-in-docker
\`dind\` needs \`--privileged\`, which on a shared runner is root on the host (course 10 §3). A rootless \`buildx\` builder instead.`,
  narration:
    "The pipeline, and the shape of it is six steps whose order matters. One: authenticate with an OIDC credential minted for this job rather than a long-lived registry password sitting in the CI configuration. Course nine, section three. Then there's no durable secret to leak. Two: import the build cache. This is the one that turns a four-minute pipeline into a thirty-eight-second one, and it's the step people leave out — because all the instruction ordering from section four is invisible in CI, where every runner is a fresh machine with an empty cache. Course five, section eight. Three: run the tests with dash dash target test, against a stage in the same Dockerfile. So the tests run in the exact environment the build used, and that stage ships nothing, and — because of the graph from course five — it isn't even built during a production build. One Dockerfile, several outputs. Four: build both platforms, cross-compiled rather than emulated, as in the last section. Five: scan, and then push, with attestations. The ordering there matters: scan before push, so a critical finding fails the pipeline before the image is available to anyone. And dash dash attest for an SBOM and provenance, which are pushed alongside the image. Six, and this is the step everyone omits: record the digest you pushed, and afterwards verify that the running container's digest matches it. Course nine section four made the point that a push is not a deploy, and the gap between them is where the deploy silently doesn't happen. Two commands turns that from an assumption into a check. Now the detail that decided whether any of this worked, and I want to be specific because it's a trap with a very misleading symptom. Cache-to has a mode parameter, and the default is min. Mode min exports only the final stage's layers. On a multi-stage build, the final stage copies a built artifact into a slim base — those layers are tiny and cheap to produce. The expensive work, the dependency install, happened in the build stage, whose layers are not part of the final image and therefore not exported. So with the default, this pipeline went from four minutes to three minutes forty, which looks like the cache barely works and the feature is overrated. Mode equals max exports every intermediate stage, and that's when it dropped to thirty-eight seconds. If you set up remote caching and it disappoints you, check that first. And the thing this pipeline deliberately doesn't do: Docker-in-Docker. Dind needs privileged, which on a shared runner is root on the host — course ten, section three — and on a runner that builds pull requests from anyone, that's a serious exposure. A rootless buildx builder with the docker-container driver does the same job without any privilege. It's a small amount of extra setup and it removes a real problem. One section left: what all of this actually bought.",
}
