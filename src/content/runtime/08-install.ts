import type { Section } from '../types'

export const install: Section = {
  id: 'install',
  title: 'Install, and which engine you reached',
  scene: 'install-session',
  slide: `## Two versions and a context

### What to install
- **Linux** — Docker **Engine** from Docker's repo. Then \`usermod -aG docker $USER\` and log out, or every command needs \`sudo\`
- **macOS / Windows** — Docker **Desktop**: the Engine *inside a Linux VM*, plus a GUI. The VM is why bind mounts are slower there (§2)

### \`docker version\` prints two blocks, and that's the point
**Client** is the binary you ran. **Server** is the daemon that answered — possibly on another machine. It also lists \`containerd\` and \`runc\`: §6's chain, with version numbers.

### Which machine am I on?
\`docker context ls\` shows every endpoint the CLI can talk to; the \`*\` is the active one. Because the CLI is just an HTTP client, \`docker context use prod-eu\` sends the **same commands to a different host**.

Then \`docker info\` — and \`Storage Driver: overlay2\` is §5, named.`,
  narration:
    "Installing Docker is not interesting. What is interesting is the four commands that prove what you installed and, more importantly, which of the five programs from the last section you are actually talking to — because you can be talking to a daemon on a completely different computer and not realise it. First, what to install. On Linux, you want Docker Engine, from Docker's own apt or yum repository. The convenience script shown here does that for you. Your distribution's packaged docker dot io is usually old enough to be missing features we'll use, so prefer the upstream repo. After installing, add yourself to the docker group and log out and back in — otherwise every command needs sudo, because the socket is root-owned. And do notice what that group membership means: it is root-equivalent, for exactly the reason we covered in the last section. On macOS or Windows, you want Docker Desktop, and be clear about what it is. It is Docker Engine running inside a Linux virtual machine that Desktop manages for you, plus a GUI and some integration. This is not a criticism — it's necessary, because Linux containers need a Linux kernel. But it explains things you will otherwise find baffling, especially that bind-mounted files are noticeably slower on a Mac, because reads are crossing a VM boundary. Now the commands. Docker version prints two blocks, and that is deliberate. The Client block is the binary you just ran. The Server block is the daemon that answered your request. Two versions, because they are two programs, and they can differ — and if the Server block is missing entirely, your problem is not Docker's version, it's that nothing answered. Look further down the Server block and you'll see containerd and runc listed with their own versions: that is section six's chain, printing itself out. Then the command almost nobody learns early enough, and should: docker context ls. A context is a named endpoint. Default points at the local Unix socket. But in this transcript there's a second one called prod-eu pointing over SSH at a staging box. The asterisk marks the active one. And now docker context use prod-eu, and every subsequent docker command — ps, run, rm — goes to that machine instead. Nothing about your typing changes. This is the direct consequence of the CLI being an HTTP client: the same commands, aimed somewhere else. It is genuinely useful, and it is also how people delete things on the wrong host, so when a result surprises you, docker context ls is a good early question. Finally docker info, which dumps the daemon's whole configuration, and grep for storage driver. It says overlay2. That is section five — the union filesystem — named in configuration. Everything we've discussed as theory is now visible as output. So let's run something.",
}
