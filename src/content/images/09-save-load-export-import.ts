import type { Section } from '../types'

export const saveLoadExportImport: Section = {
  id: 'save-load-export-import',
  title: 'save/load vs export/import',
  scene: 'save-load',
  slide: `## Two pairs. They are not interchangeable.

### \`save\` / \`load\` — an **image**
\`docker save -o api.tar api:1.4\` writes every layer, the config and the history into one tar. \`docker load\` puts it back with **the same digests and tags**. This is the air-gap transfer, and how you move a build to a machine with no registry.

### \`export\` / \`import\` — a **container's filesystem**
\`docker export\` writes one **flat** tar of the merged filesystem. Three things are lost:

- **layers** — flattened to one, so nothing is shared any more
- **history** — no record of how anything got there
- **the config** — \`CMD\`, \`ENTRYPOINT\`, \`ENV\`, \`WORKDIR\`, all gone

So \`docker import\` gives you an image that starts and **does nothing**, because it has no command.

### When each is right
\`save\`/\`load\` for moving images — nearly always. \`export\` for getting a filesystem *out* to examine, or to seed an image whose config you supply yourself.`,
  narration:
    "Sometimes you need to move an image and there is no registry between you and the destination: an air-gapped environment, a customer site, a build machine with no outbound network. Docker has two pairs of commands that look like they both do this, and choosing the wrong one produces an image that starts up and does absolutely nothing, with an error message that explains none of it. So let's be precise. The first pair is save and load, and it operates on images. Docker save dash o, a filename, and an image reference writes a tar containing everything from section one: every layer blob, the config blob, the manifest, and the repository tags. Move that tar however you like — a USB stick, scp, a courier — and docker load dash i on the other side puts it back. And it is genuinely the same image: same digests, same layer ids, same tags, same history. If you run docker images afterwards it looks exactly as if you had pulled it. That is the property you want, and save-load is the right answer for essentially every case of moving an image around. The second pair is export and import, and it operates on containers. Docker export takes a container — running or stopped — and writes a tar of its filesystem. Not the layers: the merged result, flattened into one. And three things are lost in that flattening, each of which matters. The layers are gone, collapsed into a single blob, so the sharing that made images cheap is gone with them. Pull two images derived from a common base and you get one copy of the base; import two flattened tars from the same base and you get two full copies. The history is gone, so docker history on the result tells you nothing — you have an opaque filesystem with no record of how any of it got there, which is the same problem as docker commit from course two. And the config is gone. This is the one that produces the confusing failure. A container's filesystem is just files; the default command, the entrypoint, the environment variables, the working directory and the user all live in the image config, which is not part of the filesystem and so is not in the tar. Docker import gives you an image with an empty config. You run it, and it exits immediately, because there is no command to run. People conclude the export was corrupt. It wasn't — you can supply the missing config on the import with dash dash change, passing CMD and ENV and the rest, but you have to know to do it, and at that point you are hand-reconstructing metadata you already had. So when is export right? Two cases. The first is when you want a filesystem, not an image: you are doing forensics on a compromised container, or you want to extract a root filesystem for some other tool, and a flat tar is exactly the convenient thing. The second is deliberate flattening — taking an image with a hundred layers of accumulated history and squashing it, then supplying a fresh config. That is occasionally what you want, and it is an informed choice rather than an accident. The rule to remember: save and load for images, which is nearly always. Export for getting a filesystem out to look at. And if an imported image does nothing when you run it, you have not found a bug — you have found the missing config. One section left: let's put the course together.",
}
