import type { Section } from '../types'

export const observability: Section = {
  id: 'observability',
  title: 'Observability',
  scene: 'disk-map',
  slide: `## Four sources, and one of them is unknown to most people

- **\`docker stats\`** — live cgroup accounting (course 2 §6). \`--no-stream\` for a single reading in a script
- **\`docker events\`** — a **stream** of everything the daemon does: created, started, died, OOM, health_status. This is the one people don't know about, and it's how you find out *why* a container disappeared at 3am
- **\`docker system df -v\`** — where the disk is (§6)
- **The metrics endpoint** — \`"metrics-addr"\` in \`daemon.json\` exposes Prometheus metrics about the **daemon**, not your app

### What to actually alert on
- **Disk** on \`/var/lib/docker\`. The single most useful alert here (§6)
- **Restart counts.** A container restarting every 30 s looks like \`Up\` at a glance (course 2 §5)
- **\`health_status: unhealthy\` events**, because Docker itself does nothing about them (course 4 §9)
- **OOM kills** — exit 137, from \`docker events\``,
  narration:
    "Four ways to see what's happening, and one of them is genuinely underused. Docker stats you know from course two: live CPU, memory against the limit, network and block IO, read straight from the cgroup accounting. Use dash dash no-stream when you want a single reading rather than a refreshing display, because the streaming form is useless in a script. Docker system df, with dash v, is where the disk went, and that's the next section. The metrics endpoint is worth a sentence: setting metrics-addr in daemon dot json exposes Prometheus metrics, and the thing to know is that they're about the daemon — build counts, API request latency, container state counts — not about your applications. Useful for watching Docker itself; not a substitute for instrumenting your services. The one people don't know about is docker events. It's a live stream of everything the daemon does: containers created, started, stopped, died with an exit code, killed, OOM-killed, images pulled, volumes created and destroyed, networks connected, and health status changes. Every state transition in the system, as it happens, with timestamps. And it takes filters and a format string, so you can narrow it to what you care about, and it takes dash dash since with a timestamp, which means you can go back and look at what happened rather than only watching forward. That's the killer feature. A container disappeared at three in the morning and nobody knows why: docker events dash dash since with a time before the incident tells you whether it exited on its own, was OOM-killed, was stopped by someone, or was destroyed by a compose down. That question is otherwise genuinely hard to answer after the fact, and docker events answers it in one command. It's also the right foundation if you want to record container lifecycle into your own monitoring: a small process consuming that stream and emitting metrics or log lines gives you container-level history for free. Now, what to actually alert on, because there are four things and they're not obvious. First, disk usage on slash var slash lib slash docker. If you set up one alert from this entire course, set up that one — a full Docker disk produces a dozen unrelated symptoms and it's entirely predictable in advance. Second, restart counts. Course two: a container crash-looping under a restart policy backs off, so it restarts roughly every thirty seconds, and it looks almost alive in docker ps. A count of restarts over time catches it; a glance at the process list does not. Third, unhealthy health status, which you get from docker events. Course four made the point that Docker records the health state and does nothing at all about it — no restart, no removal from anything. So if you're writing health checks, something has to watch them, and events is where they surface. Fourth, OOM kills, which also appear as events, and which correspond to exit code 137. Those tell you a memory limit is too low or an application is leaking, and they're silent otherwise — the container just stops. Next: the disk itself.",
}
