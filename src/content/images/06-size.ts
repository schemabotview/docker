import type { Section } from '../types'

export const size: Section = {
  id: 'size',
  title: 'Size, and the number that lies',
  scene: 'size-sharing',
  slide: `## \`docker images\` double-counts

The \`SIZE\` column is **per image** and counts every layer that image uses. Two images sharing a 142 MB base each claim the 142 MB. On disk there is **one copy**.

### Three numbers, three questions
- **\`docker images\`** — "how big is this image *in total*". Sums to more than your disk holds
- **\`docker system df -v\`** — what is **actually** on disk, with a \`RECLAIMABLE\` column. The truth
- **what a pull costs** — only the layers that host lacks. Usually just the layers *you* changed

### Which one to optimise
The third. Rebuilding an app on an unchanged base ships a few megabytes however large the base is — **as long as your changes are in the top layers**. That is why instruction order matters more than base-image size (course 4).

### Where the bytes are
Almost always one \`RUN\`. Find it with \`docker history\`, not by guessing.`,
  narration:
    "Run docker images on a working machine, add up the size column, and you will frequently get a number larger than the disk. People conclude that Docker is lying, or that something is badly wrong. Neither is true; the column simply answers a different question from the one being asked. The size column is per image, and it counts every layer that image uses. Look at the diagram. Api version 1.4 and worker version 2.0 are both built from node 20-slim, which is a hundred and forty-two megabytes. Api adds sixty-two megabytes of its own; worker adds thirty-eight. Docker images will report api at two hundred and four megabytes and worker at a hundred and eighty, which sums to three hundred and eighty-four. But the base is stored once — it is the same blobs, with the same digests, and section one's content addressing means there is no way for there to be two copies. The actual disk usage is two hundred and forty-two megabytes. The column isn't wrong, it's just not additive, and nobody tells you that. So there are three different numbers you might mean by how big is it, and they answer three different questions. Docker images answers: how big is this image in total, if it were the only thing here. That is the right number when you want to know what a fresh machine with nothing cached would download. Docker system df, especially with dash v, answers: what is actually on this disk. It breaks down images, containers, local volumes and build cache, and it has a reclaimable column telling you how much of it nothing is using — which is the number to look at before you go pruning, and it is section eight. And the third number has no command, but it is the one that matters most in practice: what does a pull actually cost. Because a deploy doesn't download your image. It downloads the layers the target host doesn't already have. If the base image is already there — and it usually is, because the previous version used it too — then shipping a new build of your application transfers only the layers that changed. Which leads to the piece of advice that follows from all of this and surprises people. If you deploy frequently, the size of your base image matters far less than where your changes sit in the stack. A four-hundred-megabyte base that never changes is downloaded once per host, ever. Four megabytes of application code in the top layer is what gets shipped on every deploy. Optimise for that, and the way you optimise for it is instruction order in the Dockerfile — put the things that rarely change early, and the things that change every commit last. That is course four, and it is the single highest-leverage thing in Dockerfile authoring. That said, a smaller base is still better for cold starts, for autoscaling, and for attack surface, which is a security argument rather than a bandwidth one. And when you do want to shrink an image, don't guess: run docker history and look at the size column. The answer is almost always one RUN instruction, and everything else is rounding. Next: how one tag serves several processor architectures.",
}
