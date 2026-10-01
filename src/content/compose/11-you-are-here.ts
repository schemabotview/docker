import type { Section } from '../types'

export const youAreHere: Section = {
  id: 'you-are-here',
  title: 'You are here',
  scene: 'compose-project',
  slide: `## Everything hangs off the project

The diagram is §3's. \`up\` creates a **project**, a network with DNS, and prefixed names — and most Compose surprises are that scope.

- **§2** — \`docker compose\` with a space; delete \`version:\`
- **§4** — \`up\` does **not** rebuild. \`--build\`, or better, \`watch\`
- **§5** — \`down\` removes; \`down -v\` **deletes your data**. \`run\` without \`--rm\` litters
- **§6** — \`depends_on\` alone orders *starts*. \`condition: service_healthy\` orders *readiness* — and retry anyway
- **§7** — two networks is a real boundary: the proxy has **no route** to the database
- **§8** — \`.env\` substitutes into the YAML; \`env_file\` reaches the container. Not the same thing
- **§9** — maps merge, **lists replace**
- **§10** — \`watch\`: sync, rebuild, or sync+restart, per path

### When in doubt
\`docker compose config\` prints the resolved truth. It answers more questions than any other command here.

### Next
Course 9: how an image gets **to** the registry, and back.`,
  narration:
    "Let's close the loop. The diagram is section three's, because the project is the thing everything hangs off. Docker compose up doesn't only start containers — it creates a project, names everything after it, creates a user-defined bridge network so service names resolve, and attaches everything to it. And the project name defaults to the directory, which is why two checkouts with the same directory name are one project, why renaming a directory orphans your containers, and why down from the wrong place silently does nothing. Pin it with a name line at the top of the file and that whole family of confusion disappears. Section two was the naming: docker compose with a space, not the hyphenated v1 that reached end of life in 2023 — and if a tutorial uses the hyphen, date the rest of its advice accordingly. And delete the version line; the schema is the versionless Compose Specification now. Section four was the behaviour that confuses more people than anything else: up does not rebuild. It finds an image with the expected name and uses it, however stale. Dash dash build fixes it, and watch is the better answer for development. Section five was the six commands, and the two distinctions that cost you. Down removes containers where stop only stops them, and down dash v additionally deletes your volumes with no confirmation — that's the data-deleting command. And run creates a new container where exec enters the running one, so run without dash dash rm leaves a stopped container every single time. Section six was the most common bug in the whole course. Plain depends_on orders container starts, not readiness, so your API connects to a Postgres that hasn't finished initialising and exits. Condition service_healthy makes Compose actually wait, which needs a healthcheck that checks something real and a start_period so a slow starter isn't marked unhealthy while it's still booting. And retry in your application anyway, because the database can restart at three in the morning when nothing is starting up. Section seven was networks and volumes declared at the top and referenced by services — and the shape worth knowing is two networks, where the proxy genuinely has no route to the database. Six lines for a real boundary. Section eight was the three things called env: dot env substitutes into the YAML and never reaches a container, env_file sets the container's environment, environment does it inline and wins. Getting those confused produces a variable that's simply absent with no error anywhere. And secrets mount a file rather than exposing a value to docker inspect. Section nine was profiles for which services exist and override files for how they're configured, plus the merge rule everybody meets once: maps merge key by key, lists replace wholesale. And section ten was compose watch, which picks sync, rebuild, or sync-and-restart per path, and keeps the development ergonomics out of the file that describes the real stack. If you keep one command from this course, keep docker compose config. It prints the fully resolved file, and it answers more questions than anything else here. So: you can describe a whole stack in one reviewable file, bring it up correctly, and develop against it. Everything in it has been either built locally or pulled from a registry that we have never actually examined. Course nine is that registry: how an image gets there, what the protocol looks like, how authentication works, and what it means to pin something by digest when the thing on the other end is an HTTP API.",
}
