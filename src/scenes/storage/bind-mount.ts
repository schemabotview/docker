import type { Scene } from '@graphlearning/flow'

// §5 bind-mounts — the dev loop, and the two things that make it feel broken. A bind mount REPLACES
// whatever was at that path, so binding your source over /app also hides the node_modules the image
// installed — the classic "cannot find module" the first time anyone tries this. And on Desktop
// every read crosses a VM boundary, which is why the same project is fast on Linux and slow on a Mac.
export const bindMount: Scene = {
  id: 'bind-mount',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'loop',
      label: 'The dev loop: edit on the host, the container sees it at once',
      pattern: 'group',
      icon: 'repeat',
      flow: 'LR',
      children: [
        { id: 'edit', label: 'you save app.js', pattern: 'user', icon: 'pencil', sub: 'in your editor, on the host' },
        { id: 'host', label: './src on the host', pattern: 'external', icon: 'folder', sub: '-v $(pwd)/src:/app/src' },
        { id: 'inside', label: '/app/src in the container', pattern: 'service', icon: 'box', sub: 'the same inode — no copy, no rebuild' },
      ],
      edges: [
        { source: 'edit', target: 'host' },
        { source: 'host', target: 'inside', label: 'mounted, not copied' },
      ],
    },
    {
      id: 'hides',
      label: 'It REPLACES the path — which breaks node_modules every time',
      pattern: 'group',
      icon: 'warn',
      flow: 'LR',
      children: [
        { id: 'h1', label: 'image has node_modules', pattern: 'storage', icon: 'boxes', sub: 'installed into /app at build time, correctly' },
        { id: 'h2', label: '-v $(pwd):/app', pattern: 'warn', icon: 'ban', sub: 'your host /app has no node_modules — it is hidden' },
        { id: 'h3', label: 'add an anonymous volume', pattern: 'service', icon: 'circlecheck', sub: '-v /app/node_modules — keeps the image’s copy' },
      ],
      edges: [
        { source: 'h1', target: 'h2' },
        { source: 'h2', target: 'h3' },
      ],
    },
    {
      id: 'desktop',
      label: 'And on Mac or Windows every read crosses a VM boundary',
      pattern: 'group',
      icon: 'clock',
      flow: 'LR',
      children: [
        { id: 'd1', label: 'Linux: the same kernel', pattern: 'service', icon: 'zap', sub: 'a bind mount costs nothing at all' },
        { id: 'd2', label: 'Desktop: virtiofs', pattern: 'warn', icon: 'swap', sub: 'fine for a few files, painful for node_modules' },
        { id: 'd3', label: 'so bind the SOURCE only', pattern: 'network', icon: 'funnel', sub: 'leave dependencies and build output inside' },
      ],
      edges: [],
    },
  ],
  edges: [
    { source: 'loop', target: 'hides' },
    { source: 'hides', target: 'desktop' },
  ],
}
