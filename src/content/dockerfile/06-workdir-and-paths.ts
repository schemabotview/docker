import type { Section } from '../types'

export const workdirAndPaths: Section = {
  id: 'workdir-and-paths',
  title: 'WORKDIR and paths',
  scene: 'workdir-paths',
  slide: `## \`RUN cd /app\` doesn't fail. It just does nothing.

That container is thrown away (§1), and a working directory isn't part of a filesystem diff. The next instruction starts fresh at \`/\`.

**\`WORKDIR /app\`** is recorded in the image config, so it persists into every later instruction **and into the running container**. It also creates the directory.

\`WORKDIR\` is relative to the previous one: \`/app\` then \`src\` = \`/app/src\`.

### The trailing slash changes the meaning
- \`COPY app.js /opt/x\` → \`/opt/x\` is a **file**
- \`COPY app.js /opt/x/\` → \`/opt/x\` is a **directory**, file inside it
- \`COPY src/ /opt/x/\` → the **contents** of \`src\`, not the directory

No error either way. You find out when something can't open a path.

### The source is always the context
\`COPY /etc/hosts /app/\` copies \`<context>/etc/hosts\` — not the host's. Usually a "file not found" (§5).`,
  narration:
    "A short section about one instruction, and it's here because the bug it prevents is the most common one in this whole course. You write RUN cd slash app on one line, and RUN npm ci on the next. Nothing errors. The build completes. And your dependencies were installed in the wrong directory. Section one explained why: every instruction runs in its own throwaway container, and what gets committed is the filesystem difference. A working directory is a property of a process, not of a filesystem, so it is not in the diff and it does not survive. The cd genuinely happened — in a container that no longer exists. The next instruction gets a brand new container whose working directory is slash. WORKDIR is the instruction that actually persists, and the reason it persists is that it isn't a command at all: it writes a field into the image config. Which means every subsequent instruction runs there, and — this is the part people forget — so does the container when you eventually run the image. WORKDIR slash app followed by CMD node server dot js runs node in slash app. It also creates the directory if it doesn't exist, with mkdir dash p semantics, so you don't need a separate RUN mkdir. And it's relative: WORKDIR slash app then WORKDIR src puts you in slash app slash src, which is occasionally useful and occasionally a surprise. Use absolute paths unless you mean the relative behaviour. Now the trailing slash rule on COPY, which is the second silent thing in this section. Whether the destination ends with a slash changes what the copy means. COPY app dot js slash opt slash x, with no trailing slash, creates a file called x at slash opt containing your JavaScript. COPY app dot js slash opt slash x slash, with the slash, treats slash opt slash x as a directory and puts app dot js inside it. Those are completely different outcomes and neither one is an error. You find out later, when something tries to require slash opt slash x slash app dot js and gets a not-a-directory error, or when a config file turns out to be a directory. The habit that avoids it entirely: always put a trailing slash on the destination when you mean a directory, which is nearly always. Same rule on the source side, with one extra wrinkle. COPY src slash, with a trailing slash, copies the contents of src, not the directory itself. So COPY src slash slash app slash gives you slash app slash your-files, not slash app slash src slash your-files. If you wanted the directory, name it in the destination too. And finally, the rule from the last section, restated because it shows up as a path bug. The source of a COPY is always relative to the build context, even when it looks absolute. COPY slash etc slash hosts slash app slash does not copy your machine's hosts file — it looks for etc slash hosts inside the context directory, doesn't find it, and fails. That leading slash is not a reference to the host filesystem, because the host filesystem was never uploaded. Next: two kinds of variable, and which of them is a place to keep secrets. Neither is.",
}
