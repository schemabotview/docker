import type { Section } from '../types'

export const theThreatModel: Section = {
  id: 'the-threat-model',
  title: 'The threat model',
  scene: 'threat-model',
  slide: `## The kernel is the wall, and the wall is shared

A container is a process the kernel is confining. So the kernel is the **only** thing between a compromised container and your host — and it's the same kernel the container is making syscalls to.

That's the whole asymmetry with a VM (course 1 §2), and it's why container security is real work rather than a checkbox.

### How it actually goes wrong — in frequency order
1. **You handed it over.** The Docker socket, \`--privileged\`, a host path bind-mounted writable. By far the most common, and it isn't an escape — it's a grant (§3)
2. **uid 0 plus a bug.** Root inside is root outside unless you changed that (§2)
3. **A kernel escape.** Real, and much rarer than the two above

### So this course is two questions
**What does it start with?** — uid, capabilities, mounts (§2–§7). **What can it ask for?** — syscalls, writes, new privileges (§6, §9–§10).

Nothing here is exotic. Most of it is flags you already know the shape of.`,
  narration:
    "Nine courses have assumed the container is trustworthy and the host is safe. We've flagged problems in passing and deferred them all. This course stops deferring, and it starts with the model, because a lot of container security advice is a list of flags with no account of what they're defending against. Here's the model, in one sentence: a container is a process that the kernel is confining. Everything follows from that. The kernel is the only thing between a compromised container and your host — there is no hypervisor, no second boundary, nothing else in the way. And it is the same kernel the container is talking to constantly, because every syscall the process makes goes into it. So the wall protecting you is also the surface being probed. That's the asymmetry with a virtual machine from course one, and it's why this is genuine engineering work rather than a checkbox. Now, how does it actually go wrong? Because if you read security blogs you'd think the answer is exotic kernel exploits, and in practice it almost never is. The most common cause, by a wide margin, is that somebody handed over the host. Mounting the Docker socket into a container. Running with dash dash privileged because a tutorial said to. Bind-mounting a host directory writable when read-only would have done, or bind-mounting slash. None of those are escapes. They're grants. The container did exactly what it was permitted to do, and what it was permitted to do was everything. This is section three, and it deserves being first because fixing it is free. Second is uid zero plus an ordinary bug. Your application has a path traversal, or a deserialization flaw, or a dependency with a remote code execution — the normal run of application vulnerabilities. If the container runs as root, and root inside is root outside because you didn't change that, then the attacker's position is much stronger: they can write to any bind mount as root, they hold every capability Docker granted, and any kernel bug they find is reachable with full privilege. Run as a non-root user with no capabilities and the same application bug is a much smaller event. That's sections two, four and five, and it's one line in a Dockerfile plus two flags. Third is a genuine kernel escape — a bug in a syscall the container can reach that gets it out of its namespaces. These exist, they get CVE numbers, and they're much rarer than the first two. They're also what seccomp and the mandatory access control layers are for, in sections nine and ten. So the course is organised around two questions. What does the container start out holding? Its user id, its capabilities, its mounts, its view of devices — sections two through seven. And what can it ask the kernel for once it's running? Which syscalls, whether it can write to its own filesystem, whether it can gain privileges it didn't start with — sections six, nine and ten. And I want to set expectations honestly, because container security has a reputation for being deep and forbidding. It isn't, mostly. The great majority of the benefit comes from about five flags and one line in a Dockerfile, all of which you'll have seen by section six, and none of which is hard. The deep parts — writing seccomp profiles, SELinux policy — are for specific situations, and I'll say which. Next: the default that does the most damage.",
}
