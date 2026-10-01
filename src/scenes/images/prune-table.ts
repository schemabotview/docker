import type { Scene } from '@graphlearning/flow'

// §8 pruning — the commands are easy and the semantics are not, because "unused" means something
// different in each one and `-a` changes it again. The specific danger is `docker system prune -a`
// on a host where a stopped container was the only thing keeping an image, or where a volume holds
// a database. A table, because this is a comparison of what each command's definition of "unused"
// actually covers.
export const pruneTable: Scene = {
  id: 'prune-table',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'warn',
      label: 'What each prune deletes — and what “unused” means in each one',
      sub: 'add --filter "until=168h" to keep anything touched in the last week',
      headers: ['Command', 'Deletes', 'The catch'],
      values: [
        ['docker image prune', 'dangling images only — untagged, unreferenced', 'safe; frees less than you hoped'],
        ['docker image prune -a', 'every image no CONTAINER uses', 'a stopped container counts as a user'],
        ['docker container prune', 'all stopped containers', 'their writable layers go with them'],
        ['docker builder prune', 'the BuildKit cache', 'the next build is slow, nothing is lost'],
        ['docker volume prune', 'volumes no container references', 'THIS IS YOUR DATABASE. Read it twice.'],
        ['docker system prune', 'containers + networks + dangling images + cache', 'not volumes, unless you add --volumes'],
        ['docker system prune -a --volumes', 'essentially everything not running', 'the one that ends careers'],
      ],
    },
    {
      id: 'first',
      label: 'Where the disk actually is',
      pattern: 'group',
      icon: 'search',
      flow: 'LR',
      children: [
        { id: 'df', label: 'docker system df -v', pattern: 'service', icon: 'barchart', sub: 'per-object sizes and a RECLAIMABLE column' },
        { id: 'ps', label: 'docker ps -a', pattern: 'network', icon: 'boxes', sub: 'stopped containers hold writable layers' },
        { id: 'bc', label: 'the build cache', pattern: 'network', icon: 'workflow', sub: 'often the single largest item on a CI host' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'first', target: 'table', label: 'look first, then prune' }],
}
