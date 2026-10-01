import type { Section } from '../types'

export const whatAnImageIs: Section = {
  id: 'what-an-image-is',
  title: 'What an image actually is',
  scene: 'image-anatomy',
  slide: `## There is no image file

An image is a **manifest** — a small JSON document — plus the blobs it lists **by digest**:

- **the config blob** — \`Env\`, \`Cmd\`, \`Entrypoint\`, \`WorkingDir\`, \`User\`, \`architecture\`. Everything \`docker run\` needs that isn't a file
- **the layer blobs** — gzipped **tar diffs**, one per build step, each named by its own hash

### Why this shape matters
- A pull is: fetch the manifest → fetch only the blobs you **lack**. Shared layers are skipped entirely
- Everything is named by **content**, so nothing can be silently substituted
- You **cannot edit** an image. Change a byte and it's a different image with a different digest

### The vocabulary
\`docker save\` produces a tar *of* these pieces — a transport format, not the image. The image is the set of blobs and the document listing them.`,
  narration:
    "Two courses in, every image you have run belonged to somebody else. This course opens one up, and it starts by dismantling the most natural assumption about them: that an image is a file. It isn't. There is no such file, anywhere, on your disk or in a registry. Here is what there actually is. First, a manifest — a small JSON document, usually well under a kilobyte. It says what kind of thing it is, it names one config blob by its digest, and it lists some layer blobs, in order, by their digests. That's the whole document. It contains no file data at all; it is a list of references. Second, the config blob, which is also JSON. This holds everything docker run needs to know that isn't a file: the environment variables, the default command, the entrypoint, the working directory, the user to run as, the architecture and operating system it was built for, and the list of layer identifiers that make up its filesystem. When you set ENV or CMD or USER in a Dockerfile, this is where those end up. Third, the layer blobs. Each one is a gzipped tar file containing the files that changed at one build step — a diff, not a whole filesystem. And each is named by the SHA-256 hash of its own bytes, which is what content-addressed means and which we'll spend the whole of section three on. Now, why should you care about the anatomy rather than just using the thing? Because three behaviours that otherwise look magical are direct consequences of this shape. The first is how a pull works. The daemon fetches the manifest, reads the list of digests, checks which of those blobs it already has locally, and downloads only the ones it lacks. That is why pulling your application's new version after a base image is already present takes two seconds and forty megabytes rather than two minutes and four hundred. Nothing clever is happening: it is a list of content addresses and a set membership test. The second is integrity. Because every piece is named by the hash of its own content, nothing can be substituted for anything else without the name changing. A registry that served you the wrong bytes would be immediately detectable, and the daemon does verify. The third is immutability, which we met in course one and can now state precisely. You cannot edit an image, because an image's identity is the hash of its manifest, and the manifest contains the hashes of everything else. Change a single byte in a single layer, and that layer's digest changes, so the manifest changes, so the manifest's digest changes, so it is a different image. Not a modified version of the old one — a different one. Immutability here isn't a policy anybody enforces; it's arithmetic. One piece of vocabulary before we go on, because it causes confusion. Docker save does produce a tar file, and people reasonably conclude that the tar is the image. It is not. Save is a transport format — it bundles up the manifest and all the blobs so you can carry them on a USB stick. The image is still the set of blobs and the document that lists them, both before and after. Next: what's actually inside one of those layer blobs.",
}
