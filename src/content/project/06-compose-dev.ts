import type { Section } from '../types'

export const composeDev: Section = {
  id: 'compose-dev',
  title: 'Compose for development',
  scene: 'compose-project',
  slide: `## One \`up\`, and the ordering is real

\`name: shop\` pinned (course 8 §3). Two networks — \`front\` and \`back\` — so **Caddy has no route to Postgres** (course 7 §10). Six lines for a real boundary.

### The dependency that actually waits
\`depends_on: db: condition: service_healthy\`, and Postgres gets a \`healthcheck\` using \`pg_isready\` with a \`start_period\`. Plain \`depends_on\` would order the *starts* and the API would still hit a database that isn't listening (course 8 §6).

**And the API retries anyway** — because the database can restart at 3am, when nothing is starting.

### The dev loop
\`develop.watch\`: \`sync\` for \`./src\`, \`rebuild\` for \`package.json\`, \`sync+restart\` for \`./config\` (course 8 §10). No bind mount in the file, so nothing dev-shaped can leak into a production run.

### And the password
A \`secrets:\` file and \`POSTGRES_PASSWORD_FILE\` — not an environment variable \`inspect\` would print (course 10 §11).`,
  narration:
    "The stack as a unit. And the interesting thing about this section is how little is new — it's course eight applied, with the decisions made deliberately rather than by default. The project name is pinned with a name line at the top, so it doesn't depend on what the directory happens to be called, and two checkouts can't adopt each other's containers. Two networks, front and back, rather than the single default one. Caddy is on front. Postgres and Redis are on back. The API is on both. Which means the internet-facing proxy has no route to the database at all — not a rule denying it, no route, no name resolution. Six lines of YAML for a real security boundary, and it's the kind of thing that's tedious enough by hand that people skip it and free enough in Compose that there's no excuse. The dependency ordering is the long form: depends_on with condition service_healthy, not the bare list. And that needs Postgres to have a healthcheck, which we add with pg_isready and a start period. With the bare list, Compose would start the database container and then immediately start the API, and the API would connect to a Postgres that's still initialising, get connection refused, and exit — course eight, section six. With the condition, it waits. And the API retries its connection with backoff regardless, because startup ordering only covers the first thirty seconds of the stack's life, and the database will restart at some point when nothing is starting up. Both, not either. The dev loop is compose watch rather than a bind mount. Source files sync. A change to package dot json triggers a rebuild, because a sync would be pointless — the dependencies live in the image. Config files sync and restart, because the app reads them at startup. Course eight, section ten. And the property I like most: there is no bind mount anywhere in this Compose file. The development ergonomics live in a develop block that only the watch command reads, so nothing dev-shaped is sitting in the file waiting to be accidentally run in production. And the Postgres password is a secret — a top-level secrets block naming a file, and Postgres configured with POSTGRES_PASSWORD_FILE rather than POSTGRES_PASSWORD. That's course ten, section eleven, and it works because the official image already supports the underscore-FILE convention. The value is never in the container's environment, so docker inspect doesn't print it and it isn't inherited by child processes. One line different from the obvious version, and it closes a real leak. One thing deliberately absent: Postgres publishes no ports. Nothing outside Docker needs to reach it, so nothing does. Course seven, section seven. Next: the data.",
}
