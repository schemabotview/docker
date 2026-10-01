import type { Scene } from '@graphlearning/flow'

// §5 restart-policies — four words with genuinely different behaviour, and the difference that
// matters is not "does it restart" but "what happens after a HOST REBOOT". `always` brings the
// container back even if you had deliberately stopped it; `unless-stopped` remembers that you
// stopped it on purpose. That single distinction is the section.
//
// A table, because the content is a four-way comparison across three independent questions, which
// is exactly what a table is for and what a diagram would be worse at. The note beneath is the
// backoff, which is the part that makes a crash-looping container look "fine" in docker ps.
export const restartPolicies: Scene = {
  id: 'restart-policies',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'The four policies — and the column that decides which you want',
      sub: '--restart is set at run time; docker update --restart changes it on a live container',
      headers: ['--restart', 'Exits non-zero', 'Exits 0', 'After you docker stop it', 'After a host reboot'],
      values: [
        ['no (default)', 'stays down', 'stays down', 'stays down', 'stays down'],
        ['on-failure[:N]', 'restarts, up to N', 'stays down', 'stays down', 'restarts if it was running'],
        ['always', 'restarts', 'restarts', 'stays down — until the daemon restarts', 'ALWAYS comes back'],
        ['unless-stopped', 'restarts', 'restarts', 'stays down, and stays stopped', 'stays down — it remembers'],
      ],
    },
    {
      id: 'loop',
      label: 'A crash loop does not look like one',
      pattern: 'group',
      icon: 'repeat',
      // Side by side, not stacked: alone in a column each card was narrow enough that its label
      // wrapped to two lines, which left the sub no room and clipped its last word through the
      // bottom border. The linter's leaf-sub limit assumes a one-line label, so it passed.
      flow: 'LR',
      children: [
        {
          id: 'backoff',
          label: 'the backoff hides it',
          pattern: 'warn',
          icon: 'clock',
          sub: '100ms, 200ms, 400ms… doubling to 1 minute',
        },
        {
          id: 'tell',
          label: 'the tell is the status',
          pattern: 'network',
          icon: 'search',
          sub: 'docker ps says "Restarting (1)", not "Up"',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'table', target: 'loop' }],
}
