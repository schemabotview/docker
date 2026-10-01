import type { Section } from '../types'

export const whyCompose: Section = {
  id: 'why-compose',
  title: 'Why Compose',
  scene: 'compose-file',
  slide: `## The run command doesn't scale to a stack

Four services, each with a network, a volume, ports, environment and a restart policy. By hand that's four long \`docker run\` commands in a specific order — which becomes a shell script, which nobody trusts, which drifts from what's actually running.

### What Compose changes
The stack becomes **a file in version control**. Reviewable in a pull request, diffable, and the same on your laptop and in CI.

- **Declarative** — you describe the desired state; \`up\` reconciles toward it
- **The unit is the stack** — one \`up\`, one \`down\`, one \`logs\`
- **It does the fiddly parts** — creates the network, orders startup, prefixes names

### What it is not
**Not an orchestrator.** One host, no scheduling, no rescheduling on failure, no rolling updates. For multi-host that's Kubernetes (course 11 §10).

It is the best tool there is for *development*, and entirely adequate for a single-host deployment.`,
  narration:
    "Seven courses, one container at a time. Now the honest situation: nothing real is one container. A modest web application is an API, a database, a cache and a reverse proxy, and each of those needs a network, possibly a volume, some published ports, a set of environment variables, a restart policy, and a startup order relative to the others. Do that by hand and you're typing four docker run commands, each five lines long, in the right sequence. You do it twice and you write a shell script. And that script is where things start to go wrong, because a script is a sequence of actions rather than a description of a desired state. It doesn't know what's already running. Run it twice and you get name conflicts. Change one service and you either restart everything or you hand-edit. And after a few months the script and the actual running system have quietly diverged, and nobody can tell you what's deployed. Compose replaces the script with a file that describes what should exist. That's the whole idea, and everything good about it follows. Because it's a file, it lives in your repository next to the code. A colleague reviews a change to your stack in a pull request, the same way they review a change to your code. You can diff last month's stack against today's. And the file you run locally is the file CI runs, so the argument about whether it's the same ends. Because it's declarative, up reconciles. It looks at what exists, compares it to what the file says, and changes only what differs. Run up twice and the second one does almost nothing — not an error, not a duplicate, nothing. Change one service's environment and up recreates that one container and leaves the others alone. And because the unit is the stack, the commands operate on all of it. One up starts everything in dependency order. One down stops and removes it. Logs, with no arguments, interleaves output from every service with the service name in the margin, which is the single most useful debugging view in a multi-service system. It also does several fiddly things you'd otherwise have to remember. It creates a network for the project, so service names resolve — course seven, section three, done for you. It prefixes every container, network and volume with the project name, so two projects on one machine don't collide. And it orders startup according to the dependencies you declare. Now what it is not, because this matters for how far you take it. Compose is not an orchestrator. It runs on one host. There's no scheduler, so nothing places containers across machines; nothing reschedules a container when a host dies; there's no rolling update primitive, no built-in load balancing across replicas, and no secrets management beyond reading a file. If you need those, you need Kubernetes, and we'll talk about that seam in course eleven. What Compose is, is the best development environment tool there is, and — with a bit of care — entirely adequate for deploying a small system to a single server. Plenty of production systems run on exactly this, and they're not doing anything wrong. Next: the thing the file used to start with, and why it doesn't any more.",
}
