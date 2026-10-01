import type { Section } from '../types'

export const shipped: Section = {
  id: 'shipped',
  title: 'Shipped',
  scene: 'the-stack',
  slide: `## What each decision actually bought

- **1.24 GB → 198 MB** — multi-stage. And it did **nothing** for build time
- **94 s → 4 s** — reordering, a cache mount, \`.dockerignore\`. And nothing for size
- **4 min → 38 s cold in CI** — remote cache with \`mode=max\`. \`min\` looked broken
- **Hardening: both numbers unchanged.** Non-root, no caps, read-only, secret as a file — free
- **11 min → 90 s** for arm64 — cross-compile instead of emulate

### The two worth keeping
**Size and speed are independent problems.** Half the work gets you half the benefit, and people routinely stop after the impressive-looking half.

**Hardening is free.** The whole of course 10 cost nothing measurable, which removes the usual excuse.

### What Docker still won't do for you
Place containers across hosts, reschedule after a failure, or roll out a change safely at scale. That's course 11 §10's decision — and it's where the Kubernetes concept begins.`,
  narration:
    "Let's close the whole thing. Here is what each decision actually bought, which is the point of having measured rather than asserted. Multi-stage: one point two four gigabytes to a hundred and ninety-eight megabytes. A seven-to-one reduction, and it did absolutely nothing for build time. Reordering, plus a cache mount, plus a dot-dockerignore: ninety-four seconds to four. A twenty-three-fold improvement, and it did nothing for size. Remote cache with mode equals max: four minutes to thirty-eight seconds on a cold CI runner. With the default mode, it would have been three minutes forty and you'd have concluded the feature doesn't work. Hardening: both numbers unchanged. Non-root, capabilities dropped, read-only filesystem, no-new-privileges, the build secret handled properly. The entire content of course ten, for no measurable cost in size or speed. And cross-compiling instead of emulating: eleven minutes to ninety seconds for the ARM build. Two of those are worth carrying away as general lessons rather than as facts about this application. The first: size and speed are independent problems with independent fixes. Multi-stage is a stage problem. Ordering is a cache problem. Neither helps the other, and the failure mode is that people do the one with the impressive number — multi-stage, because seven-to-one sounds like an achievement — and stop, and then wonder why the build still takes ninety seconds. The second: hardening is free. That matters because the usual reason it doesn't get done is an assumed trade-off against performance or effort, and there isn't one. It's four lines in a Dockerfile and four flags at run time, and the numbers don't move. The two things that broke while applying it — file ownership after adding USER, and an app writing state into its own image directory — took about twenty minutes between them, and the second one was a real data-loss bug that read-only found for us. Now, what Docker still won't do, because the honest ending to a Docker course is naming the edge. Nothing here places containers across hosts. Nothing reschedules a container when a host dies at three in the morning. Nothing rolls out a change gradually across replicas, watching health, with a way back. Compose runs one host. That is genuinely enough for an enormous amount of real software, and course eleven's advice stands: one host is fine, two or three is Swarm's territory, and beyond that you want Kubernetes and the ecosystem around it. But that's a different subject with its own concepts, and it is where this one ends. What you have now is the whole of Docker: what a container actually is, how to run one properly, what an image is made of, how to build one that's small and fast and reproducible, where data lives, how containers reach each other, how to describe a stack, how distribution works, how to harden it, how to operate the machine it runs on, and — as of this course — what each of those decisions is worth when you apply all of them to something real. That's the subject.",
}
