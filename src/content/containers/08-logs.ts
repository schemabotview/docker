import type { Section } from '../types'

export const logs: Section = {
  id: 'logs',
  title: 'Logs',
  scene: 'logs-pipeline',
  slide: `## Don't write log files. Write to stdout.

In a container the application writes to **stdout and stderr**, and the **log driver** decides everything after that. A log file inside a container dies with the container and nobody can reach it.

### What the default driver does
\`json-file\` writes \`/var/lib/docker/containers/<id>/<id>-json.log\` — which is what \`docker logs\` reads back. It keeps stdout and stderr distinguishable, and it records a timestamp per line.

### It does not rotate
Until you set it. A chatty container fills the host's disk and takes **everything else on the box** down with it:

\`\`\`bash
--log-opt max-size=10m --log-opt max-file=3
\`\`\`

Set it in \`daemon.json\` so it applies to every container, not one at a time.

### Reading them
\`-f\` follow · \`--tail 100\` (the default is **all of them**) · \`--since 10m\` · \`-t\` timestamps.

Switch to a remote driver and \`docker logs\` **stops working** — which reads as a broken container.`,
  narration:
    "Logging in containers involves one inversion, and once you have it everything else follows. Outside a container, an application typically opens a log file and writes to it, and something rotates that file. Inside a container, you do not do that. You write to standard output and standard error, and you let Docker deal with it. The reason is simple: a log file written inside a container lives in the container's writable layer, which means it disappears when the container is removed, and while the container exists nothing outside it can conveniently read the file. Stdout, by contrast, is a stream Docker is already holding. So your process writes to stdout. Docker's logging driver intercepts both streams — and note that it keeps them separate the whole way through, so stderr stays distinguishable from stdout, which matters more than people expect when you are trying to find an error in a million lines of access log. The default driver is called json-file, and it does what the name says: it writes a JSON-lines file, one object per line, with the stream name and a timestamp, under slash var slash lib slash docker slash containers slash the container id. And that file is precisely what docker logs reads back. Docker logs is not a live tap into the process; it is a reader for whatever the driver stored. Which brings us to the thing that takes hosts down. The json-file driver does not rotate by default. A container that logs a few hundred kilobytes a minute will, over a couple of weeks, write tens of gigabytes into that file, and when the disk fills it does not just affect that container — everything on the host that needs to write anything starts failing, including the daemon itself. The fix is two options, max-size and max-file, which cap each file and keep a fixed number of them. You can pass them per container at run time, but the right place is the daemon's configuration file, so that every container on the host gets rotation whether or not whoever started it remembered. That is section one of the production course, and it is genuinely the single highest-value line of Docker configuration there is. Reading logs back is straightforward, with four flags worth knowing. Dash f follows, like tail dash f. Dash dash tail with a number gives you the last N lines — and the default, remember, is all of them, so docker logs on a container that has been up for a month will happily dump several gigabytes into your terminal. Dash dash since takes a duration or a timestamp and gives you a window. And dash t adds timestamps, which is worth noting: those are Docker's timestamps, recorded when the line was received, not your application's. Finally, the driver is pluggable, and this is where a confusing failure comes from. Switch to journald, or fluentd, or awslogs, and your logs go off to that system instead. That is often exactly right for production. But docker logs then returns nothing, or an error saying the driver does not support reading. The container is fine. The logs exist. They are simply somewhere else, and the tool you reached for does not know where. Next: four ways to look inside a container that is actually running.",
}
