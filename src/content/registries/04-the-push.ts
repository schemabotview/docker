import type { Section } from '../types'

export const thePush: Section = {
  id: 'the-push',
  title: 'The push',
  scene: 'registry-pull',
  slide: `## The same sequence, reversed — and one extra step

For each blob the client sends a **HEAD** first: *do you already have \`sha256:…\`?* Only the missing ones are uploaded. Then the manifest goes **last**.

That ordering matters: the manifest is what makes an image exist. Until it's written, the blobs are present and unreferenced.

### Which is where dangling blobs come from
An interrupted push leaves layers with nothing pointing at them. They're invisible to \`docker images\` on any client and they occupy real storage (§10).

### \`docker push\` pushes one tag
\`docker push acme/api\` without a tag pushes \`:latest\` only — not "all tags". Use \`--all-tags\` if you mean that, and prefer naming them.

### And a push is not a deploy
It makes the image *available*. Something still has to pull it — which is why a deploy pipeline is push, then tell something to pull, and the gap between those two is where "we deployed but nothing changed" lives.`,
  narration:
    "Push is the pull sequence in reverse with one addition, and the addition is a nice piece of protocol design. For each blob it's about to send, the client first issues a HEAD request: do you already have sha256 and this digest? If the registry says yes, the client skips it entirely. Only blobs the registry lacks are uploaded. So pushing a new version of your application to a registry that already holds the base image transfers your layers and nothing else — the same set-difference property as the pull, in the other direction. Then, after every blob is present, the client uploads the manifest. And that ordering is deliberate: the manifest is what makes the image exist as a thing you can pull. Until it's written, the blobs are there but nothing references them, so no client can discover them and no tag resolves to them. It's effectively a commit at the end of a transaction. Which is where a class of storage problem comes from. If a push is interrupted — the network drops, CI is cancelled, a runner is killed — you can be left with blobs uploaded and no manifest. Those blobs are unreferenced. They don't appear in any image listing, no client will ever fetch them, and they occupy real storage indefinitely. That's the garbage collection problem in section ten, and now you know how the garbage gets created. Two practical things. First, docker push with a repository and no tag does not push all the tags. It pushes the latest tag, and only that. People expect push to mean send everything I've tagged, and it means send this one reference. If you built an image and tagged it four ways — which section five will recommend — you need four pushes, or dash dash all-tags, or better, name each one explicitly so the command says what it does. Buildx with several dash t flags and dash dash push handles all of them in one operation, which is the cleaner modern answer. Second, and this is a conceptual point rather than a mechanical one: a push is not a deploy. It makes an image available. Something still has to pull it and start a container. Those are two separate events, possibly minutes or hours apart, possibly on a machine you're not watching. And the gap between them is where a specific failure lives: you push successfully, you see green, and nothing changes, because the thing that was supposed to pull didn't — it had the tag cached, or the restart policy didn't recreate the container, or the deployment was pointing at a different tag. If you take one habit from this: after a deploy, verify the digest that's actually running rather than trusting that a successful push meant a successful deploy. Docker inspect on the running container tells you its image digest, and comparing that to what you pushed settles it in one command. Next: which tags to push in the first place.",
}
