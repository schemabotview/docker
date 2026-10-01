import type { Section } from '../types'

export const pinningByDigest: Section = {
  id: 'pinning-by-digest',
  title: 'Pinning by digest',
  scene: 'tag-scheme',
  slide: `## The only reference that can't move

\`\`\`docker
FROM node:20-slim@sha256:7e1a4e2d11e2ac77…
\`\`\`

The tag stays for readability; the digest decides. This removes the one mutable step from the pull sequence (§2), which is the whole of the trust story.

### What it costs
**You own the upgrade.** No patch arrives on its own — that is the point, and it is also the risk. A pinned base with a critical CVE stays vulnerable until a human changes the line.

### So automate the bump
Renovate and Dependabot both understand digest pins in a Dockerfile: they watch for a new digest behind the tag and raise a **pull request**. Now the upgrade is deliberate, reviewed, and attached to a commit — which is what you wanted from pinning in the first place.

### Where to pin
Base images, production deploys, anything reproducible. Float on a minor tag while developing. \`docker inspect\` on \`.RepoDigests\` gets you the digest you're running.`,
  narration:
    "Course three introduced digests; this section is about actually using them, and about being honest that it's a trade rather than a free improvement. The mechanics are simple. In a Dockerfile, FROM, the image name, the tag, an at sign, and sha256 plus the hash. You keep the tag for readability — a human reading the line can see it's meant to be node twenty slim — and the digest is what's actually resolved. Same syntax in a Compose file, same in a Kubernetes manifest. What that buys, precisely, is removing the mutable step from section two's sequence. Every request in a pull is content-addressed except the first one, which resolves a tag. Pin the digest and that first lookup is gone: the client asks for specific bytes and either gets them or fails. There's no window in which someone with tag-write access can change what you're running, and no possibility of two machines pulling the same reference and getting different images. What it costs is real and people undersell it. When you pin, no update ever arrives on its own — which is exactly what you asked for, and is also the risk. Your base image gets a security patch; you don't get it. A critical vulnerability is announced in OpenSSL; your pinned base still has the old one, and will until a human edits that line. An unpinned floating tag would have picked the fix up on the next build without anyone doing anything. So pinning converts an unmanaged, invisible upgrade process into a managed, visible one — and if nobody manages it, you've made things worse, not better. Which is why the pin and the automation are one decision rather than two. Renovate and Dependabot both parse digest pins in Dockerfiles and Compose files. They watch the tag you named, notice when the digest behind it changes, and open a pull request updating the hash — usually with a changelog link. Your CI builds and tests that pull request. Someone approves it. Now the upgrade is deliberate, reviewed, tested, and recorded in git history with a commit that says exactly what changed. That is what you actually wanted, and it's strictly better than either extreme: better than floating, because nothing changes under you unobserved, and better than pinning-and-forgetting, because patches do arrive. Where to pin: base images in Dockerfiles, absolutely. Production deployment manifests, yes. Anything you might need to reproduce exactly — a release build, a compliance artifact — yes. Where not to bother: while you're developing locally, floating on a minor tag is fine and less friction. And two practical commands. To find the digest of an image you already have, docker inspect with the RepoDigests index, which gives you the full reference to paste. And to check what a tag currently resolves to without pulling, docker buildx imagetools inspect, which queries the registry and prints the digest and the platforms — useful in a script that wants to verify a deployment is running what it thinks it is. Next: running one yourself.",
}
