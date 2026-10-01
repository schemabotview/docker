import type { Section } from '../types'

export const copyVsAdd: Section = {
  id: 'copy-vs-add',
  title: 'COPY vs ADD',
  scene: 'copy-add',
  slide: `## \`ADD\` does two extra things. Both are surprises.

**\`COPY src dest\`** copies files from the build context. That's all it does, and that predictability is the reason to prefer it.

### What \`ADD\` adds
- **Auto-extracts local tar archives.** \`ADD app.tar.gz /opt/\` gives you a *directory*, not the file. Silently
- **Fetches URLs** — with no caching, no checksum verification, and it will *not* extract what it downloaded

For a URL you want \`RUN curl -fsSL … && echo "<sha> file" | sha256sum -c && …\` — fetch, **verify**, unpack, clean up, in one layer.

### Two \`COPY\` flags worth knowing
- \`--chown=10001:10001\` — ownership without a second \`RUN chown\`, which would **double** the size of what it touches
- \`--from=builder\` — copy from an earlier stage (course 5)

### The modern exception
\`ADD git@github.com:acme/lib.git /src\` clones a repo under BuildKit, properly cached. That one is genuinely useful.`,
  narration:
    "Two instructions that copy files in, and every style guide tells you to use COPY without quite saying why. The why is worth having, because ADD's extra behaviours are surprises rather than features. COPY takes a source in the build context and a destination in the image, and copies. That is the entire specification. Nothing is interpreted, nothing is transformed, nothing is fetched. The predictability is the feature. ADD does everything COPY does, and then two more things. The first: if the source is a local tar archive — a dot-tar, a dot-tar-dot-gz, a dot-tgz — ADD extracts it into the destination. It does not ask. So if you write ADD app dot tar dot gz slash opt slash expecting to copy the archive so you can unpack it later with a known flag set, what you actually get at slash opt is a directory tree. And the failure is downstream and confusing: some later step looks for the archive and finds a directory. The second: if the source looks like a URL, ADD downloads it. That sounds convenient and is worse than it sounds. There's no caching worth the name, so you re-download on every cache miss. There's no checksum verification, so you're trusting whatever the server returns today — which is a supply chain problem, not a convenience problem. And — this is the part that catches people — it does not extract what it downloads, even though it extracts local archives. So ADD of a URL to a tarball gives you a tarball, and ADD of a local tarball gives you a directory. Same instruction, opposite behaviour, depending on where the source came from. What you actually want for a URL is a RUN: curl with dash f so it fails on an HTTP error, then pipe the file through sha256sum dash c against a checksum you've written down, then unpack, then delete the archive, all joined with double-ampersands so it's one layer. That's longer, and it's longer because it does the verification that ADD skips. Two COPY flags are worth knowing now. Dash dash chown sets ownership as part of the copy. That matters more than it sounds, because the alternative — COPY and then RUN chown — creates a second layer containing a full copy of every file whose ownership changed. Chown modifies metadata, overlayfs copies the file up to do it, and your image doubles the size of whatever you touched. One flag avoids it entirely. Use a numeric uid, by the way, so it works on images with no passwd entry. And dash dash from lets COPY take its source from an earlier build stage rather than from the context, which is the mechanism multi-stage builds are made of, and that's the next course. Finally, one genuinely good modern use of ADD, because it would be unfair to leave you thinking it's all bad. Under BuildKit, ADD with a git URL clones a repository directly into the image, with proper cache handling. That's cleaner than a RUN with git and a credential dance. It's the exception that proves the rule: ADD's useful behaviours are the ones added deliberately in the BuildKit era, and its surprising ones are the ones inherited from 2013. Next: where those files are actually copied from, which is not where you think.",
}
