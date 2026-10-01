import type { Scene } from '@graphlearning/flow'

// §7 environment — four places an environment variable can come from, and they are not equal. The
// order is the section: the image's own ENV is the floor, --env-file layers over it, -e layers over
// that, and a bare `-e VAR` with no value pulls the value out of YOUR shell — which is how a laptop
// works and CI does not, because the variable was never set there.
//
// A stack read bottom-up, so "later wins" is the direction of travel, with the resolved value at
// the top. The bare-`-e` card is `warn` because it is the one that silently produces an empty
// string rather than an error.
export const envPrecedence: Scene = {
  id: 'env-precedence',
  padding: 0.1,
  nodes: [
    {
      id: 'stack',
      label: 'Four sources, lowest first — the last one to set a name wins',
      pattern: 'group',
      icon: 'layers',
      flow: 'BT',
      children: [
        {
          id: 'image',
          label: 'ENV in the image',
          pattern: 'storage',
          icon: 'package',
          sub: 'baked at build time — the floor, and always present',
        },
        {
          id: 'file',
          label: '--env-file .env',
          pattern: 'network',
          icon: 'file',
          sub: 'read by DOCKER, not by a shell: no quotes, no $expansion',
        },
        {
          id: 'flag',
          label: '-e LOG=debug',
          pattern: 'service',
          icon: 'pencil',
          sub: 'explicit on the command line — beats both below',
        },
        {
          id: 'passthru',
          label: '-e LOG  (no value)',
          pattern: 'warn',
          icon: 'circleslash',
          sub: 'takes it from YOUR shell — empty in CI, and no error',
        },
      ],
      edges: [
        { source: 'image', target: 'file', label: 'overrides' },
        { source: 'file', target: 'flag', label: 'overrides' },
        { source: 'flag', target: 'passthru', label: 'if the name repeats' },
      ],
    },
    {
      id: 'seen',
      label: 'What the process gets',
      pattern: 'group',
      icon: 'search',
      flow: 'LR',
      children: [
        { id: 'r1', label: 'docker exec c env', pattern: 'network', icon: 'terminal', sub: 'the live, resolved set' },
        { id: 'r2', label: 'docker inspect', pattern: 'network', icon: 'braces', sub: '.Config.Env — and anyone can read it' },
        { id: 'r3', label: 'so: no secrets here', pattern: 'warn', icon: 'key', sub: 'env is visible to every tool; security course' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'stack', target: 'seen', label: 'resolved once, at create time' }],
}
