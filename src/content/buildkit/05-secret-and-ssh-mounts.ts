import type { Section } from '../types'

export const secretAndSshMounts: Section = {
  id: 'secret-and-ssh-mounts',
  title: 'Secret and ssh mounts',
  scene: 'mount-syntax',
  slide: `## The actual answer to the \`ARG\` problem

\`\`\`docker
RUN --mount=type=secret,id=npmtoken \\
    NPM_TOKEN=$(cat /run/secrets/npmtoken) npm ci
\`\`\`
\`\`\`bash
docker build --secret id=npmtoken,env=NPM_TOKEN .
\`\`\`

The secret is a **file**, present for exactly that instruction, recorded **nowhere**. Not in a layer, not in the config, not in \`docker history\`.

Compare course 4 §7: \`ARG NPM_TOKEN\` is in the history in plain text, forever, for anyone who can pull.

### For a private git dependency
\`--mount=type=ssh\` forwards your **agent socket** — so the key is used and never copied in. \`docker build --ssh default .\`

### Two things to get right
- The \`id\` must match between the Dockerfile and the CLI. Mismatched, the file just isn't there
- Don't \`echo $SECRET\` to debug. BuildKit doesn't log the mount, but it **does** log your output`,
  narration:
    "Course four left a problem open. You need a credential during the build — a token for a private npm registry, an SSH key for a private git dependency — and every obvious way of providing it leaks. ARG puts it in the build history in plain text. ENV puts it in the image config. COPYing a key file in and deleting it leaves it in the earlier layer. A multi-stage build helps only if you're careful in a way that is easy to get wrong. All four are real mistakes people make, and all four publish the credential to anyone who can pull the image. Here is the actual answer, and it needs BuildKit because it is not expressible in a commit-per-step model. RUN dash dash mount equals type equals secret, id equals npmtoken. BuildKit takes the secret, makes it available as a file at slash run slash secrets slash and the id, for the duration of that one instruction, and then removes it. The file is not in the layer that instruction produces. The mount is not recorded in the image config. Docker history shows the RUN line with the mount flag on it, and no value anywhere. There is nothing to leak because nothing was written down. On the command line you supply it with dash dash secret. Two forms: id equals npmtoken comma env equals NPM_TOKEN takes it from an environment variable, which is what you want in CI where the secret comes from the CI system's secret store. Or id equals npmtoken comma src equals a path, which reads a file, which is what you want locally. Inside the RUN, you read the file. The pattern in the transcript assigns it to a variable for just that command — NPM_TOKEN equals dollar open-paren cat the file close-paren, then the command — so the value is in the process environment of that one invocation and nowhere else. For git over SSH there's a nicer variant. Dash dash mount equals type equals ssh forwards your local SSH agent's socket into the build, so git inside the container can authenticate using your agent without the private key ever being copied anywhere. On the command line it's dash dash ssh default. That is strictly better than any arrangement involving the key itself, because the key never leaves your machine — only the ability to ask the agent to sign things, for the length of one build step. Two things to get right. The id has to match between the Dockerfile and the command line. If they don't match, there is no error saying so — the mount simply isn't there, your cat fails or returns nothing, and you get an authentication failure from npm that looks like a wrong token rather than a missing one. Check the id first when a secret mount seems not to work. And second: do not echo the secret to debug it. BuildKit is careful not to log the mount, but it has no idea what your command prints. Echo the token and it goes into the build output, which goes into your CI logs, which are usually readable by more people than the secret store was. If you must check, print its length. Finally, a piece of honest advice. If you find yourself needing several secrets at build time, that is often a signal that too much is happening during the build. Fetching private dependencies is legitimate. Contacting production services, or baking in a runtime credential, is not — runtime configuration belongs at runtime, where course two's environment section put it. Next: the CLI that drives all of this, and the file that stops you mistyping it.",
}
