import type { Section } from '../types'

export const theRunAnatomy: Section = {
  id: 'the-run-anatomy',
  title: 'The anatomy of docker run',
  scene: 'run-anatomy',
  slide: `## The image name is where Docker stops reading

\`\`\`bash
docker run [FLAGS] IMAGE [ARGV…]
\`\`\`

Everything **before** the image configures the container and is read by Docker. Everything **after** it is \`argv\` for your process, and Docker never looks at it.

### The mistake that costs an afternoon
\`docker run alpine -it\` is not corrected for you. It runs \`alpine\` with \`argv ["-it"]\` → \`sh: -it: not found\`. The flag has to come **first**.

### The everyday flags
- \`-d\` detach · \`--rm\` delete on exit · \`--name\` a stable name
- \`-p 8080:80\` publish **HOST:CONTAINER** · \`-e VAR=v\` one env var
- \`-v\`, \`--memory\`, \`--restart\` — each gets its own section

### Two commands hiding inside
\`run\` = **create** + **start**. They exist separately, and \`docker create\` is how you configure a container without running it yet.`,
  narration:
    "Course one was about what a container is. This course is about driving one, and it starts with the grammar of the command you will type more than any other. Docker run has a shape: the word run, then flags, then an image name, then optional arguments. And the thing to hold onto is that the image name is a boundary. Everything before it is read by Docker and configures the container — how it attaches to your terminal, what ports it publishes, what memory ceiling it gets. Everything after the image name is not read by Docker at all. It is argv, handed straight to the process inside as its command-line arguments. Look at the example on the left. Docker run, dash d to detach, dash dash name api, dash p 8080 colon 80 to publish a port, dash e LOG equals debug to set an environment variable, then nginx — the image — and then dash g daemon off semicolon, which is an argument for nginx itself. Docker configured five things and then stopped reading. Now the mistake, and it is worth stating plainly because everyone makes it once and it is genuinely confusing when it happens. Docker run alpine dash i t. That looks like it should give you an interactive shell. It does not. The image name came first, so dash i t is argv: Docker starts alpine and passes it the string dash i t as an argument, and you get an error from the shell inside saying it cannot find a command called dash i t. Nothing warns you. Docker did exactly what you asked; you asked for the wrong thing. The flag has to go before the image: docker run dash i t alpine. Then the flags themselves. Dash d detaches — it prints the container id and gives you your prompt back. Dash dash rm deletes the container when it exits, which is how you stop accumulating hundreds of dead ones. Dash dash name gives it a stable name, and without it Docker invents one from an adjective and a scientist, which is charming exactly once and then becomes an obstacle when you are trying to write a script. Dash p publishes a port and the order is host colon container, which is the opposite of what half the people who type it expect — we spend a whole section on that in the networking course. Dash e sets one environment variable. And then dash v for volumes, dash dash memory for limits, dash dash restart for restart policy, each of which has a section of its own, here or later. One last thing, and it explains a command you will see and wonder about. Docker run is not a primitive. It is two operations: create, which writes the container's specification and allocates its writable layer without starting anything, and start, which actually runs it. They exist as separate commands, and docker create is genuinely useful when you want to configure a container fully, look at it, and only then decide to start it. Next: what dash d and dash i t are really doing to your terminal.",
}
