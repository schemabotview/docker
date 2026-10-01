import type { Section } from '../types'

export const foregroundDetached: Section = {
  id: 'foreground-detached',
  title: 'Attached, detached, interactive',
  scene: 'attach-modes',
  slide: `## Three flags, three separate decisions

They are not a mode switch. Each flag wires **one stream**.

- **default** — attached. Your terminal blocks; stdout and stderr stream to you; **Ctrl-C sends SIGINT to pid 1**
- **\`-d\`** — detached. Prints the id, returns immediately. Output goes to the log driver instead (§8)
- **\`-i\`** — keeps the container's **stdin open** and wired to yours
- **\`-t\`** — allocates a **pseudo-terminal**, so the program prints a prompt, colours and line editing

### Why \`-it\` is always typed together
\`-i\` alone: a shell, but no prompt and no line editing. \`-t\` alone: a prompt you can't type into. Neither is useful; the pair is.

### The one that catches people
\`docker run -d alpine sh\` exits **instantly**. Detached means no stdin, \`sh\` reads EOF and returns — and a returned pid 1 is a stopped container (§4).`,
  narration:
    "Three flags, and almost everybody learns them as incantations: dash d means background, dash i t means interactive. That works until it doesn't, and when it doesn't the failure is bizarre — a container that exits in under a second with no error. So let's take them apart, because each one is a decision about a single stream. Start with the default, no flags at all. Your terminal is attached to the container. Its stdout and stderr stream to your screen live, your shell blocks until the container exits, and — this is the part people forget — Ctrl-C sends SIGINT to pid 1 inside the container. You are not detaching when you press Ctrl-C; you are signalling the process, and whether it dies depends on whether it handles SIGINT. Now dash d, detach. Docker starts the container, prints its id, and returns your prompt immediately. Your terminal is connected to nothing. The container's output still exists, but it goes to the logging driver instead, and you read it back with docker logs — which is section eight. Dash i is about stdin. By default the container's standard input is closed. Dash i keeps it open and connects it to yours, so what you type goes into the process. And dash t allocates a pseudo-terminal — a tty — for the container. That matters because programs behave differently when they believe they are talking to a human. With a tty, a shell prints a prompt, bash gives you line editing and history, ls prints in colour and in columns. Without one, the same shell runs perfectly well but silently, in a way that feels broken. Which is why you always see them written together as dash i t. Dash i on its own gives you a shell that accepts input but shows no prompt — you type a command, press enter, and the output appears with no indication anything is listening. Dash t on its own gives you a prompt and no way to type into it. Individually they are both useless; together they are an interactive session. And now the failure I promised. Docker run dash d alpine sh. Detached, so no stdin is attached. The shell starts, immediately reads end-of-file on standard input, and does exactly what any shell does at EOF: it exits. Pid 1 has returned, so the container has stopped — that's section four's rule. Docker ps shows nothing, docker ps dash a shows Exited zero, and the whole thing took about forty milliseconds. Nothing failed. You asked for a shell with nothing to read and it finished reading. If you want a container that stays up in the background, its main process has to be something that stays up — a server, a worker loop — or you pass dash i t along with dash d, which keeps stdin open for it. Next, the process at the other end of all this wiring, and the single highest-value idea in the course: what it means to be pid 1.",
}
