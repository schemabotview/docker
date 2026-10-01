import type { Scene } from '@graphlearning/flow'

// §7 oci — why "Docker image" is now a misnomer, and why that is good news rather than pedantry.
// Three written specifications, each with many implementations, is the reason a Dockerfile build can
// be pulled by containerd, run by Podman, signed by cosign and scheduled by Kubernetes with nobody
// asking Docker's permission. The lesson is the SEAM: you learn Docker, you get the ecosystem.
//
// Three spec bands, each with its implementors beneath it, so the one-to-many relationship is the
// visible shape. The padding is 0.16 rather than the usual 0.08: at 0.08 three bands plus two edge
// labels filled the pane top to bottom and the scene ran under the eyebrow and the pager. Docker appears in all three rows, which is the honest picture — it is one
// implementation, and the one that wrote the originals.
export const ociSpecs: Scene = {
  id: 'oci-specs',
  padding: 0.16,
  nodes: [
    {
      id: 'oci',
      label: 'Open Container Initiative — three specs, many implementations',
      pattern: 'group',
      icon: 'scroll',
      flow: 'TB',
      children: [
        {
          id: 'image',
          label: 'image-spec — what an image IS',
          pattern: 'group',
          icon: 'package',
          flow: 'LR',
          children: [
            { id: 'i1', label: 'a manifest', pattern: 'network', icon: 'file', sub: 'lists the config + layer digests' },
            { id: 'i2', label: 'a config', pattern: 'network', icon: 'braces', sub: 'env, cmd, entrypoint, architecture' },
            { id: 'i3', label: 'layer blobs', pattern: 'storage', icon: 'layers', sub: 'gzipped tar diffs, content-addressed' },
          ],
          edges: [],
        },
        {
          id: 'runtime',
          label: 'runtime-spec — how to RUN a bundle',
          pattern: 'group',
          icon: 'power',
          flow: 'LR',
          children: [
            { id: 'r1', label: 'config.json', pattern: 'network', icon: 'braces', sub: 'namespaces, cgroups, mounts, caps' },
            { id: 'r2', label: 'runc', pattern: 'external', icon: 'gears', sub: 'the reference implementation' },
            { id: 'r3', label: 'crun · gVisor · Kata', pattern: 'external', icon: 'boxes', sub: 'others: faster, or stronger isolation' },
          ],
          edges: [],
        },
        {
          id: 'dist',
          label: 'distribution-spec — how to MOVE one',
          pattern: 'group',
          icon: 'warehouse',
          flow: 'LR',
          children: [
            { id: 'd1', label: '/v2/ HTTP API', pattern: 'network', icon: 'globe', sub: 'GET a manifest, GET blobs by digest' },
            { id: 'd2', label: 'Hub · ECR · GHCR', pattern: 'external', icon: 'cloud', sub: 'any registry that speaks it works' },
          ],
          edges: [],
        },
      ],
      edges: [
        { source: 'image', target: 'runtime', label: 'unpacked into a bundle' },
        { source: 'runtime', target: 'dist', label: 'pushed and pulled as blobs' },
      ],
    },
  ],
  edges: [],
}
