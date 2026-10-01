import type { Section } from '../types'

export const healthcheck: Section = {
  id: 'healthcheck',
  title: 'HEALTHCHECK',
  scene: 'health-states',
  slide: `## Docker marks it unhealthy — and does **nothing**

No restart. No removal from anything. Plain Docker has no scheduler, so there is nothing to act. \`docker ps\` simply shows \`(unhealthy)\`.

Restart policies watch **exits**, not health. An unhealthy container that is still running stays running.

### So why write one
Because other things read the state:
- **Compose** — \`depends_on: condition: service_healthy\` (course 8 §6)
- **Orchestrators** — a rolling update waits for healthy before moving on
- **Your scripts** — \`docker inspect --format '{{.State.Health.Status}}'\`

\`\`\`docker
HEALTHCHECK --interval=30s --timeout=3s \\
  --start-period=40s --retries=3 \\
  CMD curl -fsS http://localhost:8080/healthz || exit 1
\`\`\`

### \`--start-period\` is the one people omit
Without it a slow-starting app is marked unhealthy while it's still booting — and in Compose, everything waiting on it gives up.`,
  narration:
    "HEALTHCHECK runs a command inside the container on a schedule, and the container gets a health state: starting, healthy or unhealthy. Exit zero means healthy; anything else is a failure, and after a configured number of consecutive failures the state flips to unhealthy. Now the part that surprises people, and it's worth stating before the syntax. When a container becomes unhealthy, Docker does nothing about it. It doesn't restart it. It doesn't stop it. It doesn't take it out of anything, because plain Docker has nothing to take it out of — there's no load balancer, no scheduler, no service registry. The container keeps running, keeps accepting connections, keeps failing. Docker records the state and that is the entire extent of its involvement. And it's worth being explicit about a near-miss here: restart policies do not help. From course two, a restart policy watches for the main process exiting. An unhealthy container hasn't exited — it's alive and broken, which is precisely the case a restart policy cannot see. So why write one at all? Because the state is for other software to read, and quite a lot of software reads it. Compose is the big one: depends_on with condition service_healthy means Compose waits for your database to report healthy before starting the application that needs it, and that single line removes an entire category of startup race conditions. That's course eight. Orchestrators use it for rolling updates — a new replica has to report healthy before the old one is retired, which is what makes a deploy safe. And your own scripts can read it with docker inspect and the State dot Health dot Status template, which is how you write a deploy script that waits properly instead of sleeping thirty seconds and hoping. Now the syntax, and four options. Interval is how often to check — thirty seconds is a reasonable default; don't make it one second, because the check runs a process inside your container every time. Timeout is how long a single check may take before it counts as a failure; keep it short, because a health check that hangs is itself a symptom. Retries is how many consecutive failures before the state flips, and three is a good number — it absorbs a single blip without hiding a real outage. And start-period is the one people leave out and then regret. It's a grace window at container start during which failures don't count toward the retries. Without it, an application that takes forty seconds to warm up — a JVM, a service that runs migrations, anything that loads a model — is marked unhealthy while it's still perfectly normally starting. On your laptop that's a cosmetic annoyance. In Compose, everything with depends_on service_healthy gives up on it, and the stack never comes up. Two notes on the command itself. Make it check something real. Curl against a slash healthz endpoint that actually exercises the application — that it can reach its database, say — not one that returns two hundred from a static handler, which only tells you the process hasn't crashed, which you already knew. And the command has to exist inside the container: curl is not in a slim image by default, and it is definitely not in distroless. Either install it deliberately, or use whatever the runtime provides — a tiny Node or Python one-liner, or a static health binary you copy in. Next: the two instructions that decide what actually runs.",
}
