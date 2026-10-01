import type { Section } from '../types'

export const lookingInside: Section = {
  id: 'looking-inside',
  title: 'Looking inside',
  scene: 'exec-session',
  slide: `## \`exec\` starts a *new* process and joins it

It doesn't open a door into a box. It launches a process and attaches it to the container's existing namespaces — same filesystem, same network, same pid view.

Which is why exiting the shell doesn't stop the container, and why \`exec\` **fails on an exited container**: there are no namespaces left to join.

### The four tools
- \`docker exec -it c sh\` — a shell, when the image has one
- \`docker inspect --format '{{.State.Status}}'\` — **one field**, scriptable. The raw JSON is enormous
- \`docker top c\` — its processes, with the **host's** pid numbers
- \`docker stats\` — live cgroup accounting (§6)

### When there's no shell
Distroless and \`scratch\` images have no \`sh\`. \`exec\` returns *executable file not found* — the container is fine. Bring tools **into its namespaces** instead:

\`\`\`bash
docker run -it --pid container:api \\
  --net container:api nicolaka/netshoot
\`\`\``,
  narration:
    "Four tools, and one idea that makes all four make sense. The idea is what docker exec actually does. It is tempting to picture exec as opening a door into a sealed box and stepping inside. That is not what happens. Docker exec starts a brand new process on the host — an ordinary process — and joins it to the namespaces that the container already has. Same mount namespace, so it sees the container's filesystem. Same network namespace, so it shares the container's interfaces and can reach whatever the container can reach. Same pid namespace, so it sees the container's process view. It is a second process wearing the same costume. Once you hold that, three things stop being surprising. Exiting the shell you exec'd does not stop the container, because that shell was never pid 1 — it was a sibling. Exec fails on an exited container, with an error about the container not being running, because there are no namespaces left to join; they were torn down when pid 1 returned. And anything you install during an exec session lands in the container's writable layer, which means it is gone the moment the container is replaced — so exec is for looking, not for fixing. Now the tools. Docker exec dash i t, a container name, and sh gives you a shell, and that is the one everyone reaches for. Docker inspect gives you the container's entire configuration and state as JSON, and the raw output is genuinely enormous — several hundred lines. The useful form is with dash dash format and a Go template pulling out exactly one field: State dot Status, or State dot ExitCode, or Config dot Cmd, which is the one that diagnoses the pid 1 bug from section three. That form is scriptable, which the raw JSON is not, and learning two or three of those templates will save you more time than any other single thing in this course. Docker top shows the processes running inside, and it shows them with the host's process ids — which is section three of the runtime course made concrete. The process that thinks it is pid 1 is pid four thousand four hundred and seventeen out here, and you can point ordinary host tools at that number. And docker stats is live cgroup accounting: CPU percentage, memory against the limit, network and block IO. Use dash dash no-stream if you want a single reading rather than a refreshing display, which is what you want in a script. Finally, the case where all of this stops working, because it is increasingly common and it looks like a broken container. Minimal images — distroless, or anything built from scratch — contain your application binary and nothing else. No shell. No ls, no cat, no ps. Docker exec dash i t container sh returns an OCI runtime error saying the executable was not found, and the natural reading of that is that something is wrong with the container. Nothing is wrong with the container. There is simply no shell in it, which is the entire point of that kind of image: a smaller attack surface, because an attacker who gets in has no tools either. The technique is to bring your own tools and join them to the container's namespaces, which is the last line on the left: run a debugging image like netshoot with dash dash pid container colon api and dash dash net container colon api. Now you have a full toolbox looking at exactly the same process table and the same network stack, in a separate container that you throw away afterwards. Next: getting files and state back out.",
}
