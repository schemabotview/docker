import type { Scene } from '@graphlearning/flow'

// §3 the-file-shape (reused by §11 you-are-here) — the SPINE. What `docker compose up` actually
// creates, and the part that is implicit: a PROJECT, a network named after it, and a name prefix on
// every object. Almost every Compose surprise — why two checkouts collide, why `down` in the wrong
// directory does nothing, why a service is reachable by its service name — is that project scope.
export const composeProject: Scene = {
  id: 'compose-project',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'proj',
      label: 'Project “shop” — everything Compose creates is namespaced by it',
      pattern: 'group',
      icon: 'boxes',
      flow: 'TB',
      children: [
        {
          id: 'svcs',
          label: 'services — one container each, named shop-<service>-1',
          pattern: 'group',
          icon: 'box',
          flow: 'LR',
          children: [
            { id: 's1', label: 'web', pattern: 'service', icon: 'globe', sub: 'build: . · ports: 8080:80' },
            { id: 's2', label: 'api', pattern: 'service', icon: 'braces', sub: 'depends_on db, condition: service_healthy' },
            { id: 's3', label: 'db', pattern: 'storage', icon: 'database', sub: 'image: postgres:16 · no ports published' },
          ],
          edges: [
            { source: 's1', target: 's2' },
            { source: 's2', target: 's3' },
          ],
        },
        {
          id: 'net',
          label: 'network shop_default',
          pattern: 'network',
          icon: 'router',
          sub: 'made for you, and service names resolve on it (c7 §3)',
        },
        {
          id: 'vols',
          label: 'volume shop_pgdata',
          pattern: 'storage',
          icon: 'harddrive',
          sub: 'also prefixed, and removed only by compose down -v',
        },
      ],
      edges: [
        { source: 'svcs', target: 'net', label: 'all attached' },
        { source: 'net', target: 'vols' },
      ],
    },
    {
      id: 'name',
      label: 'The project name is the directory — which is where surprises come from',
      pattern: 'group',
      icon: 'tag',
      flow: 'LR',
      children: [
        { id: 'n1', label: 'two checkouts collide', pattern: 'warn', icon: 'swap', sub: 'both directories called “shop” → one project' },
        { id: 'n2', label: 'rename it, lose it', pattern: 'warn', icon: 'circleslash', sub: 'a new project; the old containers are orphaned' },
        { id: 'n3', label: 'so pin it', pattern: 'service', icon: 'lock', sub: 'name: shop at the top of the file, or -p' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'proj', target: 'name' }],
}
