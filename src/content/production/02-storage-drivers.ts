import type { Section } from '../types'

export const storageDrivers: Section = {
  id: 'storage-drivers',
  title: 'Storage drivers',
  scene: 'daemon-config',
  slide: `## \`overlay2\`, and you should not change it

It's the default on every modern kernel and it's what course 1 §5 described: lowerdirs, an upperdir, copy-on-write. There's essentially no reason to use anything else now.

### The others you'll meet in old material
\`aufs\`, \`devicemapper\` (especially \`loop-lvm\`, which was slow and fragile), \`btrfs\`, \`zfs\`, \`vfs\` (no layering at all — full copies, used in nested Docker).

If a blog post tells you to configure \`devicemapper\`, it predates 2017.

### Changing it is a wipe
The driver owns the on-disk layout, so switching means every image and every container's writable layer is **unreadable**. Docker doesn't convert. Plan it as: drain the host, back up volumes, wipe \`/var/lib/docker\`, re-pull.

### What's actually worth knowing
\`overlay2\` needs backing filesystem support (\`ext4\`, \`xfs\` with \`ftype=1\`). An \`xfs\` filesystem formatted **without** \`ftype=1\` — which some older installers did — cannot run it, and the error is cryptic.`,
  narration:
    "The storage driver is what implements the layered filesystem from course one. And this section is mostly here so that when you meet the topic you can stop worrying about it, because the answer today is short: use overlay2, don't change it. Overlay2 is the default on every modern kernel and it's exactly what course one described — a set of read-only lowerdirs, one writable upperdir, copy-on-write on first write to a file from a lower layer. It's fast, it's well-tested, and it's what essentially every Docker installation in the world is running. Check yours with docker info and look at the storage driver line. The others exist mostly in old documentation, and knowing the names helps you date what you're reading. Aufs was the original, from before overlayfs was in the mainline kernel. Devicemapper was the Red Hat answer for a while, and in its default loop-lvm configuration it was slow and prone to filling up in a way that was hard to recover from — a lot of Docker's early reputation for being fragile comes from that specific combination. Btrfs and zfs drivers exist and use those filesystems' own snapshot mechanisms, which is elegant and is a niche. Vfs does no layering at all: every layer is a full copy of the filesystem. It's enormously wasteful and it's the fallback when nothing else works, which is mostly inside nested Docker — Docker running in a container. If you see vfs in docker info on a machine you care about, something has gone wrong and your disk usage is about to become interesting. So: if a tutorial tells you to configure devicemapper with direct-lvm, it was written before 2017, and you should be suspicious of the rest of it. Now the thing to actually understand: changing the driver is a wipe. The driver owns the on-disk layout under slash var slash lib slash docker, and the layouts are not interchangeable. Switch drivers and every image, every container's writable layer, and every bit of build cache becomes unreadable. Docker does not convert them and does not warn you in a way that conveys the scale. So a driver change is planned work: drain the host, back up your volumes — which are driver-independent and survive, that's the one piece of good news — stop Docker, remove or move slash var slash lib slash docker, change the setting, start Docker, re-pull everything. Not something you do to try it out. And the one genuinely useful operational fact: overlay2 requires support from the filesystem underneath it. Ext4 works. Xfs works, but only if it was formatted with the ftype equals one option — and some older installers formatted xfs without it. On such a host overlay2 refuses to start, with an error about the backing filesystem that doesn't make the cause obvious, and the fix is reformatting the filesystem, which is a much bigger job than it sounds like when you're standing up a server. Check it with xfs_info and look for ftype equals one. Next: the two lines that stop a host filling up.",
}
