import type { Section } from '../types'

export const remoteCache: Section = {
  id: 'remote-cache',
  title: 'Remote cache',
  scene: 'remote-cache',
  slide: `## A CI runner is a fresh machine every time

Which means the local build cache is **empty**, every build. All that careful instruction ordering from course 4 §11 buys you nothing in CI, and that's why your pipeline takes nine minutes.

\`\`\`bash
--cache-from type=registry,ref=acme/api:cache \\
--cache-to   type=registry,ref=acme/api:cache,mode=max
\`\`\`

The cache becomes **blobs in a registry**, next to your image. The next runner imports it and hits like a warm machine.

### \`mode=max\` is not optional
The default, \`mode=min\`, exports only the **final stage's** layers — which on a multi-stage build are exactly the cheap ones. \`mode=max\` exports every intermediate stage, including the 90-second install. Bigger, and it's the one that works.

### Other backends
\`type=gha\` (GitHub Actions' own cache), \`type=s3\`, \`type=local\`. Use \`gha\` on GitHub — no registry write permission needed.`,
  narration:
    "Here is why your CI pipeline is slow, and it's a reason that has nothing to do with your Dockerfile. Course four taught you to order instructions so the expensive steps cache. You did that. Locally, your rebuilds take four seconds. And your CI build still takes nine minutes, every single time, and nobody can see why. The reason is that a CI runner is a fresh machine. It boots, it checks out your code, it builds, it pushes, it's destroyed. There is no local Docker cache because there is no local anything — the machine did not exist ten seconds ago. So every layer is a miss, every time, no matter how beautifully you ordered them. All that work bought you a faster laptop and nothing else. The fix is to put the cache somewhere the next runner can reach, and BuildKit can do that because of what we established in section one: its cache entries are content-addressed blobs, not a chain of local layers. Blobs can be pushed to a registry, which is a thing you already have. Two flags. Dash dash cache-to, with type equals registry and a reference, exports the cache after the build. Dash dash cache-from, with the same reference, imports it before the build. Point them at a tag alongside your image — acme slash api colon cache is the convention — and now each build seeds the next. A pipeline goes from nine minutes to ninety seconds, and the improvement shows up on every branch, not just the one you tested. Now the detail that decides whether this works at all, and it is the single most common way people get a disappointing result. There's a mode parameter on cache-to, and the default is min. Mode equals min exports only the layers of the final stage. Think about what that means on a multi-stage build. Your final stage copies a built artifact into a slim base — those layers are small and cheap to produce. The expensive work, the ninety-second dependency install, happened in the build stage, whose layers are not part of the final image and therefore not exported. So you set up remote caching, and your build gets marginally faster, and you conclude the feature is overrated. Mode equals max exports every intermediate stage too. The cache is bigger — sometimes several times the size of the image — and it's the one that actually caches the work you cared about. Use mode equals max unless you have a specific reason. There are other backends, and one is worth naming specifically. Type equals gha uses GitHub Actions' own cache service. On GitHub that's usually better than a registry: the workflow token already has access, so you don't need registry write credentials just to cache, and it's covered by the cache quota rather than your registry storage. There's also type equals s3, and type equals local for a self-hosted runner with a persistent disk. Two practical notes. First, the import and export both cost network time — a large cache can take twenty seconds each way — so for a build that only takes a minute anyway, measure before assuming it helps. Second, registry caches grow and most registries won't clean them up for you. Overwriting the same tag replaces the manifest but the old blobs linger, which is course nine's garbage collection problem arriving early. A retention policy on the cache tag is worth setting up before someone notices the storage bill. Next: the line at the top of the file that made half of this course possible.",
}
