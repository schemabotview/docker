import type { Scene } from '@graphlearning/flow'

// §1 what-an-image-is (reused by §10 you-are-here, and forward into `registries`) — the SPINE of
// this course. There is no image file. An image is a small JSON manifest that lists, by digest, a
// config blob and some layer blobs. Every confusing thing later — why a tag can change under you,
// why a pull skips layers you already have, why you cannot edit an image — is this shape.
//
// Two bands: the documents on top, the blobs they point at underneath, so "the manifest is a list
// of digests" is the visible relationship rather than a claim.
export const imageAnatomy: Scene = {
  id: 'image-anatomy',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'docs',
      label: 'The manifest — a small JSON document, and the whole image',
      pattern: 'group',
      icon: 'scroll',
      flow: 'LR',
      children: [
        {
          id: 'manifest',
          label: 'manifest.json',
          pattern: 'service',
          icon: 'file',
          sub: 'mediaType, one config digest, a list of layer digests',
        },
        {
          id: 'config',
          label: 'the config blob',
          pattern: 'network',
          icon: 'braces',
          sub: 'Env, Cmd, Entrypoint, WorkingDir, User, architecture',
        },
      ],
      edges: [{ source: 'manifest', target: 'config', label: 'by digest' }],
    },
    {
      id: 'blobs',
      label: 'The layer blobs — gzipped tar diffs, each named by its own hash',
      pattern: 'group',
      icon: 'layers',
      flow: 'LR',
      children: [
        { id: 'b1', label: 'sha256:9f2e…', pattern: 'storage', icon: 'harddrive', sub: 'the base rootfs — 74 MB' },
        { id: 'b2', label: 'sha256:44c1…', pattern: 'storage', icon: 'boxes', sub: 'what apt-get added — 41 MB' },
        { id: 'b3', label: 'sha256:0b7a…', pattern: 'storage', icon: 'filecode', sub: 'what COPY added — 4 KB' },
      ],
      edges: [],
    },
    {
      id: 'note',
      // A lone leaf in a column is laid out narrow, so a two-line label leaves the sub too little
      // room and its last word clips through the border. Keep both short.
      label: 'No “image file” exists',
      pattern: 'warn',
      icon: 'circleslash',
      sub: 'blobs, plus a document listing them',
    },
  ],
  edges: [
    { source: 'docs', target: 'blobs', label: 'lists them, in order, by digest' },
    { source: 'blobs', target: 'note' },
  ],
}
