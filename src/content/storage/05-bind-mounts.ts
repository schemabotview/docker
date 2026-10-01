import type { Section } from '../types'

export const bindMounts: Section = {
  id: 'bind-mounts',
  title: 'Bind mounts',
  scene: 'bind-mount',
  slide: `## It **replaces** the path — which breaks \`node_modules\`

\`-v $(pwd):/app\` and suddenly *cannot find module 'express'*. The image installed \`/app/node_modules\` at build time; your bind mount covered \`/app\` with a host directory that has no \`node_modules\`.

The fix is an **anonymous volume stacked on top**:

\`\`\`bash
docker run -v "$(pwd)":/app -v /app/node_modules myapp
\`\`\`

The more specific mount wins, so the image's \`node_modules\` stays visible under your source.

### On Mac and Windows it is slow
Every read crosses a VM boundary. On Linux a bind mount costs nothing — same kernel, same inode. So bind the **source only**, and leave dependencies and build output inside the container.

### Development only
A bind mount ties the container to one host's directory layout. That's exactly what an image exists to avoid.

\`:ro\` for anything the container shouldn't write — config, certificates.`,
  narration:
    "Bind mounts are what make container development bearable, and they have two behaviours that make them feel broken the first time. The good part first. You mount your source directory from the host into the container — dash v, dollar-paren-pwd, colon slash app. Now you edit a file in your editor and the process inside the container is looking at that same file. Not a copy: the same inode. Your dev server's file watcher fires, it reloads, and you see the change. No rebuild, no restart, no copy step. That's the loop, and it's the reason bind mounts exist. Now the first behaviour that surprises people, and essentially everyone hits it once. A mount replaces whatever was at that path. Completely. So if your image built node_modules into slash app at build time — which it did, because that's what course four told you to do — and you now mount your host directory over slash app, the container sees your host directory. Your host directory has your source and no node_modules, because you install inside the image. The application starts and immediately says it cannot find a module, and you stare at a Dockerfile that definitely installs it. Nothing is wrong. You covered it up. The fix is neat once you know it: add a second mount, more specific than the first. Dash v slash app slash node_modules with nothing before the colon — an anonymous volume, at that exact path. Mounts are resolved most-specific-first, so slash app comes from your host and slash app slash node_modules comes from the volume, which was seeded from the image. Your source is live-editable and the dependencies are the ones the image installed. The same trick works for any directory the image owns and the host shouldn't cover: a build output folder, a vendor directory, a Python virtualenv. The second surprising behaviour is performance, and it's platform-specific in a way that causes arguments between colleagues. On Linux, a bind mount is free. The container and the host share a kernel, it's the same filesystem, there is no translation. On Docker Desktop for Mac or Windows, your containers are inside a Linux virtual machine — course one, section two — so a bind mount crosses a VM boundary on every operation. Docker has worked hard on this, and virtiofs is far better than what came before, but it is still not free, and it is noticeably not free for workloads that touch thousands of small files. Which node_modules very much is. So the practical advice is the same as the node_modules fix, for a second reason: bind only your source, and keep dependencies and build output inside the container on a volume or in the image. Your colleague on Linux won't understand why you care, and you're both right. Two closing notes. Use colon r-o on anything the container has no business writing — a mounted config file, a certificate directory. It costs nothing and turns a class of accidents into an error. And a general rule: bind mounts are for development. In production, a bind mount ties your container to one specific host having one specific directory laid out one specific way, which is precisely the coupling that images exist to remove. The exceptions are narrow and deliberate — mounting slash etc slash localtime, or a config managed by the host's own tooling. Next: RAM-backed mounts, and the syntax argument.",
}
