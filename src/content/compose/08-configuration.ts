import type { Section } from '../types'

export const configuration: Section = {
  id: 'configuration',
  title: 'Configuration',
  scene: 'compose-config',
  slide: `## Three different things are called "env"

- **\`.env\` at the top level** — read by **Compose itself**, to substitute \`\${VARS}\` in the YAML. It is **not** passed to containers
- **\`env_file:\` on a service** — read into **that container's** environment. Usually what you meant
- **\`environment:\` on a service** — inline, and it beats \`env_file\`

### The failure
\`DATABASE_URL\` in \`.env\`, and the service never sees it: \`.env\` substituted nothing (no \`\${DATABASE_URL}\` in the YAML) *and* set nothing. No error, on either count.

### Settle it with one command
\`\`\`bash
docker compose config
\`\`\`
Prints the **fully resolved** file — every substitution done, every override merged. Always faster than reasoning about it.

### Secrets
\`secrets:\` mounts a **file** at \`/run/secrets/<name>\` — not a variable \`inspect\` can print (course 2 §7).`,
  narration:
    "Compose has three separate mechanisms that people all refer to as env, and conflating them produces a failure with no error message at all. Let's separate them properly. The first is a file called dot env in the same directory as your Compose file. This file is read by Compose itself, before it parses anything, and its values are used for variable substitution in the YAML. So if your Compose file says image colon postgres colon dollar-brace-PG_VERSION, Compose looks in dot env for PG_VERSION and substitutes it. That is the entirety of what dot env does. It does not set environment variables inside any container. Ever. The second is env_file on a service, which takes a path to a file of key-equals-value lines, and puts all of them into that container's environment. This is almost always what people mean when they say put it in the env file. The third is environment on a service, an inline map or list in the YAML, which sets variables directly, and which takes precedence over env_file for the same key. Now the failure. Someone has a DATABASE_URL. They put it in dot env, because that's the file called env. They run up. The service doesn't see it. And there is no error, because two separate non-events happened. Compose read dot env, looked for occurrences of dollar-brace-DATABASE_URL in the YAML to substitute, found none, and did nothing — correctly, silently. And the container's environment was built from the service's environment and env_file keys, neither of which mentioned it. Both mechanisms behaved exactly as specified. Nothing is wrong, and nothing works. It's worth knowing the two legitimate patterns so you can pick one deliberately. Pattern one: put values in dot env and reference them explicitly in the YAML with dollar-brace substitution, which keeps the Compose file readable and the values out of git. Pattern two: point env_file at a file and let the service read all of it. Both are fine. Mixing them up is what hurts. And there's a subtlety even within the first: substitution has defaults, dollar-brace-VAR-colon-dash-default, which is well worth using for anything optional, and a required form with question mark that fails the command with a message instead of silently substituting an empty string. Use the required form for anything that must be set. Now the command that ends all of this arguing: docker compose config. It prints the fully resolved file — every variable substituted, every override merged, every default filled in — as Compose actually understands it. When you're not sure whether a value made it, don't reason about it, print it. That one command answers more Compose questions than any other, and hardly anyone knows it's there. Finally, secrets, which is the better answer for anything sensitive. A top-level secrets block names a source file, and a service lists which secrets it wants. Compose mounts each one as a file at slash run slash secrets slash the name. Why bother, when environment variables work? Because course two, section seven: environment variables are visible in docker inspect, in plain text, to anyone who can reach the Docker socket, and they leak into child processes and crash dumps. A file is readable only by a process that opens it. Many images support this directly — Postgres takes POSTGRES_PASSWORD_FILE as an alternative to POSTGRES_PASSWORD, precisely for this. Next: one file, several environments.",
}
