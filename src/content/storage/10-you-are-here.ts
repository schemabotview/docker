import type { Section } from '../types'

export const youAreHere: Section = {
  id: 'you-are-here',
  title: 'You are here',
  scene: 'mount-types',
  slide: `## Three mounts, one question: who owns it

The diagram is §3's.

- **§1–2** — the writable layer dies with the container, **and** copy-on-write makes hot or large writes expensive. Two independent reasons
- **§4 volumes** — Docker owns it; a fresh volume is **seeded** from the image, once. Stale volumes hide new image content
- **§5 binds** — you own it; it **replaces** the path (hence \`node_modules\`), and it crosses a VM boundary on Desktop
- **§6 tmpfs** — nobody owns it. Always set \`size\`, or it grows into the memory limit
- **§7 \`-v\` vs \`--mount\`** — \`-v\` invents a missing host path; \`--mount\` refuses
- **§8 permissions** — the kernel compares **numbers**. A volume sidesteps it entirely
- **§9** — tar via a throwaway container; stop the database first; test the restore

### Next
Six courses, and every container has been alone on the network. Course 7 is how they **reach each other**.`,
  narration:
    "Let's close the loop. The diagram is section three's, and the question it asks is the one that decides everything in this course: who owns the storage. Sections one and two established why you need to ask at all, and they gave two independent reasons that most material collapses into one. The writable layer dies with the container — and container replacement is not an incident, it's the normal way anything changes, so that's a frequent event rather than a rare one. And separately, copy-on-write makes the first write to any file expensive, because overlayfs copies the whole file up before modifying it. Appending to a large log, or running a database's small scattered writes, pays that tax repeatedly. Either reason alone justifies a mount; together they're decisive. Section four was volumes, where Docker owns the storage, and the rule that explains both why they work and how they bite: a fresh empty volume is seeded from the image's content, once, including ownership. That's why a database container works the first time you run it. And it's why, after you rebuild an image with new seed data, the old volume keeps serving yesterday — it isn't empty any more, so nothing is copied, and nothing tells you. Section five was bind mounts, where you own the storage. A mount replaces the path, which is why binding your source over slash app hides the node_modules the image installed, and why the fix is a more specific anonymous volume stacked on top. And they're free on Linux and not free on Docker Desktop, where every read crosses a VM boundary — so bind your source and leave dependencies inside. Development only: a bind mount ties a container to one host's directory layout, which is the coupling images exist to remove. Section six was tmpfs, where nobody owns the storage. RAM, never a disk, gone on stop — for secrets, for hot scratch, and for the writable slash tmp that a read-only container still needs. Always set a size, or it grows into your memory limit and the OOM kill looks exactly like a memory leak. Section seven was the syntax argument, and it isn't about verbosity: dash v invents a host path that doesn't exist, so a typo gives you an empty directory and a database that starts perfectly with no data. Dash dash mount refuses. Use dash v when you'll see the result, dash dash mount in anything committed. Section eight was permissions, which isn't a Docker feature at all — the kernel compares numeric uids, your host user and the image's user have different numbers, and the container has no way to know. Match the uid at run time, build for a known uid, or use a volume and let the seeding rule handle it. And it hides on Docker Desktop, which is why it surfaces the moment a Mac-developed setup reaches a Linux runner. Section nine was getting data out: there's no backup command, the technique is a throwaway container that can see both sides and a tar between them, you must stop a database or use its own dump tool, and a backup you've never restored isn't one. So: six courses. You can build a good image, run it properly, and keep its data. And in all of that, every container has been alone. They've talked to the outside world, and we've published ports without ever explaining what a published port is. Nothing has talked to anything else. Course seven is networking: how a container gets an address, what dash p actually does to your host's firewall rules, and why the default bridge network cannot resolve a container by name.",
}
