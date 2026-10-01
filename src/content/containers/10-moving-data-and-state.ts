import type { Section } from '../types'

export const movingDataAndState: Section = {
  id: 'moving-data-and-state',
  title: 'Moving data and state',
  scene: 'cp-and-commit',
  slide: `## One of these is a tool. One is a warning.

### \`docker cp\` — use it
Copies a file or directory either way, and **works on a stopped container** — which is what makes it a debugging tool. Pull a core dump, a crash log or a generated config out of a dead container and read it on the host.

\`\`\`bash
docker cp api:/var/log/app.log ./
\`\`\`

### \`docker commit\` — recognise it, don't use it
Freezes a container's writable layer into a new image. It works. The problem is what you get: **one opaque layer with no record of how it was made**. Nobody can reproduce it, audit it, or review a diff of it — including you, next month.

### The rule
A container is for **running**, not for building. The reproducible path to an image is a **Dockerfile** in version control — course 4. If you've been fixing a container by hand and want to keep the result, write down what you did; don't freeze it.`,
  narration:
    "Two commands that both move bytes out of a container, and they sit at opposite ends of a judgement about how to work. The first is docker cp, and it is straightforwardly useful. It copies files or directories in either direction — host to container, container to host — with the container side written as the container's name, a colon, and a path. The property that makes it a real debugging tool rather than a convenience is that it works on a stopped container. Something crashed, the container is sitting there in the exited state, and its writable layer still has everything it wrote: the core dump, the last log lines that never made it to stdout, the config file it generated at startup and then choked on. Docker cp gets those out onto the host where you can actually read them. That's a genuinely good workflow: look at the corpse before you remove it. Copying in is occasionally handy too — dropping a config into a running container to test a change without rebuilding — though you should treat that as an experiment, not a fix, because it lives only in that container's writable layer and vanishes when the container is replaced. The second command is docker commit, and I am telling you about it so you recognise it and then don't use it. Commit takes a container's writable layer and freezes it into a new image layer, producing a new image. Mechanically it works fine. The problem is what you end up holding. You have an image containing one large, opaque layer. There is no record of what was done to produce it. Nobody can read a description of its contents, because there isn't one. Nobody can review it, because there is no diff — just a blob. Nobody can rebuild it, because the steps existed only as commands you typed interactively and half-remember. And nobody can patch it later for a CVE without starting over, because there is no source to change. Six months on, that image is running in production and the honest answer to what is in it is: nobody knows. This is where the temptation comes from, and it is a real one. You've been debugging inside a container for two hours. You apt-installed a few things, you edited a config, you got it working. Committing feels like saving your work. What you are actually doing is converting two hours of knowledge into an artifact that contains the result and none of the knowledge. The discipline is the opposite: while you are experimenting in that container, keep a note of every command that turned out to matter. That list is your Dockerfile. Write it down, build from it, and check the image behaves the same way. Now the result is in version control, a colleague can review it line by line, and in eight months when a base image needs patching you change one line and rebuild. There are two narrow cases where commit earns its place: capturing the state of a container for forensic analysis after an incident, and as an emergency snapshot before doing something irreversible. Both are about preserving evidence, not about producing a thing you intend to run. The rule to keep is simple. A container is for running. A Dockerfile is for building. That's course four. One section left in this one: let's put it together.",
}
