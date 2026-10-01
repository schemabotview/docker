import type { Section } from '../types'

export const environment: Section = {
  id: 'environment',
  title: 'Environment variables',
  scene: 'env-precedence',
  slide: `## Four sources, and the last one wins

- **\`ENV\` in the image** — baked at build time. The floor: always present
- **\`--env-file .env\`** — overrides the image
- **\`-e LOG=debug\`** — overrides both
- **\`-e LOG\`** with **no value** — takes it from **your shell**

### \`--env-file\` is not a shell script
Docker parses it itself. \`KEY=value\`, one per line. **Quotes become part of the value**, \`$OTHER\` is not expanded, and there is no \`export\`. Copying a working \`.env\` from a shell context is where the surprises come from.

### The passthrough trap
\`-e LOG\` with no \`=\` works on your laptop, where \`LOG\` happens to be set, and silently becomes **empty string** in CI, where it isn't. No error either way.

### Resolved once, at create time
Changing a variable means **recreating** the container. And \`docker inspect\` shows every value in plain text — so **no secrets here** (security course).`,
  narration:
    "Environment variables are how a container is configured, because the image is immutable and the same image has to run in dev, staging and production. So this is a mechanism you will use constantly, and it has an ordering rule that is worth knowing exactly rather than approximately. There are four places a variable can come from, and they stack. Read the diagram from the bottom. The floor is ENV in the Dockerfile, baked into the image at build time. Those are always present, and they are the defaults the image author chose — PATH, the language runtime's settings, whatever the application needs to have some value for. Above that, dash dash env-file, which reads a file of key-equals-value lines and sets all of them. Above that, dash e on the command line, which is explicit and beats both. And at the top, a special form: dash e with just a name and no equals sign. That pulls the value out of the shell you are typing in, and passes it through. Same name set twice, higher wins. Now two things about that file, because it does not behave the way people assume. Dash dash env-file is parsed by Docker, not by a shell. That means quotes are not stripped — if you write KEY equals quote value quote, the quotes become part of the value. Dollar-sign OTHER is not expanded; it is passed through literally as the characters dollar O T H E R. There is no export keyword and no line continuation. So a file that works perfectly when you source it in bash can behave quite differently when you hand it to dash dash env-file, and the difference is silent. Then the passthrough form, which is the one I want you to be suspicious of. Dash e LOG, no equals. On your laptop, LOG is set in your shell, so the container gets the right value and everything works. In CI, LOG was never set, so Docker passes the variable through as an empty string. Not unset — empty. Your application checks whether the variable exists, finds that it does, reads an empty string, and takes some branch nobody intended. There is no error, no warning, and the behaviour differs between two machines that ran the identical command. It is a genuinely useful form when you mean it, and a trap when you have forgotten you used it. Two more properties. The environment is resolved once, when the container is created — not read continuously. So changing a variable is not a live operation: you have to remove the container and run a new one. That is a feature, not a limitation. It is the same discipline as an immutable image, applied to configuration. And finally, everything here is visible. Docker inspect prints Config dot Env in plain text. Anyone who can talk to the Docker socket can read every value, and those values end up in your shell history and in your CI logs. So environment variables are the right place for configuration and the wrong place for secrets — a database password in dash e is a password you have published to several places you were not thinking about. What to do instead is a whole section in the security course. Next: where your container's output actually goes.",
}
