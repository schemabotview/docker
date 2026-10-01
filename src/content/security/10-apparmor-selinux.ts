import type { Section } from '../types'

export const apparmorSelinux: Section = {
  id: 'apparmor-selinux',
  title: 'AppArmor and SELinux',
  scene: 'capabilities',
  slide: `## Mandatory access control — the layer above the others

Everything so far is **discretionary**: uid, capabilities, syscalls. MAC is a policy the kernel enforces *regardless* of who the process is or what it holds. Even root is subject to it.

- **AppArmor** — **path**-based. Debian, Ubuntu. Docker ships \`docker-default\`, applied automatically
- **SELinux** — **label**-based. RHEL, Fedora. Enable with \`--security-opt label=type:container_t\`, and the daemon's \`selinux-enabled\`

### The one thing you'll actually hit
On an SELinux host, a bind mount is denied until it's labelled. That's what \`:z\` and \`:Z\` are for:

\`\`\`bash
-v /srv/data:/data:Z    # Z = private to this container
\`\`\`

\`:z\` is shared between containers. People meet these as a mysterious *permission denied* and apply \`:Z\` without knowing it **relabels the host directory**.

### The honest advice
Leave the defaults on. Writing policy is a specialist job, and disabling it to make something work is the wrong trade.`,
  narration:
    "One more layer, and it's a different kind from everything so far. Uid, capabilities and seccomp are all discretionary — they're about what this process is and what it holds. Mandatory access control is a policy the kernel enforces regardless of who the process is. Even root is subject to it. You can be uid zero with every capability and still be refused, because the policy says that program may not touch that resource. Two implementations, and which you meet depends on your distribution. AppArmor is path-based: policy is written in terms of file paths and what a program may do with them. It's the default on Debian and Ubuntu. Docker ships a profile called docker-default and applies it to every container automatically, and it restricts things like writing to slash proc and slash sys. SELinux is label-based: every file and every process carries a label, and the policy is a matrix of which label may do what to which. It's the default on Red Hat, Fedora and CentOS, and it's considerably more thorough and considerably harder to reason about. Docker integrates with it when the daemon has selinux-enabled set, and you can apply a type with dash dash security-opt label. Now the one thing you will actually hit, because everything else here is on by default and invisible. On an SELinux host, bind-mounting a host directory into a container fails. The container gets permission denied on files that look perfectly readable, ownership is right, permissions are right, and nothing explains it. The reason is that the host directory's SELinux label doesn't permit container processes to access it. The fix is a suffix on the volume flag: colon z, lowercase, or colon Z, uppercase. Lowercase z relabels the directory so that it can be shared between multiple containers. Uppercase Z relabels it private to this one container. They're not cosmetic: they modify the labels on the host directory, recursively. Which matters, because if you point colon Z at a directory something else on the host is also using, you've just relabelled it out from under that process. People meet these as a mysterious permission denied, find the suffix in a forum answer, apply it, and it works — without knowing that it wrote to the host's filesystem metadata. Worth knowing before you use it on anything shared. The honest advice for the rest: leave the defaults on and don't write policy. Docker's default AppArmor profile and the standard SELinux container type are maintained by people who do this professionally, and they're doing useful work. Writing a custom AppArmor profile or an SELinux policy module is a specialist job with a long feedback loop and failure modes that look like anything but a policy denial. The common wrong move is the opposite: something fails, and the fix found online is dash dash security-opt label equals disable, or setenforce zero on the whole host. That turns off protection across the board to solve one problem, and it's almost never the right trade. If you're on an SELinux host and something is denied, read the audit log — ausearch and audit2why will tell you exactly which access was refused, and usually the answer is a mount suffix rather than turning anything off. Next: where credentials should actually live.",
}
