import type { Section } from '../types'

export const rootlessDocker: Section = {
  id: 'rootless-docker',
  title: 'Rootless Docker',
  scene: 'userns-rootless',
  slide: `## No root process anywhere in the picture

\`dockerd-rootless-setuptool.sh install\` — and the daemon runs as **you**. So does containerd, the shims, and every container. A daemon bug is a bug in a process with your uid.

It's the strongest single improvement available here, because it removes the *thing* rather than restricting it. And it makes the \`docker\` group (§3) unnecessary — there's no root socket to be granted.

### What it costs — and this is real
- **Ports below 1024** need a sysctl or a helper. Publish high and proxy
- **cgroup limits** need cgroup v2 + systemd. On an older host, \`--memory\` silently does nothing
- **Some storage and network drivers** don't work; overlay networks don't
- **Slower networking** by default, and **one daemon per user** — isolation, and duplication

### Where it clearly wins
A developer machine. A shared build host running untrusted builds. Anywhere the alternative was the \`docker\` group.`,
  narration:
    "Rootless Docker is the strongest single thing in this course, because instead of restricting what a root daemon can do, it removes the root daemon. You run one setup script — dockerd-rootless-setuptool dot sh install — and from then on dockerd runs as your user. So does containerd. So do the shims, and so does every container. There is no root process anywhere in the picture. Think about what that changes. A vulnerability in dockerd is a vulnerability in a process running as you, with your permissions and nothing more. A container escape puts the attacker at your uid, not root. And the docker group problem from section three disappears entirely — there's no privileged socket to grant access to, because your socket is yours, so being able to run Docker doesn't imply being able to become root. On a shared machine that's a substantial change in posture. How does it work? Mostly user namespaces, the same mechanism as the last section, but applied from the outside: the whole daemon runs inside a user namespace where it believes it's root, while the kernel knows it's you. Plus some helper processes for networking and for setting up the namespaces. Now the costs, and I want to be straight about these because the advocacy tends to skip them. Ports below 1024 don't work without extra configuration, because binding them is privileged. You can lower a sysctl, or use a helper, or — the simpler answer — publish a high port and put something in front. Cgroup limits need cgroup version two and systemd's delegation feature. If you're on an older host without those, dash dash memory and dash dash cpus are silently ignored. Not an error: ignored. So you think you've limited a container and you haven't, which is worse than knowing you can't. Check this before relying on limits. Some storage drivers and network drivers don't work, and overlay networks in particular don't, which rules out Swarm. Networking is slower by default, because traffic goes through a user-mode TCP stack rather than the kernel's; installing slirp4netns with a faster mode recovers most of it, and for most workloads the difference isn't the bottleneck, but it's real for high-throughput cases. And each user gets their own daemon with its own image store. That's genuine isolation between users on a shared machine, and it also means the same base image is stored once per user, which costs disk. Where does it clearly win? A developer machine, where almost none of those costs apply and the benefit is that your Docker daemon isn't a root service you've given a browser-adjacent process access to. A shared build host, especially one running untrusted builds from pull requests — per-user daemons and no root anywhere is exactly what you want. And anywhere the alternative was adding people to the docker group, which as we established is granting root. Where it's still awkward is a production host needing host networking, privileged containers or overlay networks. And the honest general advice: if rootless is disruptive for you, USER plus cap-drop-all plus no-new-privileges gets you most of the practical benefit for none of the disruption. Do that first, and treat rootless as the next step rather than the prerequisite. Next: narrowing the syscall surface.",
}
