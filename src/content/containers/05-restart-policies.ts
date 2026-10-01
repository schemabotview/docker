import type { Section } from '../types'

export const restartPolicies: Section = {
  id: 'restart-policies',
  title: 'Restart policies',
  scene: 'restart-policies',
  slide: `## The column that matters is the last one

Every policy restarts a crashed container. The real question is **what a host reboot does**.

- **\`no\`** (default) — nothing ever comes back
- **\`on-failure[:N]\`** — restarts on a **non-zero** exit only, optionally capped. Right for batch jobs
- **\`always\`** — restarts on **any** exit, and comes back after a reboot **even if you deliberately stopped it**
- **\`unless-stopped\`** — same, except it **remembers** that you stopped it on purpose

For a long-running service, \`unless-stopped\` is almost always the one you want.

### The backoff hides a crash loop
Retries back off 100ms → 200ms → 400ms, doubling to a minute. A container crash-looping every 30 s is **not** obviously broken — and \`docker ps\` says \`Restarting (1)\`, not \`Up\`. Check the **status text**, not just that a row exists.`,
  narration:
    "A container's main process exits. What should happen? Docker's answer is a restart policy, set with dash dash restart, and there are four of them. Learning them as a list is easy and slightly misses the point, because the difference that actually matters is not whether a crashed container comes back — three of the four do that — it is what happens after the host reboots. Start with no, which is the default, and which surprises people. By default a container that exits stays exited, and a container that was running when the machine rebooted does not come back. If you started a database with docker run and nothing else, and someone rebooted the box, your database is down and will stay down. Then on-failure. This restarts the container only when it exits with a non-zero code, and you can cap the number of attempts with a colon and a number. That is the right policy for anything batch-shaped: a job that finishes successfully should not be started again, but a job that crashed probably deserves a couple of retries. Then always. This restarts the container on any exit, zero or not, and after a host reboot it comes back. And it comes back even if you had deliberately run docker stop on it before the reboot — which is either exactly what you wanted or a genuine surprise at three in the morning. Then unless-stopped, which behaves identically to always in every respect but one: it remembers an explicit stop. If you stopped the container on purpose, a reboot leaves it stopped. That is usually the behaviour you actually want for a long-running service, and it is why unless-stopped is the default recommendation for anything you intend to leave running. The distinction is small enough to sound pedantic until the night you stop a service to take a host out of rotation, the host reboots, and the service comes back and starts taking traffic again. Now the part that turns a restart policy into a debugging problem. Docker does not retry in a tight loop — it backs off. The first restart is after a hundred milliseconds, then two hundred, then four hundred, doubling up to a maximum of one minute. That is sensible engineering: a container that crashes instantly on startup would otherwise burn a core. But it has a consequence. A container that is crash-looping is restarting every thirty seconds or so, not every thirty milliseconds, which means it looks almost alive. It appears in docker ps. If you glance at the output and see a row, you conclude it is running. The tell is in the status column: a healthy container says Up, and then a duration. A crash-looping one says Restarting, with the exit code in brackets, and a timestamp that keeps changing. So read the status text, not just the presence of a row — and when you see Restarting, go straight to docker logs, because the container has already printed its failure several times. One last practical note: the policy is not fixed at creation. Docker update dash dash restart unless-stopped, and the name of a running container, changes it live without recreating anything. Next: the limits — and the flags turn out to be the cgroup files you already met.",
}
