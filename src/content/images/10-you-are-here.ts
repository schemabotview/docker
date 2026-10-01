import type { Section } from '../types'

export const youAreHere: Section = {
  id: 'you-are-here',
  title: 'You are here',
  scene: 'image-anatomy',
  slide: `## A manifest, a config, and some blobs

The diagram is §1's — every section was a property of it.

- **§2 layers** — each blob is a tar of *what changed*. Deleting in a later layer only **hides**
- **§3 digests** — names computed from bytes. A **tag** is a pointer someone maintains
- **§4 references** — \`nginx\` = \`docker.io/library/nginx:latest\`. Three silent defaults
- **§5 history** — the config records every build command, so \`ARG\` secrets **ship**
- **§6 size** — \`docker images\` double-counts shared layers; \`system df\` tells the truth
- **§7 manifest lists** — one tag, one manifest per platform. Silent QEMU is the failure to watch
- **§8–9** — reclaiming disk without deleting a database; moving an image without a registry

### You can now
Pin a base by digest and know what you signed up for. Find the one \`RUN\` that owns your image's size.

### You can't yet
**Make one.** Course 4 is the Dockerfile.`,
  narration:
    "Let's close the loop, and the diagram is section one's, because everything in this course was a property of that shape. An image is a manifest — a small JSON document — naming a config blob and some layer blobs, all by digest. Section two opened a layer: a tar of what one build step changed, not a whole filesystem. Which gave us the two ids for the same layer, the diff_id of the uncompressed tar that the runtime stacks and the blob digest of the compressed one that the registry stores. And it gave us the whiteout: deleting a file that lives in a lower layer only hides it, the bytes still ship, and that is why an install and its cleanup have to be in the same RUN. Section three was the difference between a fact and a promise. A digest is computed from the bytes, so it cannot move and means one image everywhere. A tag is a pointer someone maintains and is supposed to move when a patch ships — which means the same pull on two machines a month apart can give you two different images, with no error. Latest is not newest or stable, it is just the default tag name. Pinning by digest buys reproducibility and costs you ownership of the upgrade. Section four was the grammar. Nginx expands to docker dot io slash library slash nginx colon latest, and the library namespace is what makes a bare name an Official Image rather than something anyone uploaded. The registry is detected by a dot or a colon in the first segment, which is why localhost colon 5000 works and myteam slash api does not mean what you hoped. Section five read an image backwards. Docker history recovers the Dockerfile from the config, which is a real skill — the size column finds the one fat RUN, the created-by column tells you what was built. And it ships: an ARG holding a token is in the image in plain text for anyone who can pull it, whether or not a later step deleted the file. Section six explained the number that lies. Docker images counts every layer per image, so shared bases are counted twice and the column doesn't add up to your disk. System df is the truth. And the number that actually matters for a deploy is neither: it is what the target host lacks, which is why instruction order beats base-image size. Section seven was multi-arch. Behind a tag is usually an index, one manifest per platform, and the daemon picks silently. The failure to watch for is not the clear error but the quiet one — QEMU emulation, running correctly and many times slower. And sections eight and nine were the housekeeping: look at system df before you prune, know that unused means something different in every prune command and that volume prune is looking at your database; and use save and load to move images, because export and import flatten a container's filesystem and throw away the config, leaving you an image that starts and does nothing. So what can you do now? You can pin a base image by digest and articulate exactly what that buys and what it costs. You can take an undocumented image and recover how it was built. You can find the one instruction that owns your image's size instead of guessing. You can explain why a rebuild ships four megabytes and why the same command on an ARM laptop was twenty times slower than on CI. What you cannot do yet is make one. Everything in three courses has been somebody else's image, read from the outside. Next, course four: the Dockerfile — what each instruction does to the layer stack, why CMD and ENTRYPOINT are not the same thing, and the cache rule that decides whether your build takes eight seconds or eight minutes.",
}
