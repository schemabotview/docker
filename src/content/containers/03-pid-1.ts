import type { Section } from '../types'

export const pid1: Section = {
  id: 'pid-1',
  title: 'pid 1 and the ten seconds',
  scene: 'pid-1-signals',
  slide: `## \`docker stop\` is three things

**SIGTERM** → wait **10 seconds** → **SIGKILL**. Whether those ten seconds are usable depends entirely on **who is pid 1**.

### The trap: shell form
\`CMD node app.js\` becomes \`/bin/sh -c "node app.js"\`. Now **\`sh\` is pid 1** — and \`sh\` ignores SIGTERM and forwards nothing. Your app never hears it, waits out the full ten seconds, then dies by SIGKILL mid-request.

**\`CMD ["node","app.js"]\`** — exec form — makes your process pid 1, so it gets the signal directly.

### The tell
A service that takes **exactly ten seconds** to stop, every time, is this bug. Confirm with \`docker inspect --format '{{.Config.Cmd}}'\`.

### Two more pid-1 facts
- pid 1 does not **reap** orphaned children → zombies. \`--init\` inserts a tiny reaper
- \`docker kill\` skips straight to SIGKILL. \`docker stop -t 30\` buys longer`,
  narration:
    "This is the most valuable section in the course, and it is one that most Docker material skips entirely. Here is the setup. You run docker stop on a container. What actually happens is three things in sequence, not one. First, dockerd sends SIGTERM to process id 1 inside the container. That is the polite request: finish what you are doing and exit. Then it waits ten seconds. Then, if the container is still alive, it sends SIGKILL, which cannot be caught, blocked or ignored — the kernel simply ends the process. Ten seconds is a generous grace period. A web server can drain its connections in ten seconds; a worker can finish its current job and stop taking new ones. But whether your program gets to use those ten seconds depends on something you probably did not think about when you wrote your Dockerfile: who is pid 1. Look at the two shapes on the left. On the left-hand side, the shell form. You wrote CMD node app dot js in your Dockerfile, without brackets. Docker turns that into slash bin slash sh dash c, quote, node app dot js. So when the container starts, the process at pid 1 is a shell, and the shell forks your node process as a child, at some other pid. Now SIGTERM arrives. It goes to pid 1, which is the shell. And the shell — this is the crucial fact — ignores SIGTERM when it is running non-interactively, and it does not forward signals to its children. So your application never learns that anything was asked of it. It keeps serving. Ten seconds pass. SIGKILL arrives, and your process dies instantly, in the middle of whatever it was doing, with no chance to finish a request or flush a write. On the right-hand side, the exec form: CMD, square brackets, quote node, quote app dot js. No shell at all. Your process is pid 1. SIGTERM arrives, your shutdown handler runs, you stop accepting new connections, you finish the ones in flight, you close your database pool, and you exit zero. The whole thing takes two hundred milliseconds. Here is how to recognise the bug in the wild, because it has a very distinctive signature: a service that takes exactly ten seconds to stop. Every single time, ten seconds, never nine, never eleven. That is not your application being slow to shut down. That is your application never being told to shut down and dockerd's timer running out. Confirm it with docker inspect, format, Config dot Cmd — if you see slash bin slash sh dash c at the front, that's it. Two more things about pid 1, because it is a genuinely special process id in Linux. First, pid 1 has a second job besides being your program: it is supposed to reap orphaned child processes. When a process's parent dies, the orphan gets re-parented to pid 1, and pid 1 is expected to call wait on it so the kernel can clean up the entry. Your web server does not do that, because it was never written to be an init system. So in a container that spawns subprocesses, dead children can accumulate as zombies. The fix is one flag: dash dash init, which inserts a tiny init process at pid 1 that reaps children and forwards signals to your program. Second, docker kill is not a harsher docker stop — it skips the SIGTERM and the grace period entirely and sends SIGKILL immediately. And if ten seconds genuinely is not enough for your workload, docker stop dash t 30 buys you thirty. Next: the full lifecycle, and how to read the number a container leaves behind.",
}
