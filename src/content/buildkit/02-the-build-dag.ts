import type { Section } from '../types'

export const theBuildDag: Section = {
  id: 'the-build-dag',
  title: 'The build graph',
  scene: 'build-dag',
  slide: `## Branches, not lines

Three stages. \`deps\` runs \`npm ci\` (90 s). \`assets\` builds CSS (20 s). The final stage copies from both.

A list runs 110 s. A graph runs **90** — \`assets\` finishes while \`deps\` is still going. Same Dockerfile, no flags.

### Dead stages are free
A \`test\` stage nothing copies from is **never built**. So you can keep test and lint stages in the same file without paying for them on a production build.

### The cascade is now sideways-safe
Course 4 §11: a miss invalidates everything **below**. Still true — *along a branch*. But \`deps\` and \`assets\` are **beside** each other, so editing the CSS leaves \`npm ci\` cached.

### Read the output
BuildKit prints one numbered line per step with its own timing, and \`CACHED\` where it skipped. That output *is* the graph — use it to find the step that actually costs you.`,
  narration:
    "Let's make the graph concrete, because the difference shows up on the first real Dockerfile you write with more than one stage. Take three stages. The first, called deps, starts from the full Node image and runs npm ci — ninety seconds. The second, called assets, also starts from Node and builds your CSS — twenty seconds. The third starts from node-slim and copies the output of both into place. Now: what does the third stage need? It needs deps and it needs assets. What does deps need? Only its base image. What does assets need? Only its base image. So deps and assets have no relationship to each other at all. They are not above and below; they are beside. A list builder has no way to express that. It sees six or eight instructions in file order and runs them in file order: ninety seconds, then twenty seconds, then the copies. A hundred and ten seconds. BuildKit sees the graph, notices the two branches are independent, and runs them at the same time. Twenty seconds of CSS work happens while npm is still installing, and the whole build takes ninety. Same Dockerfile, no flags, nothing to configure. Second thing the graph gives you, and it changes how you organise a project. Suppose you also have a test stage — FROM the build stage, run the test suite. And in your production build, nothing copies from it. BuildKit never builds it. Not skips it quickly; never starts it. So you can keep your test stage, your lint stage and your documentation stage in the same Dockerfile as your production image, and a production build ignores all three. With the legacy builder every stage was built every time, which is why people kept separate Dockerfiles for testing. You don't need to any more. Third, and this is a real refinement of what course four taught you. Section eleven of that course said a cache miss cascades: everything below it re-runs. That is still true, and it is still the reason instruction order matters. But now it is true along a branch rather than across the whole file. Editing your CSS invalidates the assets branch. The deps branch is untouched, so npm ci stays cached. In a single-stage Dockerfile, those two would have been in a line, and touching either would have cost you both. So multi-stage builds are no longer only about image size — they're also about isolating what invalidates what. Finally, learn to read BuildKit's output, because it is showing you the graph and most people watch it scroll past. Each step gets a numbered line with its own elapsed time, and steps that were skipped are marked CACHED. That is a profile of your build, printed free, every time. When a build feels slow, don't guess and don't start optimising the base image — look at which numbered step has the large number next to it. Usually it's one step, and usually it's a dependency install that is missing the cache because of something upstream. And if you want the whole thing rather than the scrolling summary, dash dash progress equals plain prints every line of output in full, which is what you want in CI logs where the fancy display collapses into nonsense. Next: the stage boundary as a size tool.",
}
