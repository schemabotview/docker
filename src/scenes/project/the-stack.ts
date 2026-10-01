import type { Scene } from '@graphlearning/flow'

// §1 the-brief (reused by §10 shipped) — the SPINE of the capstone. A deliberately ordinary stack,
// because the point is not the application: it is that every decision in the previous eleven
// courses shows up on something this normal. The constraints are stated up front so each later
// section can be checked against them.
export const theStack: Scene = {
  id: 'the-stack',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'app',
      label: 'The thing we are containerising — deliberately ordinary',
      pattern: 'group',
      icon: 'boxes',
      flow: 'LR',
      children: [
        { id: 'proxy', label: 'Caddy', pattern: 'network', icon: 'router', sub: 'TLS and routing — the only thing published' },
        { id: 'api', label: 'a Node API', pattern: 'service', icon: 'braces', sub: 'native deps, a build step, and an npm private dep' },
        { id: 'db', label: 'Postgres 16', pattern: 'storage', icon: 'database', sub: 'a volume, and a password that must not be in the env' },
        { id: 'cache', label: 'Redis', pattern: 'storage', icon: 'memory', sub: 'no persistence needed — the easy one' },
      ],
      edges: [
        { source: 'proxy', target: 'api' },
        { source: 'api', target: 'db' },
        { source: 'api', target: 'cache' },
      ],
    },
    {
      id: 'constraints',
      label: 'The constraints, up front — every section is checked against them',
      pattern: 'group',
      icon: 'ruler',
      flow: 'LR',
      children: [
        { id: 'c1', label: 'small, and measured', pattern: 'network', icon: 'ruler', sub: 'a number at every step, not “it got smaller”' },
        { id: 'c2', label: 'rebuilds in seconds', pattern: 'network', icon: 'zap', sub: 'on a code edit, and on a cold CI runner' },
        { id: 'c3', label: 'non-root, no caps', pattern: 'network', icon: 'shieldcheck', sub: 'read-only rootfs, secret as a file' },
        { id: 'c4', label: 'amd64 and arm64', pattern: 'network', icon: 'cpu', sub: 'built in CI, pushed by digest' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'app', target: 'constraints' }],
}
