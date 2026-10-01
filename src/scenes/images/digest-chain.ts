import type { Scene } from '@graphlearning/flow'

// §3 content-addressing — the difference between a TAG and a DIGEST, drawn as what each one is.
// A digest is computed FROM the bytes, so it cannot be wrong and cannot be moved. A tag is a
// mutable pointer someone maintains, so `nginx:1.25` today and `nginx:1.25` next month may be
// different images — and `:latest` is just a tag with an unfortunate name, not a promise.
//
// Left: the one-way function. Right: the two ways to name the result, with the mutable one marked.
export const digestChain: Scene = {
  id: 'digest-chain',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'hash',
      label: 'A digest is computed from the bytes — nobody assigns it',
      pattern: 'group',
      icon: 'fingerprint',
      flow: 'LR',
      children: [
        { id: 'bytes', label: 'the manifest’s bytes', pattern: 'storage', icon: 'file', sub: 'every byte of it, exactly' },
        { id: 'fn', label: 'SHA-256', pattern: 'service', icon: 'sigma', sub: 'one way; change a byte, change the answer' },
        { id: 'dg', label: 'sha256:7e1a…', pattern: 'network', icon: 'fingerprint', sub: 'THE name of this image, everywhere, forever' },
      ],
      edges: [
        { source: 'bytes', target: 'fn' },
        { source: 'fn', target: 'dg' },
      ],
    },
    {
      id: 'names',
      label: 'Two ways to ask for it, and only one of them is a promise',
      pattern: 'group',
      icon: 'tag',
      flow: 'LR',
      children: [
        {
          id: 'bytag',
          label: 'nginx:1.25',
          pattern: 'warn',
          icon: 'tag',
          sub: 'a MUTABLE pointer — the publisher can move it tomorrow',
        },
        {
          id: 'bydigest',
          label: 'nginx@sha256:…',
          pattern: 'service',
          icon: 'lock',
          sub: 'immutable by construction — these bytes or nothing',
        },
      ],
      edges: [],
    },
    {
      id: 'latest',
      label: '“latest” is just a tag',
      pattern: 'warn',
      icon: 'circleslash',
      sub: 'not newest, not stable — only what someone last tagged',
    },
  ],
  edges: [
    { source: 'hash', target: 'names', label: 'both eventually resolve to that digest' },
    { source: 'names', target: 'latest' },
  ],
}
