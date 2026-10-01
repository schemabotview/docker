import type { Section } from '../types'

export const permissions: Section = {
  id: 'permissions',
  title: 'Permissions',
  scene: 'uid-mismatch',
  slide: `## The kernel only sees **numbers**

Your host user is uid 1000 (or 501 on macOS). The image's \`USER app\` is uid 1001. Same directory, two numbers, **permission denied** — and the container can't know the name it's using doesn't exist on the host.

This isn't a Docker feature. It's how Unix file ownership works, made visible by a mount.

### Three fixes, in order
1. **Match at run time** — \`--user $(id -u):$(id -g)\`. The everyday dev answer. The container then runs as a uid with no \`/etc/passwd\` entry, which some tools grumble about
2. **Build for a known uid** — \`ARG UID=1000\`, create the user with it, \`chown\` the host directory to match. The answer for a team
3. **Use a volume instead** — Docker seeds a fresh volume with the **image's** ownership (§4), so there's no clash. This is why volumes "just work" and bind mounts don't

### On Docker Desktop
It mostly disappears — the VM fakes the mapping. Which is why this bites when a Mac user's setup reaches a Linux CI runner.`,
  narration:
    "This is the most common bind-mount failure there is, and the first thing to say about it is that it isn't Docker's fault and there's no Docker setting that makes it go away. It's Unix file ownership, made visible by mounting one filesystem into two places with different ideas about who's who. Here's the setup. On your host, a directory owned by your user — uid 1000 on most Linux systems, 501 on a Mac. Inside the container, your image follows good practice from course four and runs as a non-root user, created with whatever uid the image author picked. 1001, say, or 1000, or 100. Now bind-mount that directory in. The container's process tries to write, and the kernel does what it always does: it compares the numeric uid of the process to the numeric owner of the file. 1001 is not 1000. Permission denied. And notice why it's so confusing. Inside the container, ls shows the files as owned by some user id with no name, because the container's slash etc slash passwd has no entry for 1000. Outside, they're owned by you, and you can write them fine. The same files, two different stories, and neither side has the information to explain the other. Three fixes, and the order matters. The first is to match the uid at run time: dash dash user, dollar-paren id dash u, colon, dollar-paren id dash g. That runs the container's process as you, so the numbers agree and everything works. This is the everyday answer for local development and it's what most Compose files for dev environments end up doing. The cost: the container now runs as a uid that has no entry in its own passwd file, and some programs complain — git in particular gets unhappy about not being able to resolve the user. Usually tolerable. The second is to build for a known uid. Take a build argument for the uid, create the user with it in the Dockerfile, and chown the host directory to match on the machines that need it. More setup, and it's the right answer for a team where everyone should have the same experience, or where the container has to write files that a host process then reads. The third is to sidestep it: use a volume instead of a bind mount. And this is where section four's seeding rule pays off. When Docker seeds a fresh volume from the image, it copies the image's ownership along with the content. So the directory inside the volume is owned by exactly the uid the image expects, because the image told it so. There's no host user in the picture to disagree with. That is the real reason volumes just work and bind mounts don't, and it's a good argument for using a volume whenever the host doesn't actually need to read the files. One last note, and it explains why this problem arrives suddenly rather than gradually. On Docker Desktop for Mac and Windows, the file-sharing layer fakes the ownership mapping, so bind mounts mostly just work regardless of uids. Which means a team developing on Macs never sees this — until their setup runs on a Linux CI runner or a Linux workstation, where the mapping is real, and everything breaks for one person who is then told it works on my machine. Next: getting the data back out.",
}
