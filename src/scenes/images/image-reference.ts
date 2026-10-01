import type { Scene } from '@graphlearning/flow'

// §4 image-references — the grammar, and the two defaults that make short names misleading. `nginx`
// is not a short name for a thing on Docker Hub in any principled sense; it expands to
// docker.io/library/nginx:latest, and the `library/` part is why `nginx` and `bitnami/nginx` are
// different repositories with different owners. Getting this wrong is how people pull an image
// nobody vetted.
//
// A transcript, because the content is literal string expansion.
export const imageReference: Scene = {
  id: 'image-reference',
  title: 'What a short image name actually expands to',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'text',
      label: [
        '  [registry]  /  [namespace] / name  :tag   OR  @sha256:digest',
        '  ──────────     ───────────   ────   ────       ─────────────',
        '   optional        optional            optional   beats the tag',
        '',
        '  nginx',
        '    -> docker.io / library / nginx : latest',
        '       ^^^^^^^^^   ^^^^^^^           ^^^^^^',
        '       default     "official" images  default tag',
        '',
        '  bitnami/nginx          -> docker.io/bitnami/nginx:latest',
        '                            a DIFFERENT repository, a different owner',
        '',
        '  ghcr.io/acme/api:1.4   -> no expansion: a dot or a colon in the',
        '                            first segment means it is a registry',
        '',
        '  localhost:5000/api     -> a local registry, not a namespace',
        '',
        '  nginx@sha256:7e1a4e2d11e2ac7726fa1f4b1b4a26b2f4b5d2ab…',
        '    -> exactly these bytes. A tag alongside it is ignored.',
      ].join('\n'),
    },
  ],
  edges: [],
}
