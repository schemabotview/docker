import type { Section } from '../types'

export const theDockerfile: Section = {
  id: 'the-dockerfile',
  title: 'A build is a loop',
  scene: 'build-loop',
  slide: `## Not a script. A loop, once per instruction.

For each line: start a **throwaway container** on the layers so far → run the instruction in it → **commit the filesystem diff** as a new layer → discard the container.

Then again, on top of that layer.

### Everything in this course follows from it
- **Each step is a layer** — so instruction *count* is image *structure*
- **No state survives** — \`RUN cd /app\` runs in a container that is then thrown away. Use \`WORKDIR\` (§6)
- **Deleting only hides** — a later layer can't modify an earlier one (course 3 §2)
- **A step can be skipped** — if its inputs are unchanged, its layer is reused (§11)

### And it's reproducible
A Dockerfile in version control is reviewable, diffable and rebuildable — everything \`docker commit\` isn't (course 2 §10).`,
  narration:
    "Three courses of running other people's images. Now we make one. And the first thing to get right is not syntax, it's the execution model — because every rule in this course, including the ones that look arbitrary, falls straight out of it. A Dockerfile is not a shell script that runs top to bottom in one environment. It is a list of instructions, and the build is a loop that runs once per instruction. Here's one turn of the loop. Docker takes the layers accumulated so far — after FROM, that's the base image. It starts a container on top of them. It runs the instruction inside that container. Then it takes the difference the instruction made to the filesystem, tars that up, and commits it as a new layer. And then it throws the container away. Next instruction, same loop, one layer higher. That's it. That's the whole build. Now watch how much falls out of it. First: each instruction produces a layer. Not most of them — each. So the number of instructions in your Dockerfile is not a style question, it is the structure of the image you are producing, and it is why you'll see those long chains of double-ampersands inside a single RUN. Second, and this is the one that catches everybody once: no state survives between instructions except the filesystem. If you write RUN cd slash app on one line and RUN npm ci on the next, the cd happened in a container that no longer exists. The working directory is not part of a filesystem diff, so it was never committed. The second instruction starts a fresh container whose working directory is slash, and your npm install runs in the wrong place. It does not error. It just quietly does the wrong thing. WORKDIR is the instruction that actually persists, and it gets section six. The same applies to environment variables set with export, to background processes you start, to anything that lives in a process rather than on disk. Third: deleting in a later step does not shrink the image. That's the whiteout rule from course three, and now you can see exactly why. A layer is a diff committed on top of the ones below, and layers below are immutable — the build physically cannot go back and remove bytes from them. So an install in one RUN and a cleanup in the next gives you an image carrying both. Fourth, and this is the payoff: because each step's output is a function of its inputs, a step whose inputs haven't changed produces the same layer it produced last time. So the build can skip it entirely and reuse the layer. That's the cache, it is the difference between a four-second build and a four-minute one, and it's section eleven. And one more thing, which is the reason we're doing this at all rather than docker commit. A Dockerfile is a file. It lives in version control next to the code it builds. A colleague can review it line by line, you can diff two versions, and anyone can rebuild it. That's what commit gave up, and it is not a small thing. Next: the first line.",
}
