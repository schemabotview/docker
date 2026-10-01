import type { Section } from '../types'

export const layers: Section = {
  id: 'layers',
  title: 'Layers, as image anatomy',
  scene: 'layer-stack',
  slide: `## Each layer is a tar of *what changed*

Same diagram as the runtime course — this time read as **image anatomy** rather than kernel mechanism. Each \`lowerdir\` is one blob: the files one build step added, changed or deleted.

### Two ids for the same layer, and they differ
- **\`diff_id\`** — the hash of the **uncompressed** tar. What the config lists, and what the union filesystem stacks
- **the blob digest** — the hash of the **compressed** tar. What the manifest lists, and what a registry stores

### Deletion is not removal
Delete a file that lives in a lower layer and the layer above records a **whiteout** — a marker that hides it. The bytes stay. This is why:

\`\`\`docker
RUN apt-get install -y build-essential && \\
    rm -rf /var/lib/apt/lists/*
\`\`\`

must be **one** \`RUN\`. Two \`RUN\`s means one layer adds the files and the next hides them — and the image carries both.`,
  narration:
    "The diagram is the one from the runtime course, and it's back because nothing about it has changed — only what we're using it for. Then it was a kernel mechanism: overlayfs, lowerdirs and an upperdir, copy-on-write. Now it's image anatomy: each of those lower directories is one blob from the manifest we just took apart. So what is actually in a layer blob? A tar file, containing the files that one build step added, changed or deleted. Not a whole filesystem — just the difference. If your Dockerfile's fourth instruction copies one four-kilobyte source file in, the fourth layer is a tar containing exactly that file, and it is four kilobytes and change. That's why an image with twelve layers is not twelve filesystems; it's one filesystem plus eleven small sets of changes. Now a detail that will otherwise confuse you the first time you go looking at digests, because one layer has two different hashes and both are called an id in different places. The diff_id is the hash of the layer's uncompressed tar. That's what the config blob lists, and it's what the union filesystem stacks when it assembles a root filesystem. The blob digest is the hash of the same tar after compression. That's what the manifest lists, and what a registry stores and serves. Same layer, two identities, because two different things need to name it: the runtime cares about the content it will unpack, and the distribution system cares about the bytes it will transfer. When you compare hashes and they don't match, this is usually why — you are comparing a diff_id with a blob digest. Then the property that has the biggest practical consequence: deletion is not removal. Layers are stacked, and a lower layer is immutable. So when a later step deletes a file that came from an earlier layer, the later layer cannot go back and remove it. What it records instead is a whiteout — a marker saying this path is hidden. The merged view no longer shows the file. The bytes are still there, still shipped, still downloaded by everyone who pulls the image. Look at the Dockerfile fragment on the slide. Apt-get installs build-essential, which is a few hundred megabytes of compilers, and then removes the package lists. Those two commands are joined with double-ampersand inside one RUN, and that matters enormously. One RUN is one layer: the files are added and removed within the same step, and the layer that gets committed contains only the net result. Split them into two RUN instructions and you get one layer containing several hundred megabytes and a second layer containing a whiteout that hides them. The image is still several hundred megabytes larger, forever, and docker images will show you a number that makes no sense given what's visible inside the container. This is the single most common reason for a mysteriously huge image, and it is also why you will see those long chains of double-ampersands in well-written Dockerfiles. They are not stylistic. They are the difference between deleting something and merely hiding it. Next: the hashes themselves, and the difference between a tag and a digest.",
}
