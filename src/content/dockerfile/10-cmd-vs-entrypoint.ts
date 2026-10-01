import type { Section } from '../types'

export const cmdVsEntrypoint: Section = {
  id: 'cmd-vs-entrypoint',
  title: 'CMD vs ENTRYPOINT',
  scene: 'cmd-entrypoint',
  slide: `## One rule, not four cases

**\`ENTRYPOINT\` is the command. \`CMD\` is its default arguments.** What you type after the image name on \`docker run\` **replaces \`CMD\`** — never \`ENTRYPOINT\`.

- \`CMD ["a","b"]\` → \`docker run img extra\` runs **\`extra\`**
- \`ENTRYPOINT ["a"]\` + \`CMD ["b"]\` → runs **\`a extra\`**

Which is why \`docker run myimage bash\` works on a CMD-only image and does something baffling on one with an ENTRYPOINT — you passed \`bash\` as an *argument*. Use \`--entrypoint\` to override that.

### Which to pick
- **\`CMD\` only** — the image is a *toolbox* you'll run different things in. Most application images
- **Both** — the image *is* one program: \`ENTRYPOINT ["postgres"]\`, \`CMD\` its default flags

### Always exec form
\`CMD ["node","app.js"]\`, never \`CMD node app.js\`. Shell form puts \`/bin/sh\` at pid 1, which swallows SIGTERM (course 2 §3).

### The entrypoint script
A script that does setup, then \`exec "$@"\` — so your process still becomes pid 1.`,
  narration:
    "Two instructions, four combinations, and it's usually taught as a table to memorise. There's one rule underneath it, and once you have the rule the table is obvious. The rule: ENTRYPOINT is the command, and CMD is its default arguments. And anything you type after the image name on docker run replaces CMD. It never touches ENTRYPOINT. Walk the cases with that in hand. If the image has only CMD — say CMD, node, server dot js — then CMD is acting as the whole command line because there's no ENTRYPOINT in front of it. Docker run image runs node server dot js. Docker run image bash replaces the CMD entirely, so you get a shell. That's why running a shell in an image usually just works. If the image has only ENTRYPOINT — say ENTRYPOINT, postgres — then docker run image runs postgres, and docker run image dash dash version runs postgres dash dash version, because your argument replaced the empty CMD and got appended to the entrypoint. If it has both — ENTRYPOINT postgres, CMD with some default flags — then docker run image runs postgres with those flags, and docker run image with your own flags runs postgres with yours instead. The entrypoint is fixed; the arguments are yours. And now the confusing case is no longer confusing. Docker run myimage bash on an image with an ENTRYPOINT does not give you a shell. It runs the entrypoint program with bash as an argument, and you get whatever that program says about an argument it doesn't understand. That reads as broken, and it isn't — it's the rule working. The override is dash dash entrypoint, before the image name, which replaces the entrypoint itself. So which should you use? A useful way to decide: is this image a program, or a place to run programs? A typical application image is a place — you'll want to run the app, but also a migration command, a one-off script, a shell to look around. Give it CMD only, so all of those are easy. An image that is one program — a database, a linter, a CLI tool distributed as an image — deserves ENTRYPOINT, because it makes docker run behave like the program itself and stops people accidentally running something else. Now the part that isn't optional. Always use exec form, the JSON array with square brackets and double quotes. Shell form — CMD node app dot js as bare text — wraps it in slash bin slash sh dash c, and that makes slash bin slash sh pid 1. Course two, section three: sh ignores SIGTERM and doesn't forward it, so docker stop waits its full ten seconds and then kills your app mid-request. Every time. Exec form makes your process pid 1, so it gets the signal and can shut down cleanly. One caveat that catches people: exec form has no shell, so dollar-sign variables are not expanded and pipes and redirects don't work. If you need those, the answer is not to fall back to shell form — it's an entrypoint script. And that's the last pattern. Write a small shell script, make it the ENTRYPOINT, and have it do whatever setup needs a shell — expand variables, wait for a dependency, run a migration — and then, as its last line, exec dollar-sign-at. That exec is doing the important work: it replaces the shell process with your program, so your program inherits pid 1 and gets signals properly. A script that ends by running your program without exec leaves the shell at pid 1 and you're back to the ten-second problem. Next: the cache, and why the order of these instructions decides whether your build takes four seconds or four minutes.",
}
