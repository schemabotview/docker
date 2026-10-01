import type { Scene } from '@graphlearning/flow'

// §2 the-pull (reused by §10 you-are-here) — the SPINE. A registry is an HTTP API over
// content-addressed blobs, and a pull is four GETs. Drawing the request sequence makes the two
// properties that matter visible rather than asserted: the client asks for exactly the blobs it
// lacks, and everything after the first request is addressed by digest, so nothing can be
// substituted.
export const registryPull: Scene = {
  id: 'registry-pull',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'seq',
      label: 'docker pull nginx:1.25 — four requests under /v2/',
      pattern: 'group',
      icon: 'workflow',
      flow: 'LR',
      children: [
        {
          id: 'q1',
          label: 'GET …/manifests/1.25',
          pattern: 'service',
          icon: 'tag',
          sub: 'by TAG — the only request not addressed by content',
        },
        {
          id: 'q2',
          label: 'an index comes back',
          pattern: 'network',
          icon: 'table',
          sub: 'pick the entry matching this platform (c3 §7)',
        },
        {
          id: 'q3',
          label: 'GET the config blob',
          pattern: 'network',
          icon: 'braces',
          sub: 'by digest — Env, Cmd, and the layer diff_ids',
        },
        {
          id: 'q4',
          label: 'GET only the missing layers',
          pattern: 'storage',
          icon: 'layers',
          sub: 'by digest, in parallel — what you already have is skipped',
        },
      ],
      edges: [
        { source: 'q1', target: 'q2' },
        { source: 'q2', target: 'q3' },
        { source: 'q3', target: 'q4' },
      ],
    },
    {
      id: 'props',
      label: 'Two properties fall out of that sequence',
      pattern: 'group',
      icon: 'brain',
      flow: 'LR',
      children: [
        {
          id: 'p1',
          label: 'transfer is a set difference',
          pattern: 'service',
          icon: 'funnel',
          sub: 'a rebuild on a cached base ships only the top layers',
        },
        {
          id: 'p2',
          label: 'and it is verifiable',
          pattern: 'service',
          icon: 'fingerprint',
          sub: 'every blob is checked against the digest that named it',
        },
        {
          id: 'p3',
          label: 'so the tag is the weak link',
          pattern: 'warn',
          icon: 'swap',
          sub: 'the one lookup a publisher can repoint (c3 §3)',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'seq', target: 'props' }],
}
