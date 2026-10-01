import type { Scene } from '@graphlearning/flow'

// §5/§6 — a tagging scheme that survives a rollback, and what pinning by digest costs. The table is
// the useful form because the question is always "which of these do I publish", and the answer is
// several at once, each serving a different reader.
export const tagScheme: Scene = {
  id: 'tag-scheme',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'Push several tags at the same digest — each serves a different reader',
      sub: 'docker buildx build -t a -t b -t c … — one build, one digest, many names',
      headers: ['Tag', 'Moves?', 'What it is for'],
      values: [
        ['1.4.2', 'never', 'the immutable one. What a rollback names'],
        ['1.4', 'on each patch', 'a human tracking a minor line'],
        ['1', 'on each minor', 'rarely useful, and commonly published'],
        ['git-9f2e1a4', 'never', 'the tag that answers "what is deployed?"'],
        ['latest', 'whenever', 'a default, not a promise (course 3 §3)'],
        ['@sha256:…', 'cannot', 'not a tag at all — what production should pin'],
      ],
    },
    {
      id: 'pin',
      label: 'Pinning by digest is a trade, not a free win',
      pattern: 'group',
      icon: 'scale',
      flow: 'LR',
      children: [
        { id: 'g1', label: 'you get reproducibility', pattern: 'service', icon: 'lock', sub: 'the same bytes, provably, months later' },
        { id: 'g2', label: 'you own the upgrade', pattern: 'warn', icon: 'clock', sub: 'no patch arrives on its own — that is the point' },
        { id: 'g3', label: 'so automate the bump', pattern: 'service', icon: 'repeat', sub: 'Renovate or Dependabot raises a PR with the new digest' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'table', target: 'pin' }],
}
