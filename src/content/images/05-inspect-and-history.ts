import type { Section } from '../types'

export const inspectAndHistory: Section = {
  id: 'inspect-and-history',
  title: 'Reading an image backwards',
  scene: 'history-read',
  slide: `## \`docker history\` recovers the Dockerfile

Every layer records the command that created it, in the config blob, in **plain text**. Newest first.

### Two readings of one output
- **\`SIZE\`** — which instruction cost you the megabytes. Almost always one \`RUN\`
- **\`CREATED BY\`** — the Dockerfile itself, recovered

### Which means it travels
\`ARG NPM_TOKEN=ghp_…\` is **in the image**, readable by anyone who can pull it — even if a later step deleted the file it was written to. A build secret passed as \`ARG\` is a published secret (course 5 has the fix).

### \`<missing>\` is not corruption
Only the top layer of a **pulled** image keeps a local id. The rest show \`<missing>\` — the layers are entirely present.

### \`inspect\` for one field
\`docker image inspect --format '{{.Config.Cmd}}'\` · \`'{{.RootFS.Layers}}'\` — the raw JSON is hundreds of lines.`,
  narration:
    "Here's a genuinely useful skill: taking an image nobody documented and recovering how it was built. Docker history does it. When a build runs, each instruction produces a layer, and the command that produced it is recorded — in the config blob, in plain text, as part of the image. Docker history prints that record, newest layer first. Use it with dash dash no-trunc, because the default truncates exactly the part you want, and with a format string to get just size and command, because the default columns are mostly noise. Now, there are two completely different readings of the same output, and both are worth having. The first is the size column, and this is how you find out why your image is eight hundred megabytes. Go down the list and the answer is almost always a single RUN instruction — an apt-get, an npm install, a pip install — sitting there at a few hundred megabytes while everything else is measured in kilobytes. Metadata instructions like CMD, ENV and WORKDIR are zero bytes; they change the config, not the filesystem. So optimising an image is not a general hunt: it is finding the one or two fat layers and dealing with those. The second reading is the created-by column, which is the Dockerfile, recovered. Every RUN, every COPY, every ENV, in order. You can take an image you were handed with no source and reconstruct what it does. And that brings us to the consequence that its author may not have intended. Look at the ARG line in the transcript: ARG NPM_TOKEN equals a GitHub token. Somebody passed a private-registry credential into the build so npm could install a private package. It worked. And it is now in the image, in the history, in plain text, for anyone who can pull that image. This is worth being precise about, because people get it half right. Deleting the file you wrote the token into does not help — that's the whiteout problem from section two, and the earlier layer still has it. Using ARG rather than ENV does not help either, because ARG values are recorded in the build history exactly like everything else. It is not a matter of being careful with the token; the mechanism records it, and the only fix is not to pass secrets this way at all. BuildKit has a proper answer — mount type secret — and that's a section in course five. For now: if you have ever passed a token as a build argument, assume that token is public and rotate it. Two smaller things. First, docker history often shows the word missing in angle brackets in the ID column, and it looks like corruption or a broken image. It isn't. When you pull an image, only the top layer keeps an identifier locally; the intermediate ones exist as blobs with content addresses but have no local image id, so Docker prints missing. Every layer is present. Second, docker image inspect gives you the whole config as JSON, and the raw output is hundreds of lines nobody reads. The useful form is with dash dash format and a template pulling out one thing: Config dot Cmd to see the default command, Config dot Entrypoint, Config dot Env, or RootFS dot Layers to get the ordered list of diff_ids. Two or three of those templates will serve you for years. Next: why docker images adds up to more disk than you actually have.",
}
