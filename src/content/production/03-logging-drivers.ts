import type { Section } from '../types'

export const loggingDrivers: Section = {
  id: 'logging-drivers',
  title: 'Logging drivers',
  scene: 'daemon-config',
  slide: `## Two lines, in \`daemon.json\`, today

\`\`\`json
"log-opts": { "max-size": "10m", "max-file": "3" }
\`\`\`

The default \`json-file\` driver does **not rotate**. A container logging a few hundred KB a minute fills a disk over a couple of weeks, and when it does, everything else on the host starts failing too — including \`dockerd\`.

Put it in \`daemon.json\` so it applies to every container, not one at a time. Note it only affects containers **created after** the change.

### The other drivers
\`local\` (more efficient than \`json-file\`, still readable by \`docker logs\`), \`journald\`, \`fluentd\`, \`awslogs\`, \`gelf\`, \`syslog\`.

### The one that surprises people
Most remote drivers make \`docker logs\` **stop working** — it reads what the local driver stored, and there isn't one. The container is fine; the logs are elsewhere. Worth telling your team before you switch.

### And a blocking driver can stall your app
Remote drivers default to \`mode=blocking\`. Set \`mode=non-blocking\` with a \`max-buffer-size\`.`,
  narration:
    "Course two covered logging from the application's side: write to stdout, the driver decides what happens next. This is the operator's side, and it opens with the single most valuable configuration change in this course. The default json-file driver does not rotate. At all. A container that writes a few hundred kilobytes a minute — which is an ordinary access log — produces tens of gigabytes over a couple of weeks. And when the disk fills, the failure is not confined to that container: every process on the host that needs to write anything starts failing, including dockerd itself, which then can't start containers, and the symptoms fan out into a dozen unrelated-looking problems. Two lines in daemon dot json fix it permanently: max-size, and max-file. Ten megabytes and three files is a reasonable default — thirty megabytes of logs per container, which is plenty for debugging and bounded. You can set this per container with dash dash log-opt, and you shouldn't rely on that, because it depends on whoever starts the container remembering. Put it in daemon dot json and every container on the host gets it. One caveat: it applies to containers created after the change, so existing ones keep their old unbounded setting until they're recreated. On a host you suspect, check the file sizes directly under slash var slash lib slash docker slash containers. The other drivers. Local is worth knowing about: it's a more efficient binary format than json-file, it rotates by default, and docker logs still works with it. If you're not shipping logs anywhere, local is a straightforwardly better default than json-file and hardly anyone uses it. Journald hands logs to systemd's journal, which is a good fit on a systemd host because you get one log stream for containers and system services together, with journald's own rotation. Then the shipping drivers — fluentd, awslogs, gelf, syslog — which send logs to a collector or a cloud service. Now the behaviour that surprises people, and it's worth warning a team about before you change anything. Most remote drivers make docker logs stop working. It returns an error saying the driver doesn't support reading. And that's correct: docker logs reads what a local driver stored, and with a remote driver there is no local copy. But the way it presents is that someone is debugging an incident, runs docker logs, gets an error, and concludes the container is broken. Tell people where the logs went. Some drivers support a dual mode that keeps a local copy as well, which is worth the disk if your team is used to docker logs. And one more, which is a genuine availability problem. Remote drivers default to mode equals blocking: if the log destination is slow or unreachable, the driver blocks, and a driver that blocks blocks your application's writes to stdout — so your log collector being down takes your application down with it. Set mode equals non-blocking with a max-buffer-size, and you lose log lines when the buffer fills instead of losing the service. That's almost always the right trade, and the default is the other way. Next: the runtime underneath.",
}
