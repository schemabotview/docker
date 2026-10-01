import type { Scene } from '@graphlearning/flow'

// §6 the-engine-chain (reused by §11 you-are-here, and again in the `production` course) — the SPINE
// of this course. "Docker" is not one program; it is a chain of five, and knowing where each link
// sits answers the questions that otherwise look like magic: why `docker` works over SSH, why
// containers survive `systemctl restart docker` but not a host reboot without a restart policy, why
// mounting the socket is root, and why Kubernetes dropped dockerd while keeping containerd.
//
// Drawn as TWO BANDS rather than one left-to-right chain. The first attempt was one LR row of five,
// which laid out 2.4:1 in a square pane and therefore rendered at 11pt — the flat-ribbon failure
// scripts/frames.mjs exists to catch. The split is not just cosmetic: the seam between the bands is
// exactly the Docker/OCI seam, which is what §7 and the Kubernetes note both turn on.
//
// The edge labels are kept to one word or dropped: between two wide cards in a tight band a longer
// pill renders ON the card it points at, not in the gap. Anything they would have said is already
// in the `sub` beneath the card.
export const engineChain: Scene = {
  id: 'engine-chain',
  padding: 0.08,
  nodes: [
    {
      id: 'chain',
      label: '“Docker” is five programs — only the first is on your PATH',
      pattern: 'group',
      icon: 'workflow',
      flow: 'TB',
      children: [
        {
          id: 'control',
          label: 'Docker’s own half — the API you type at',
          pattern: 'group',
          icon: 'terminal',
          flow: 'LR',
          children: [
            {
              id: 'cli',
              label: 'docker (the CLI)',
              pattern: 'user',
              icon: 'terminal',
              sub: 'an HTTP client — it creates nothing itself',
            },
            {
              id: 'sock',
              label: 'docker.sock',
              pattern: 'network',
              icon: 'plug',
              sub: '/var/run/docker.sock — or a TCP or SSH endpoint',
            },
            {
              id: 'dockerd',
              label: 'dockerd (the daemon)',
              pattern: 'service',
              icon: 'gears',
              sub: 'the REST API: builds, images, networks, volumes',
            },
          ],
          edges: [
            { source: 'cli', target: 'sock', label: 'HTTP' },
            { source: 'sock', target: 'dockerd' },
          ],
        },
        {
          id: 'exec',
          label: 'The OCI half — what Kubernetes kept when it dropped dockerd',
          pattern: 'group',
          icon: 'box',
          flow: 'LR',
          children: [
            {
              id: 'containerd',
              label: 'containerd',
              pattern: 'service',
              icon: 'boxes',
              sub: 'pulls images, tracks every container’s lifecycle',
            },
            {
              id: 'shim',
              label: 'containerd-shim',
              pattern: 'service',
              icon: 'link',
              sub: 'one PER container; owns the pid and keeps it alive',
            },
            {
              id: 'runc',
              label: 'runc',
              pattern: 'external',
              icon: 'power',
              sub: 'sets namespaces + cgroups, execs — then exits',
            },
            {
              id: 'proc',
              label: 'your process · pid 1',
              pattern: 'network',
              icon: 'filecode',
              sub: 'an ordinary host process, just confined',
            },
          ],
          edges: [
            { source: 'containerd', target: 'shim' },
            { source: 'shim', target: 'runc', label: 'start' },
            { source: 'runc', target: 'proc', label: 'exec' },
          ],
        },
      ],
      edges: [{ source: 'control', target: 'exec', label: 'gRPC — create, then start' }],
    },
  ],
  edges: [],
}
