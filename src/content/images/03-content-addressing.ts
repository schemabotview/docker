import type { Section } from '../types'

export const contentAddressing: Section = {
  id: 'content-addressing',
  title: 'Digests, and why a tag is not one',
  scene: 'digest-chain',
  slide: `## A digest is computed. A tag is assigned.

\`sha256:7e1a4e…\` is the hash of the manifest's bytes. Nobody chose it, nobody can move it, and it means **exactly one image** on every registry on earth.

\`nginx:1.25\` is a **pointer someone maintains**. The publisher can repoint it tomorrow, to anything.

### What that costs you
\`docker pull nginx:1.25\` on two machines a month apart can give you **two different images**, with no error and no warning. That is not a bug — a tag is *supposed* to move when a patch ships.

### \`latest\` is just a tag
Not "newest", not "stable". It is the default tag name, applied to whatever someone last tagged that way — sometimes a nightly build.

### Pinning
\`FROM node:20-slim@sha256:7e1a…\` is reproducible, and it is a **commitment**: you now own the upgrade. Pin production, float in dev, and let a bot raise the PR.`,
  narration:
    "Two ways to name an image, and the difference between them is the difference between a fact and a promise. Start with the digest. Take the manifest — the small JSON document from section one — and run SHA-256 over its exact bytes. Out comes a 64-character hex string, and that string is the image's name. Note what just happened: nobody assigned it. It was computed from the content, so it cannot be wrong, it cannot be moved, and it means the same image on Docker Hub, on your laptop, in your company's registry and on a colleague's machine in another country. If two people have images with the same digest, they have the same image. Not equivalent, not the same version — identical, byte for byte, including every layer, because those are listed by digest too. Now the tag. Nginx colon 1.25 is a pointer, maintained by a human or a pipeline, that currently points at some digest. And a pointer can be repointed. When nginx ships a patch release, the publisher rebuilds and moves the 1.25 tag to the new image, which is exactly the right thing for them to do — that's what a tag is for. But the consequence lands on you. Docker pull nginx colon 1.25 on your laptop today and on a CI runner next month can fetch two different images. Different layers, different binaries, possibly different behaviour. There is no error and no warning, because nothing is wrong: the tag did its job. This is where a lot of works-on-my-machine survives into the container era, and it is worth sitting with, because it is the exact problem containers were supposed to have solved. And it is why latest deserves a moment. People read latest as newest, or as stable. It is neither. Latest is simply the tag name Docker uses when you do not specify one. It points wherever someone last pointed it, which for some projects is the most recent release, for others is a nightly build off the main branch, and for a few abandoned images is something from 2019. Depending on latest means depending on a stranger's tagging discipline. So: pinning. You can ask for an image by digest — the image name, an at sign, and sha256 colon the hash. Docker will fetch exactly those bytes or fail. No ambiguity, no drift, and you can prove today what ran six months ago. That is what you want for production and for anything you want to be able to reproduce. It has a real cost, though, and it's honest to name it. A pin is a commitment: you now own the upgrade. Security patches do not arrive on their own, because the whole point of a pin is that nothing arrives on its own. A pinned base image with a critical CVE stays vulnerable until a human changes the line. The usual shape that works is pinning by digest in production and in anything you build from, floating on a minor tag while developing, and running a bot — Dependabot, Renovate — that watches for new digests and raises a pull request. Then the upgrade is deliberate, reviewed, and attached to a commit, which is the property you actually wanted. Next: the grammar of the name itself, and the two defaults hiding inside a short one.",
}
