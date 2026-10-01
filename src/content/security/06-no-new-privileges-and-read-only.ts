import type { Section } from '../types'

export const noNewPrivilegesAndReadOnly: Section = {
  id: 'no-new-privileges-and-read-only',
  title: 'no-new-privileges and read-only',
  scene: 'hardened-run',
  slide: `## Two flags, and neither one costs you anything

### \`--security-opt no-new-privileges\`
Sets a kernel bit that makes it **impossible** for a process or any child to gain privileges it didn't start with. It defeats setuid binaries — which is the standard escalation path once an attacker has *some* execution. There is essentially no reason not to set it.

### \`--read-only\`
The whole root filesystem is immutable. An attacker can't drop a binary, can't modify your application's files, can't persist anything.

Most programs need *somewhere* writable, so pair it with tmpfs:

\`\`\`bash
--read-only --tmpfs /tmp:size=64m,mode=1777
\`\`\`

Which is also a **design test**: if your application needs to write all over its filesystem, that's worth knowing.

### The bonus
Read-only makes the container closer to a pure function of its image and its mounts — which makes "recreate it" a reliable fix.`,
  narration:
    "Two flags that cost essentially nothing and remove whole categories of attack, and both are underused because neither has a memorable name. The first is dash dash security-opt no-new-privileges. It sets a kernel flag called PR_SET_NO_NEW_PRIVS on the process, and what that flag does is make it impossible for that process, or any child of it, to ever gain privileges it didn't start with. Permanently, for the life of the process tree. Why does that matter? Because of setuid binaries. A setuid binary runs with the privileges of its owner rather than its caller — slash usr slash bin slash sudo is the obvious one, and there are usually several others in a normal image, often ones nobody thought about. That's the standard escalation path: an attacker gets some code execution as your unprivileged application user, finds a setuid binary, and uses it to become root inside the container. With no-new-privileges set, that path is closed at the kernel level: the setuid bit simply has no effect. There is essentially no reason not to set this flag. It breaks nothing that isn't already trying to escalate. If you add one thing from this section, add this. The second is dash dash read-only, which makes the container's entire root filesystem immutable. Nothing can be written anywhere. And think about what an attacker does immediately after getting code execution: download a tool, write it somewhere, make it executable, run it. Modify your application's files so the compromise survives a restart. Write a cron entry, or a startup script. All of that requires a writable filesystem, and read-only removes it. The complication is that most programs do need somewhere to write — a temporary file, a socket, a pid file, a cache. So you pair it with tmpfs mounts from course six: read-only everywhere, plus a small RAM-backed slash tmp with a size cap. Anything the application legitimately needs to write gets an explicit mount, and everything else is immutable. And that pairing is also a design test, which I think is the more interesting benefit. If you try read-only and your application needs to write in six different places across its filesystem, that's worth knowing about your application. Usually it means state is being kept somewhere it shouldn't be — in the image's directory rather than in a volume — and that's a problem you already had, in the form of data that silently disappears when the container is replaced. Read-only surfaces it. There's a bonus that's operational rather than security-related. A read-only container is close to a pure function of its image plus its mounts. Which means recreate it is a reliable fix rather than a hopeful one: there's no accumulated state inside to lose or to carry a problem forward. That makes incidents shorter. In Compose both are one line each: read_only true, and a security_opt list with no-new-privileges. Put them in the file. Next: the two ways to stop being root at all.",
}
