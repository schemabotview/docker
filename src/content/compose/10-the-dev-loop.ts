import type { Section } from '../types'

export const theDevLoop: Section = {
  id: 'the-dev-loop',
  title: 'The dev loop: compose watch',
  scene: 'compose-file',
  slide: `## Three actions, chosen per path

\`\`\`yaml
develop:
  watch:
    - { path: ./src, action: sync, target: /app/src }
    - { path: ./package.json, action: rebuild }
    - { path: ./config, action: sync+restart,
        target: /app/config }
\`\`\`

\`docker compose watch\` — and each change takes the action its path deserves.

- **\`sync\`** — copy the changed files in. For anything with hot reload
- **\`rebuild\`** — the dependency manifest changed, so rebuild the image
- **\`sync+restart\`** — copy, then restart the process. For config a running app won't re-read

### Why it beats a bind mount
A bind mount is all-or-nothing and inherits every problem from course 6 §5: it hides \`node_modules\`, it's slow on Docker Desktop, and a changed \`package.json\` does nothing useful. \`watch\` moves **only what changed**, and can pick a different response per path.

And there's no bind mount in the file — so nothing dev-shaped leaks into a production run.`,
  narration:
    "The development loop has been a bind mount for a decade: mount your source into the container, let the file watcher inside notice changes, done. It works, and course six listed its problems. It hides directories the image owns, so node_modules needs a second mount stacked on top. It's slow on Docker Desktop because every read crosses a VM boundary. It's all-or-nothing, so a change to your dependency manifest does nothing useful — the file is now different inside the container and nothing reinstalls. And it puts a development-shaped bind mount into your Compose file, which then has to be kept out of production by an override, which someone eventually forgets. Compose watch is the newer answer, and the idea is that different files deserve different responses. You declare a develop block with a watch list, and each entry has a path and an action. Sync copies changed files into the running container. That's for source code where something inside — nodemon, a framework's dev server, a language's reloader — is already watching and will pick up the change. Only the files that changed are copied, so it's fast, and there's no mount and therefore no hiding of anything the image installed. Rebuild rebuilds the image and recreates the container. That's for the dependency manifest: change package dot json or requirements dot txt or go dot mod and a sync would be pointless, because the installed dependencies are in the image. Rebuild is what you actually want, and thanks to course four's ordering and course five's cache mounts, it's a few seconds rather than a few minutes. And sync plus restart copies the files and then restarts the container's main process. That's for configuration that a running application won't re-read on its own — most config files, most environment-shaped things. Without the restart you'd copy a file the process has already read and parsed. So one project might have all three: source synced, manifest rebuilding, config synced-and-restarted. Each path gets the response that actually makes sense for it, which a single bind mount cannot express. Run it with docker compose watch, which starts the stack and then stays in the foreground watching. There's also a dash dash watch flag on up if you'd rather have it as part of the ordinary command. Two practical notes. There's an ignore list on each watch entry, and you want one — node_modules, dot-git, build output — for the same reason dot-dockerignore matters: you do not want your image rebuilding because a log file was written. And this is genuinely newer than most of what's in this course, so on an older Compose you'll get an error about an unsupported key rather than a graceful degradation. Finally, the thing I like most about it, which is a design point rather than a feature. Because watch lives in a develop block that's only read by the watch command, there is no bind mount in your Compose file. Nothing dev-shaped is sitting in the file waiting to be run in production by accident. The file describes the real stack, and the development ergonomics are a separate, clearly-labelled section that a production deploy never looks at. One section left: let's put the course together.",
}
