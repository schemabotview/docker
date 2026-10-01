import type { Section } from '../types'

export const envVsArg: Section = {
  id: 'env-vs-arg',
  title: 'ENV vs ARG',
  scene: 'env-vs-arg',
  slide: `## Two variables, two different *times*

- **\`ARG\`** exists only while the build runs. Declared in the Dockerfile with a default, overridden per build with \`--build-arg\`. The container **never sees it**
- **\`ENV\`** is written into the image config. Every later instruction sees it, and so does the running process — overridable with \`-e\` (course 2 §7)

### \`ARG\` is not a secret mechanism
It is in \`docker history\`, in plain text, for anyone who can pull the image (course 3 §5). Deleting the file you wrote it to doesn't help — the earlier layer still has it.

**The real answer** is \`RUN --mount=type=secret\`, which is course 5 §5.

### Two scope rules that catch people
- \`ARG\` before the **first \`FROM\`** is outside every stage. To use it inside, re-declare it there
- \`ENV X=1\` and \`RUN export X=1\` are not the same — the \`export\` dies with that step's container (§1)`,
  narration:
    "Two instructions that both set a variable, and the difference between them is not scope in the usual sense — it's time. ARG exists during the build and only during the build. You declare it in the Dockerfile, usually with a default, and you can override it per build with dash dash build-arg on the command line. Instructions below the declaration can use it. And when the build finishes, it's gone: the container that eventually runs from this image has no such variable in its environment. ENV is different. ENV writes the variable into the image's configuration — the config blob from course three. So it's visible to every instruction below it during the build, and it's also in the process's environment at run time, every time anyone runs the image, forever, unless they override it with dash e. So the rule is straightforward: ARG for things the build needs and the runtime doesn't — a version number to fetch, a build target, a git SHA to bake into a label. ENV for things the application needs when it runs — NODE_ENV, a log level, a path. Now the trap, and it is worth being blunt about because it is one of the most common security mistakes in this whole subject. People reason: a secret shouldn't be in the image, and ARG doesn't end up in the runtime environment, so ARG is the safe way to pass a secret into a build. That reasoning is wrong, and the reason is course three, section five. Every instruction's command string is recorded in the image's build history, in plain text, as part of the config. Docker history prints it. So a token passed as a build argument is in the image, readable by anyone who can pull it — not in the environment, but in the metadata, which is just as public. And the usual mitigations don't work. Deleting the file you wrote the token into doesn't help, because the earlier layer still contains it. Unsetting the variable doesn't help, because the history records the command, not the current state. Using a multi-stage build helps only if the ARG was never declared in a stage that ships, which is easy to get wrong. The actual answer is a BuildKit secret mount: RUN dash dash mount equals type equals secret, which makes the secret available as a file for the duration of one instruction and records nothing. That's course five, section five, and if you have ever passed a credential as a build argument, treat it as published and rotate it. Two scope rules to finish. The first: an ARG declared before the first FROM is special — it's outside every build stage, which is what lets you parameterise the base image itself, as in ARG VERSION then FROM node colon dollar VERSION. But it is not automatically visible inside the stages. To use it after a FROM you have to re-declare it, with a bare ARG and the same name. Everyone hits this once, and the symptom is a variable that mysteriously expands to an empty string. The second: ENV and a shell export are not interchangeable. RUN export FOO equals bar sets a variable in a shell inside a container that is then discarded — section one again. Only ENV persists. Next: four instructions that write no files at all.",
}
