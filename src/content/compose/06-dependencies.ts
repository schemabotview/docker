import type { Section } from '../types'

export const dependencies: Section = {
  id: 'dependencies',
  title: 'Dependencies and healthchecks',
  scene: 'depends-health',
  slide: `## \`depends_on\` alone orders **starts**, not readiness

Compose starts \`db\`'s container, then immediately starts \`api\` — because "started" is all it waited for. Postgres is still initialising. The API's first connection is refused and it exits.

\`\`\`yaml
depends_on:
  db:
    condition: service_healthy
\`\`\`

Now Compose **waits** for the health state, which means the service needs a real \`HEALTHCHECK\` (course 4 §9).

### Two things that still bite
- **A fake healthcheck.** \`pg_isready -q\` proves something. A check that returns 0 unconditionally passes instantly and proves nothing
- **No \`start_period\`.** A slow starter goes \`unhealthy\` before it's up, and everything waiting gives up

### Retry anyway
Startup ordering is a convenience, not a guarantee. The database can restart at 3am while your API is running. An app that can't reconnect will fall over then instead.`,
  narration:
    "This is the most common Compose bug, and it's a misunderstanding rather than a mistake. You write depends_on with a list — api depends on db — and it looks like it says start the database, wait for it, then start the API. It doesn't. It says start the database's container before the API's container. And container started means the container exists and its main process has been launched. That's it. Postgres, at that moment, is perhaps two hundred milliseconds into an initialisation sequence that will take several seconds: reading configuration, checking the data directory, possibly running first-time setup, and finally binding its port. Compose has already moved on and started your API. Your API connects, gets connection refused, and — if it's written the way most applications are — logs a fatal error and exits. Compose's restart policy may bring it back, and by then the database may be ready, so the stack comes up after a few seconds of alarming errors. Or it doesn't, and you have a stack that fails on a cold start and works when you run up a second time. Which is worse, because it works on your machine, where everything was already warm. The fix is the long form of depends_on. Instead of a list, a map: the service name, then condition, service_healthy. Now Compose actually waits — it polls the dependency's health state and doesn't start the dependent service until it reports healthy. There are two other conditions: service_started, which is the default behaviour spelled out, and service_completed_successfully, which is for one-shot services like a migration job that must finish before the app starts. That last one is genuinely useful and underused. But service_healthy needs a health state to wait for, which means the dependency needs a HEALTHCHECK — course four, section nine. Either the image ships one, or you add a healthcheck block to the service in your Compose file. And now two things that still bite. The first is a healthcheck that doesn't check anything. Pg_isready against the actual database proves the database is accepting connections. A check that runs true, or curls a static endpoint that returns two hundred from a handler with no dependencies, passes immediately and proves only that the process started — which is what you already knew, so you've reimplemented service_started with more YAML. Make the check exercise the thing the dependent service needs. The second is start_period. Without it, failures count from the first probe, so an application that takes forty seconds to warm up accumulates failures and is marked unhealthy while it's still perfectly normally starting. Then everything with a service_healthy condition on it gives up, and your stack never comes up at all. On your laptop this is where you discover it; in CI, where everything is colder, it's where it becomes flaky. And the closing point, which is the important one. Startup ordering is a convenience for the first thirty seconds of a stack's life. It is not a guarantee about anything afterwards. Your database will restart while your API is running — a crash, an upgrade, a host reboot. An application that can only connect at startup and cannot reconnect will fall over then, and no amount of depends_on helps, because nothing is starting. So: use the condition to make development pleasant, and write your application to retry its connections with backoff anyway. The retry logic is the thing that actually makes it robust; the ordering just means you don't watch it retry every morning. Next: networks and volumes, declared.",
}
