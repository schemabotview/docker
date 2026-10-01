import type { Section } from '../types'

export const theFileShape: Section = {
  id: 'the-file-shape',
  title: 'The file shape, and the project',
  scene: 'compose-project',
  slide: `## Everything is namespaced by the **project**

\`docker compose up\` doesn't just start containers. It creates a **project**, and prefixes everything with its name: containers become \`shop-api-1\`, the network \`shop_default\`, volumes \`shop_pgdata\`.

It also creates that network — a user-defined bridge — so **service names resolve** (course 7 §3). That's why \`postgres://db:5432\` works and you never ran \`docker network create\`.

### The project name defaults to the directory
Which is where the surprises come from:

- **Two checkouts in directories both called \`app\`** are one project. Starting the second adopts the first's containers
- **Rename the directory** and it's a new project — the old containers are orphaned, still running, invisible to \`down\`
- **\`down\` from the wrong directory** does nothing, and says nothing

### So pin it
\`name: shop\` at the top of the file, or \`-p shop\`. One line, and the whole class of confusion goes away.`,
  narration:
    "A Compose file has a small number of top-level keys — services, and then usually volumes, networks and secrets — and services is where nearly everything lives. Each service becomes one container, with keys that map almost one-to-one onto things you already know: image or build, ports, environment, volumes, restart, and so on. If you can write a docker run command you can write a service. What's worth spending time on is the part that isn't in the file: the project. When you run docker compose up, Compose creates a project, and everything it makes is namespaced by that project's name. Containers are named project-dash-service-dash-number, so shop-api-1. The network is project underscore default. Volumes are project underscore volumename. And that prefixing is what lets two Compose stacks coexist on one machine without colliding. It also creates that default network for you — a user-defined bridge — and attaches every service to it. Which is why postgres colon slash slash db colon 5432 works in your API's configuration without you ever running docker network create. Course seven, section three, done silently on your behalf. And the service name is the DNS name: db, not the container name shop-db-1, though both resolve. Now, where does the project name come from? By default, the name of the directory the file is in. And that default is the source of most of the genuinely confusing Compose behaviour people hit. Three failure modes. First: two checkouts of the same repository, in two directories both called app — say a main working copy and a second one for a hotfix. Same directory name, so same project name. Run up in the second one and Compose doesn't create a parallel stack; it decides the existing containers belong to this project and reconciles them. You've just recreated your other checkout's containers with the hotfix branch's configuration. Second: rename the directory, or move the project. New directory name, new project. The containers from before still exist, still running, and they belong to a project whose name no longer corresponds to any directory you're in. Compose down can't see them, compose ps doesn't list them, and they sit there holding ports until someone finds them with docker ps. Third, the everyday one: running down from a subdirectory or from the wrong checkout. Compose resolves a project, finds nothing in it, removes nothing, and exits zero. No error, no warning, no output worth reading. You believe you've torn the stack down and it's still up. All three go away with one line: name, colon, and a project name, at the top of the file. Now the project name is a property of the file rather than of where the file happens to sit, it's in version control with everything else, and it's the same for everyone. There's also a dash p flag and a COMPOSE_PROJECT_NAME variable for the cases where you deliberately want several instances — spinning up an isolated stack per CI job, for example, which is a genuinely good use of it. But the default should be pinned. Next: what up does about images, and the flag people forget.",
}
