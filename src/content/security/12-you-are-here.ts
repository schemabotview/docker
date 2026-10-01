import type { Section } from '../types'

export const youAreHere: Section = {
  id: 'you-are-here',
  title: 'You are here',
  scene: 'hardened-run',
  slide: `## Every dial, on one container

The scene is the whole course as a single \`run\` command — and none of those lines is difficult.

- **§1** — the kernel is the wall, and the wall is shared. Most incidents are grants, not escapes
- **§2–4** — uid 0 inside **is** uid 0 outside. \`USER 10001\` is the highest-value line in the subject
- **§3** — the socket **is** root. So is \`--privileged\`, so is \`-v /:/host\`, so is the \`docker\` group
- **§5** — root is ~40 privileges; Docker drops most already. \`--cap-drop=ALL\`, then add back nothing
- **§6** — \`no-new-privileges\` defeats setuid escalation; \`--read-only\` + tmpfs removes persistence
- **§7–8** — remap maps around a root daemon; **rootless removes it**
- **§9–10** — seccomp and MAC are **already on**. Don't turn them off
- **§11** — a file, not an environment variable

### Where the effort goes
\`USER\` + \`--cap-drop=ALL\` + \`no-new-privileges\` + \`--read-only\`. Four lines, most of the benefit — before anything exotic.`,
  narration:
    "Let's close the loop, and the scene is the payoff: every dial in this course set on one container, as a command you could paste. Look at how ordinary it is. Section one gave the model. A container is a process the kernel is confining, so the kernel is the only wall and it's the wall you're sharing. And the way things actually go wrong is, in order: you handed the host over, then uid zero plus an ordinary application bug, then — much more rarely — a real kernel escape. That ordering matters because it tells you where to spend effort. Sections two, three and four were the biggest single item. Root inside a container is the host's root, because the user namespace is off by default. So a container with no USER line is running as root, holding every default capability, able to rewrite any writable bind mount. USER with a numeric uid, late in the Dockerfile, with COPY dash dash chown to fix ownership, is the highest-value line in this entire subject. And the grants: the Docker socket is root on the host, one API call away; so is dash dash privileged; so is bind-mounting slash; and so, quietly, is membership of the docker group. If something genuinely needs the API, put a socket proxy in front of it that allows only what it needs. Section five: root isn't one thing, it's about forty capabilities, and Docker already drops the dangerous ones — which is why root in a container is weaker than root on the host before you configure anything. Drop all and add back what breaks, and for a typical service that's nothing. Section six was two flags that cost nothing. No-new-privileges closes the setuid escalation path at the kernel level. Read-only, paired with a tmpfs, removes an attacker's ability to drop a binary or persist anything — and it doubles as a design test for where your application is secretly keeping state. Sections seven and eight were the two ways to stop being root at all. Userns-remap maps around a root daemon and has real migration pain with existing volumes. Rootless removes the root daemon entirely, which is the stronger answer, at the cost of privileged ports, cgroup limits on older hosts, overlay networks and some network performance. Sections nine and ten were the two layers already protecting you that you didn't know about. Docker's default seccomp profile blocks forty-four syscalls including mount, reboot and module loading, and it has silently stopped real escapes. The default AppArmor or SELinux policy is doing work too. The instruction for both is the same: don't turn them off, and note that privileged turns off seccomp silently. Section eleven was secrets: baked in, in the build history, and in the environment all leak, each somewhere different, and the shape that doesn't is a file — with the underscore-FILE convention in official images, and a real secret manager as the next step up. And here's where the effort actually goes. USER, cap-drop all, no-new-privileges, and read-only with a tmpfs. Four changes, all of them one line, and together they cover most of the realistic risk. Do those everywhere before you consider rootless, custom seccomp profiles, or anything else in this course. The exotic work is for specific situations; the four lines are for everything. So: ten courses. You can build, run, store, connect, compose, distribute and harden. What you haven't done is operate — the daemon itself, its storage and logging drivers, where the disk goes, what to do when it breaks, and how any of this reaches production. Course eleven is that.",
}
