import type { Section } from '../types'

export const run: Section = {
  id: 'run',
  title: 'RUN — one layer each',
  scene: 'run-layers',
  slide: `## Splitting \`apt-get\` is a *bug*, not a style choice

\`\`\`docker
RUN apt-get update            # layer A
RUN apt-get install -y curl   # layer B
\`\`\`

Edit the Dockerfile later and layer A is a **cache hit** — the package index from weeks ago is reused — while B re-runs. You get \`404 Not Found\` on a package that exists. Joining them with \`&&\` makes A and B one layer, so they are always fresh together.

### The rest of the idiom
- \`--no-install-recommends\` — skips "suggested" packages. Often hundreds of MB
- \`rm -rf /var/lib/apt/lists/*\` — **in the same \`RUN\`**, or the index ships anyway (course 3 §2)

### Two forms
\`RUN cmd\` runs through \`/bin/sh -c\` — \`$VAR\`, pipes and \`&&\` work. \`RUN ["bin","-f"]\` is exec form: no shell, so none of those do.

### The silent one
\`RUN a | b\` succeeds if **\`b\`** succeeds, even when \`a\` failed. Fix it once: \`SHELL ["/bin/bash","-eo","pipefail","-c"]\`.`,
  narration:
    "RUN is where essentially all of your image's size comes from, and it has one idiom that everybody copies and few people can explain. Let's explain it, because part of it is not about size at all — it's a correctness bug waiting several weeks to happen. Start with the wrong version: RUN apt-get update on one line, RUN apt-get install on the next. That's three problems, and the third is the interesting one. Problem one: two layers where one would do. Problem two: if you then clean up in a third RUN, the package index is already committed in layer A and shipped forever, hidden but present. Problem three, and this is the one that bites months later. Remember from section one that the cache reuses a step when its inputs haven't changed, and for RUN the input is just the command string. So RUN apt-get update is a cache hit forever — the string never changes, so the step never re-runs, and the package index in that layer stays frozen at whatever it was the day you first built. Now you edit the install line to add a package. That line's string changed, so it re-runs — against a package index that is six weeks old. The repository has since moved on: the exact version the stale index names has been superseded and deleted from the mirror. You get 404 Not Found on a package that definitely exists, on a Dockerfile that worked last month, and nothing in the error hints at caching. Joining them with double-ampersand fixes it completely, because now update and install are one instruction and one cache entry: either both re-run or neither does. Then the rest of the idiom. Dash dash no-install-recommends tells apt not to pull in packages that are merely suggested, which on a Debian base routinely saves hundreds of megabytes of documentation, locales and tooling nobody asked for. And rm dash rf of slash var slash lib slash apt slash lists removes the package index, which is around forty megabytes and is completely useless at runtime — but it has to be in the same RUN, joined with the same ampersands, or you're back to hiding rather than deleting. RUN has two forms, like CMD and ENTRYPOINT do. Shell form — RUN and then a command as plain text — wraps it in slash bin slash sh dash c, so dollar-sign variables expand, pipes work, and double-ampersand works. Exec form, with a JSON array, runs the binary directly with no shell at all, so none of those do anything: a dollar sign is a literal dollar sign. That catches people who write an exec-form RUN with a variable in it and watch it not expand. And finally, the silent failure, which is worth fixing in every Dockerfile you write. In a default shell, a pipeline's exit status is the status of the last command. So RUN curl something-that-404s pipe tar dash x succeeds, because tar exited zero after receiving an error page. Your build carries on, your image is broken, and you find out in production. One line fixes it for the whole file: SHELL, then bash with dash e and dash o pipefail. Now any command in a pipeline failing fails the build, at the line that caused it. Next: getting your own files in.",
}
