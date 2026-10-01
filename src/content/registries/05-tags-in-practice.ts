import type { Section } from '../types'

export const tagsInPractice: Section = {
  id: 'tags-in-practice',
  title: 'Tags in practice',
  scene: 'tag-scheme',
  slide: `## Push several tags at one digest

One build, one digest, many names — each for a different reader.

- **\`1.4.2\`** — never moves. **What a rollback names.** Without it you cannot say "go back to what we ran on Tuesday"
- **\`1.4\`** — moves on each patch. For a human tracking a minor line
- **\`git-9f2e1a4\`** — never moves. The tag that answers *"what is actually deployed?"* Worth publishing on every build
- **\`latest\`** — a default, not a promise (course 3 §3)

\`\`\`bash
docker buildx build -t acme/api:1.4.2 -t acme/api:1.4 \\
  -t acme/api:git-$GIT_SHA --push .
\`\`\`

### The mistake
Publishing only a moving tag. Now "roll back to the previous version" has no name to refer to, because the only name you have already points at the broken build.

### And registries can enforce it
Most support **immutable tags** — once pushed, that tag cannot be moved. Turn it on for release tags.`,
  narration:
    "A tagging scheme is one of those things that costs nothing to get right at the start and is painful to retrofit. The core idea is that one build produces one digest, and you can point several tags at that same digest. They don't cost storage — they're pointers — and each one serves a different reader. Start with the one that matters most: an immutable version tag. One point four point two, and it never moves. Ever. That's what a rollback names. If your only tag is a moving one, then when a release breaks, go back to the previous version has no name to refer to — the name you have already points at the broken build, and the previous digest is something you'd have to dig out of a registry listing under pressure. An immutable tag per release is the single most valuable thing in this section. Then a moving minor tag, one point four, which you repoint on each patch release. That's a convenience for a human or a downstream project that wants patches but not features. It's genuinely useful and it is not what production should pin to. A commit tag — git dash and the short SHA — which also never moves. This one is underrated. It answers a question that comes up constantly and is otherwise surprisingly hard: what code is actually running right now. With a commit tag published on every build, you look at the running container's image reference and you have the commit. Without it you're correlating timestamps. Publish it on every build, including builds that aren't releases. And latest, which course three already dealt with: it's the default tag name, not a promise, and it points wherever it last pointed. Publish it if you like for convenience; never depend on it. And then the digest, which isn't a tag at all and is what production should actually pin. The build command is one line with several dash t flags and dash dash push, so all of those tags are created by one build against one digest. That's important: tagging the same image four times after the fact works too, but building once and tagging in the build is what guarantees they're the same bytes. Two more things. Most registries support immutable tags as a setting — once a tag is pushed it cannot be moved or overwritten. Turn that on for your release tag pattern. It converts a discipline that depends on everyone remembering into a rule the registry enforces, and it means a compromised CI credential can't silently replace the contents of a released version. And if you're publishing images other people consume, a tag is a promise you're making to strangers. Moving one point four point two to different bytes breaks reproducibility for everyone who pinned it, and they'll have no way to notice. The convention that a patch-level tag is immutable is widely assumed even where it isn't enforced, so breaking it is worse than useless. Next: the thing that isn't a tag.",
}
