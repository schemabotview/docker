import type { Section } from '../types'

export const composeV2AndTheSpec: Section = {
  id: 'compose-v2-and-the-spec',
  title: 'Compose v2 and the spec',
  scene: 'compose-file',
  slide: `## \`docker compose\`, not \`docker-compose\`

A **space**, not a hyphen. V1 was a separate Python program; v2 is a Go plugin to the Docker CLI. V1 reached end of life in 2023 — if a tutorial uses the hyphen, it predates that and probably the rest of its advice too.

### Delete your \`version:\` line
\`version: "3.8"\` at the top is **obsolete**. Modern Compose ignores it and warns. The schema is now the **Compose Specification**, which is versionless and feature-detected.

### \`compose.yaml\` is the modern filename
\`docker-compose.yml\` still works and always will. New projects should use \`compose.yaml\`.

### The spec isn't Docker's alone
It's an open specification with other implementations. Which is the same story as OCI in course 1 §7 — what you're learning is an interface, not one vendor's product.`,
  narration:
    "Two naming things that will save you from following bad advice, and one line you should delete from your files. First: the command is docker space compose. Not docker-hyphen-compose. Those are different programs. Docker-compose with a hyphen is version one, a separate Python application you installed independently. Docker compose with a space is version two, a Go plugin that ships with the Docker CLI and is what you already have. V1 reached end of life in 2023 and is no longer maintained. This matters beyond pedantry, because it's a dating signal. If a tutorial tells you to pip install docker-compose, it was written before mid-2020, and everything else in it — the networking advice, the security advice, the image recommendations — is from that era too. The hyphen is a useful smell test for the age of anything you're reading. There's a compatibility shim that makes the hyphenated form work by forwarding to the plugin, so old scripts don't break, but write new things with the space. Second: delete the version line. Every Compose file written before about 2022 starts with version, colon, quote three point eight. That number was a schema version, and it genuinely mattered in the version one era — different schema versions enabled different features, and getting it wrong produced baffling errors. It is now obsolete. Modern Compose ignores the field entirely and prints a warning telling you so. The reason is that the schema stopped being versioned. What defines a Compose file now is the Compose Specification, which is versionless: features are detected rather than declared, and the implementation supports what it supports. So the line does nothing except generate a warning and make your file look older than it is. Delete it. Third, the filename. Compose looks for compose dot yaml first, then compose dot yml, then docker-compose dot yaml, then docker-compose dot yml. All four work and will continue to. Compose dot yaml is the modern spelling and what new projects should use — it's shorter, and the docker- prefix is redundant given the command you type. And a point that matters more than the naming, which is what the Compose Specification actually is. It's an open specification, not Docker's private schema, and it has other implementations — Podman's compose support, and various cloud services that take a Compose file and deploy it to their own infrastructure. Which is the same story as OCI in course one: the thing you're learning is an interface with several implementations, not one vendor's product. Your Compose file is a portable description of a stack, and that portability is real. Next: what up actually creates, which is more than the containers.",
}
