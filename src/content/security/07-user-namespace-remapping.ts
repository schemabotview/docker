import type { Section } from '../types'

export const userNamespaceRemapping: Section = {
  id: 'user-namespace-remapping',
  title: 'User namespace remapping',
  scene: 'userns-rootless',
  slide: `## The namespace §2 said was off

\`"userns-remap": "default"\` in \`daemon.json\`, then restart the daemon. Now container uid 0 maps to an unprivileged host uid — 231072 or similar — so "root in the container" is finally not root on the host.

It's daemon-wide: every container on that host gets it.

### What it breaks, and why adoption is low
- **Existing volumes** have the old ownership. Files written by the old root are unreadable by the new mapped root. There is no migration
- **Bind mounts** need host ownership in the mapped range
- **\`--privileged\`, \`--pid=host\`, \`--net=host\`** are incompatible — those containers must opt out per-container
- **The daemon is still root.** A daemon compromise is still total

### So where it sits
Genuinely better than nothing, and superseded in most cases by **rootless** (§8), which removes the root daemon instead of remapping around it. Worth knowing because you'll meet hosts that use it.`,
  narration:
    "Section two said user ids aren't remapped because the user namespace is off by default. This section turns it on. The configuration is one key in daemon dot json — userns-remap, set to default — followed by a daemon restart. Docker creates a subordinate uid range for a system user, and from then on container uid zero maps to some unprivileged host uid, typically 231072, with the rest of the container's uids mapping to the range above it. So a process that is root inside the container is, from the host's point of view, an ordinary unprivileged user with no special rights. That closes the hole section two described. A container that escapes its mount namespace is now an unprivileged user on the host rather than root. Files it writes to a bind mount are owned by that mapped uid rather than by root. Every capability it holds applies to a user who can't do much with them. It's a real improvement, and it's daemon-wide, so it applies to every container without anyone remembering a flag. Now, why has almost nobody turned it on? Because the disruption is substantial and it lands the moment you restart. Existing volumes have the wrong ownership. Every file your containers wrote as the old root is owned by uid zero on the host, and your containers now run as the mapped uid, which cannot read root-owned files. So your databases stop working, your uploads directory is unreadable, and there's no migration path — you chown things by hand, for every volume, on every host. Bind mounts have the same problem from the other direction: a host directory you want the container to write needs to be owned by something in the mapped range, which is a uid number no human has ever typed before. Several flags become incompatible. Privileged containers, containers sharing the host's pid or network namespace, containers using certain storage drivers. Those have to opt out individually with dash dash userns equals host, which works, and means your most dangerous containers are exactly the ones not getting the protection. And the honest limitation: the daemon is still running as root. All you've remapped is the containers. A vulnerability in dockerd itself, or anyone who can reach the socket, is still root on the host, with all of section three's consequences unchanged. So where does this leave it? It's genuinely better than nothing, and if you inherit a host that has it configured, now you know what those strange uid numbers in your volume directories mean. But for most people it's been superseded by rootless Docker, which is the next section, and which attacks the problem at the other end — instead of remapping around a root daemon, it removes the root daemon. That's a cleaner answer, and it's had a lot more development attention in recent years. Learn remap so you recognise it; reach for rootless. Next.",
}
