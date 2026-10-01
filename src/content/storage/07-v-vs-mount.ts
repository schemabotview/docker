import type { Section } from '../types'

export const vVsMount: Section = {
  id: 'v-vs-mount',
  title: '-v vs --mount',
  scene: 'tmpfs-and-syntax',
  slide: `## One of them invents what's missing

\`-v\` infers the mount type from the **shape** of the first field:

- a **name** → named volume · a **path** → bind mount · **neither** → anonymous volume

Which means a typo'd host path is not an error. \`-v /srv/dta:/data\` **creates** \`/srv/dta\`, empty, and your database starts perfectly with no data in it.

\`\`\`bash
--mount type=bind,src=/srv/dta,dst=/data
Error: bind source path does not exist
\`\`\`

### That's the whole argument
\`-v\` is compact and fine for development, where a wrong mount is obvious in seconds. \`--mount\` is explicit and fails loudly, which is what you want anywhere a wrong mount is **silent**.

In Compose the long form is the same trade, written out in YAML (course 8).

### Also \`--mount\`-only
Volume driver options, tmpfs sizing, and \`bind-propagation\`.`,
  narration:
    "Two syntaxes that do the same three things, and the usual advice is use dash dash mount because it's more explicit, which is true and unconvincing until you see the specific failure. Dash v takes a single colon-separated string and works out what you meant from the shape of the first field. If it looks like a name — letters, digits, underscores — you get a named volume. If it looks like a path, starting with a slash or a dot, you get a bind mount. If there's only one field, you get an anonymous volume. It's compact, it's what every tutorial uses, and it's fine most of the time. Dash dash mount takes comma-separated key-value pairs: type, src, dst, and options like ro. It's much longer and it says exactly what it means. Now the difference that matters, and it's not verbosity. Write dash v with a host path that has a typo in it — slash srv slash d-t-a instead of slash srv slash d-a-t-a. Dash v sees something path-shaped, decides it's a bind mount, notices the directory doesn't exist, and creates it. As root, empty. Your container starts. Postgres finds an empty data directory, concludes this is a fresh install, initialises a brand-new empty database, and reports itself healthy. Your application connects successfully and finds no data. Nothing errored. Nothing warned. If this is production and something else is writing to that new empty database, you now have a split-brain problem that will take a day to untangle. The same command with dash dash mount fails immediately: bind source path does not exist. You fix the typo and move on with your afternoon. That's the whole argument, and it's a good one: dash v optimises for brevity in a situation where being wrong is loud, and dash dash mount optimises for failing loudly in a situation where being wrong is silent. Development is the first situation — you'd notice within seconds. Production, deploy scripts, and anything running unattended is the second. So a reasonable rule: dash v when you're typing interactively and will see the result, dash dash mount in anything committed to a repository. And there's a second reason to know dash dash mount exists: some options are only available there. Volume driver options, for putting a volume on NFS or a cloud disk. Tmpfs sizing in the dash dash mount form. Bind propagation settings, which you'll need roughly once and will be very glad exist when you do. One more thing worth flagging, because it's a variant of the same trap. Dash v with a single path and no colon creates an anonymous volume: a real volume with a random hexadecimal name, holding real data, that you cannot identify later. These accumulate. A machine that's been running containers for a year can have hundreds, holding gigabytes, and there's no way to tell from the name which container created which. Docker volume ls with dash f dangling equals true lists the ones nothing references, which is the closest thing to a cleanup path. Better not to make them: name your volumes. We'll see the same syntax choice again in Compose, where both forms exist in YAML and the long one is a nested block. Next: the failure that isn't Docker's fault at all.",
}
