import type { Section } from '../types'

export const cacheMounts: Section = {
  id: 'cache-mounts',
  title: 'Cache mounts',
  scene: 'mounts',
  slide: `## Present during the step. In no layer.

\`\`\`docker
# syntax=docker/dockerfile:1
RUN --mount=type=cache,target=/root/.npm npm ci
\`\`\`

A directory BuildKit keeps between builds and **does not commit**. So \`~/.npm\`, \`~/.cache/pip\`, \`/go/pkg/mod\`, \`~/.m2\` persist — while staying out of the image entirely.

### Why this is different from layer caching
A layer cache is all-or-nothing: change one dependency and \`npm ci\` re-runs **from empty**. With a cache mount that re-run still happens, but it re-downloads only the one package that changed. A 90 s miss becomes a 6 s miss.

### Notes
- The \`# syntax=\` line is **required** — without it \`--mount\` is a parse error
- \`sharing=locked\` when two concurrent builds must not share it (most package managers)
- It is a **cache**: assume it can vanish. Never put build output there
- \`docker builder prune\` clears it (course 3 §8)`,
  narration:
    "Here's a frustration you have already met even if you didn't name it. Your Dockerfile is ordered correctly — manifest first, install, then source, exactly as course four told you. Then you add one dependency. The package file changed, so npm ci misses the cache, and it re-runs. From nothing. It downloads every single package again, not just the one you added, because the layer it's rebuilding starts from a filesystem where no packages exist. Ninety seconds, for a one-line change. That is inherent to layer caching: a layer is all-or-nothing. Either you reuse it exactly or you rebuild it from its inputs, and there is no partial credit. Cache mounts solve it, and they do so by stepping outside the layer model entirely. RUN dash dash mount equals type equals cache, target equals slash root slash dot npm, then your command. BuildKit maintains a directory on the build host, mounts it at that path while the instruction runs, and then — this is the essential part — does not commit it. The layer that comes out contains whatever your command wrote to the image's filesystem, and nothing from the mount. So the package manager's download cache persists across builds, across cache misses, and even across changes to the Dockerfile itself, while never appearing in the image. Now run through the scenario again. You add a dependency. Npm ci still misses the layer cache and still re-runs — that hasn't changed. But this time it starts with a populated cache directory, so it finds every existing package already downloaded and fetches exactly the one that's new. The ninety-second rebuild becomes about six seconds. And the same target directory exists for every ecosystem: slash root slash dot npm for npm, slash root slash dot cache slash pip for pip, slash go slash pkg slash mod for Go modules, slash root slash dot m2 for Maven, slash root slash dot cargo for Rust. Four notes. First, the syntax line. Dash dash mount is a Dockerfile frontend feature, not core syntax, so the file must begin with the comment hash syntax equals docker slash dockerfile colon one. Without it you get a parse error that does not mention frontends, and people lose a good twenty minutes to it. It's the first line of the file, above FROM. Second, sharing. By default a cache mount is shared between concurrent builds, and most package managers are not safe against two processes writing their cache at once. Sharing equals locked makes the second build wait. Use it unless you know the tool is safe. Third, and this is a discipline rather than a flag: it is a cache. It can be pruned, it can be on a different machine tomorrow, it is not in your image and not in your registry. Never write build output there and never depend on it existing — a build that only succeeds because something was left in a cache mount is a build that fails on a fresh machine, which is the exact class of problem containers were supposed to eliminate. And fourth, it lives in the BuildKit cache, so docker builder prune clears it, which is worth knowing both as a troubleshooting step and as the reason a CI host's disk fills up. Next: the same mechanism, for secrets.",
}
