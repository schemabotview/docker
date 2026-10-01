import type { Scene } from '@graphlearning/flow'

// §5 the-everyday-commands — six of them, and the two distinctions that cost people data or time:
// `down` vs `stop` (down REMOVES, and `down -v` takes the volumes with it), and `run` vs `exec`
// (run makes a NEW container, which is why `compose run` leaves them lying around).
export const composeCommands: Scene = {
  id: 'compose-commands',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'The everyday six — and what each one actually destroys',
      sub: 'all of them act on the PROJECT, so the directory you are in matters',
      headers: ['Command', 'Does', 'Leaves behind'],
      values: [
        ['up -d', 'create + start everything, in dependency order', 'containers, the network, volumes'],
        ['stop', 'stop the containers', 'everything — they can be started again'],
        ['down', 'stop AND REMOVE containers + the network', 'volumes. Your data is safe'],
        ['down -v', 'the above, and REMOVES THE VOLUMES', 'nothing. This is the one that deletes data'],
        ['logs -f api', 'follow one service’s logs', '—'],
        ['exec api sh', 'a shell in the RUNNING container', '—'],
        ['run --rm api sh', 'a NEW throwaway container', 'without --rm: a stopped container, every time'],
      ],
    },
    {
      id: 'note',
      label: 'up is idempotent, and that is the point',
      pattern: 'group',
      icon: 'repeat',
      flow: 'LR',
      children: [
        { id: 'n1', label: 'it reconciles', pattern: 'service', icon: 'circlecheck', sub: 'recreates only what the file says has changed' },
        { id: 'n2', label: '--build forces a rebuild', pattern: 'network', icon: 'workflow', sub: 'up alone reuses an existing image, even a stale one' },
        { id: 'n3', label: '--remove-orphans', pattern: 'network', icon: 'trash', sub: 'cleans up services you deleted from the file' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'table', target: 'note' }],
}
