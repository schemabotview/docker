import type { Section } from '../types'

export const imagesVsContainers: Section = {
  id: 'images-vs-containers',
  title: 'Images vs containers',
  scene: 'layer-stack',
  slide: `## The answer is §5's diagram

- An **image** is the \`lowerdir\` stack — read-only layers plus a config. Inert. Shareable. Identical on every host
- A **container** is **one writable layer + one running process**, on top of that stack

That's the whole distinction — and it is literal, not an analogy.

### What follows immediately
- \`docker run\` twice from one image = **two upperdirs, one shared lowerdir**
- Deleting a container frees only its writable layer — **the image is untouched**
- You **cannot** change an image. A "change" builds a **new** image with new layers and a new digest
- A stopped container still owns its writable layer — \`docker ps -a\` is where disk hides

### The direction that catches people
Image → container is routine. Container → image (\`docker commit\`) exists, and it is how **not** to work: undocumented, unreproducible. Builds come from a **Dockerfile** — course 4.`,
  narration:
    "This is the question every Docker introduction asks in its first five minutes, and it deserves a precise answer rather than an analogy, because you now have everything needed for the precise one. The diagram is section five's, back deliberately. An image is the lower part of that stack: a set of read-only layers, plus a configuration document that says what command to run and which environment variables to set. It is inert. Nothing in an image is executing. It is a pile of files and some metadata, content-addressed, identical byte for byte on every machine that has it. A container is what you get when you put one writable layer on top of that stack and start a process in it. That is the entire difference. One writable layer, and a process. People reach for the class-and-instance analogy here, and it's a reasonable analogy, but notice you don't need it — the distinction is literal and you can point at it on the diagram. Four consequences follow straight away. First, run two containers from the same image and you get two upperdirs sharing one lowerdir. The image is not copied. That's why starting the tenth container from an image is as fast and as cheap as the second. Second, delete a container and you free its writable layer only. The image is entirely untouched, because the container never had write access to it. Third — and this one is a genuine shift in thinking if you come from managing servers — you cannot modify an image. Ever. It is content-addressed, so changing a byte changes its digest, which makes it a different image. What you actually do is build a new image, which adds new layers and produces a new digest. Immutability isn't a discipline you impose here; it's a property of the format. Fourth, a stopped container still owns its writable layer, and those layers are where disk space goes to hide. A host with two hundred exited containers may be holding gigabytes that docker images will never show you. Docker ps dash a first, when you go hunting for space. Finally, the direction of travel. Going from image to container is what you do all day: docker run. Going the other way — container to image — is possible, with docker commit, which takes a container's writable layer and freezes it into a new layer. And I'm telling you it exists so that you recognise it and don't use it. An image made by commit has no record of how it was made. Nobody, including you next month, can reproduce it or audit what's in it. The reproducible way to build an image is a Dockerfile — a file, in version control, that describes the layers — and that is course four. One section left: let's put the course back together.",
}
