import type { Scene } from '@graphlearning/flow'

// §2/§3 — the two defaults that do the most damage, drawn together because they are the same
// mistake at two scales. uid 0 inside IS uid 0 outside: the namespace does not remap it unless you
// turn user namespaces on. And the docker socket is not "access to Docker" — it is a root shell on
// the host, one API call away, and the call is short enough to fit on a slide.
export const rootAndSocket: Scene = {
  id: 'root-and-socket',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'uid',
      label: 'The default user is root, and that root is the host’s root',
      pattern: 'group',
      icon: 'usercheck',
      flow: 'LR',
      children: [
        { id: 'u1', label: 'uid 0 in the container', pattern: 'warn', icon: 'user', sub: 'no USER line, so every image defaults here' },
        { id: 'u2', label: 'is uid 0 on the host', pattern: 'warn', icon: 'server', sub: 'the pid namespace remaps pids — NOT uids' },
        { id: 'u3', label: 'so a bind mount is writable', pattern: 'warn', icon: 'folder', sub: 'anything mounted in, it can rewrite as root' },
      ],
      edges: [
        { source: 'u1', target: 'u2' },
        { source: 'u2', target: 'u3' },
      ],
    },
    {
      id: 'sock',
      label: 'And mounting the socket is not “access to Docker”',
      pattern: 'group',
      icon: 'plug',
      flow: 'LR',
      children: [
        {
          id: 'k1',
          label: 'mounting the socket',
          pattern: 'warn',
          icon: 'plug',
          sub: 'the CI helper, the dashboard, the auto-updater — all of them',
        },
        {
          id: 'k2',
          label: 'it can ask for a container',
          pattern: 'warn',
          icon: 'terminal',
          sub: 'privileged, with / bind-mounted, running whatever it likes',
        },
        {
          id: 'k3',
          label: 'which is a root shell',
          pattern: 'warn',
          icon: 'skull',
          sub: 'not similar to root on the host. Equal to it.',
        },
      ],
      edges: [
        { source: 'k1', target: 'k2' },
        { source: 'k2', target: 'k3' },
      ],
    },
    {
      id: 'fix',
      label: 'Two fixes, and neither is exotic',
      pattern: 'group',
      icon: 'circlecheck',
      flow: 'LR',
      children: [
        { id: 'f1', label: 'USER 10001 (c4 §8)', pattern: 'service', icon: 'circlecheck', sub: 'one line, and the single highest-value one' },
        { id: 'f2', label: 'a socket proxy', pattern: 'service', icon: 'funnel', sub: 'if something truly needs the API, give it read-only paths' },
      ],
      edges: [],
    },
  ],
  edges: [
    { source: 'uid', target: 'sock' },
    { source: 'sock', target: 'fix' },
  ],
}
