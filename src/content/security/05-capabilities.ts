import type { Section } from '../types'

export const capabilities: Section = {
  id: 'capabilities',
  title: 'Capabilities',
  scene: 'capabilities',
  slide: `## Root isn't one thing — it's ~40 privileges

Linux split it. \`CHOWN\` is the right to change file ownership; \`NET_ADMIN\` is the right to reconfigure networking; \`SYS_MODULE\` is the right to load a kernel module. Independent, and grantable separately.

**Docker already drops most of them.** That's why root in a container is weaker than root on the host even before you do anything — it can't load modules, can't mount, can't reconfigure the network.

### The move
\`\`\`bash
--cap-drop=ALL --cap-add=NET_BIND_SERVICE
\`\`\`
Drop everything, then add back what actually breaks. For a typical web service that's **nothing** — and if you took §4's advice about port 8080, not even that one.

### The ones worth recognising
\`SYS_ADMIN\` (mount, and a hundred other things — the one \`--privileged\` restores), \`SYS_PTRACE\` (read another process's memory), \`SYS_MODULE\` (game over), \`NET_ADMIN\`.

Dropping capabilities and running as non-root are **independent**, and worth doing both.`,
  narration:
    "Root sounds like a single switch: you either are root or you aren't. Linux stopped working that way a long time ago. The privileges of root were split into about forty separate capabilities, each granting one specific thing, and each grantable independently. CHOWN is the right to change file ownership. NET_BIND_SERVICE is the right to bind a port below 1024. NET_ADMIN is the right to reconfigure interfaces and firewall rules. SYS_MODULE is the right to load a kernel module. A process can hold any subset. And here's the part that's genuinely reassuring: Docker already drops most of them. A container running as root does not get the full set — it gets about fourteen, and the dangerous ones are not among them. It cannot load kernel modules. It cannot mount filesystems. It cannot reconfigure the host's networking. It cannot ptrace arbitrary processes. So root in a container is meaningfully weaker than root on the host before you configure anything, and that's a real part of why containers aren't constantly escaping. The move you want is drop-all-then-add. Dash dash cap-drop equals ALL removes everything, including the defaults. Then dash dash cap-add for anything that actually breaks. And the useful finding is that for a typical web service, nothing breaks. A process that reads files it owns, listens on a high port and talks to a database needs no capabilities at all. The one people commonly need is NET_BIND_SERVICE, for binding below 1024 — and if you took the last section's advice and listen on 8080, you don't need that either. The practical method: drop all, run it, see what fails, and add back the specific capability the error points at. You'll usually add back zero. A few worth recognising when you see them in someone else's run command. SYS_ADMIN is the big one — it covers mount and around a hundred other operations, and it's so broad it's often described as the new root. It's what dash dash privileged restores, and if something asks for it, ask why. SYS_PTRACE lets a process attach to another and read its memory, which is what a debugger needs and also what an attacker wants for extracting secrets from a neighbouring process — add it to debug, then remove it. NET_ADMIN, for anything that reconfigures networking, which a VPN container legitimately needs. And SYS_MODULE, which is straightforwardly game over: a process that can load a kernel module owns the kernel, and the kernel is the only wall. One important point: dropping capabilities and running as non-root are independent, and you want both. A non-root user can still hold capabilities if they were granted, and a root user with no capabilities is much less dangerous than one with the default set. They're two different dials on the same thing, and setting both takes two flags. In Compose, it's cap_drop and cap_add keys on the service — same semantics, and worth putting in the file rather than remembering at run time. Next: two flags that cost nothing and remove whole categories.",
}
