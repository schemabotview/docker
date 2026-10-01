import type { Scene } from '@graphlearning/flow'

// §9 profiles-and-overrides — two mechanisms for "one stack, several environments", and they solve
// different halves. A profile turns whole services on and off. An override file changes the
// settings of services that are already there. The merge rule is the part people get wrong: maps
// merge key by key, but LISTS REPLACE wholesale — so an override's `ports:` wipes the base's rather
// than adding to it.
export const profilesOverrides: Scene = {
  id: 'profiles-overrides',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'two',
      label: 'Two mechanisms, two different jobs',
      pattern: 'group',
      icon: 'gitbranch',
      flow: 'LR',
      children: [
        {
          id: 'prof',
          label: 'profiles — which services exist',
          pattern: 'group',
          icon: 'funnel',
          flow: 'TB',
          children: [
            { id: 'p1', label: 'profiles: [debug]', pattern: 'network', icon: 'tag', sub: 'the service is INERT unless the profile is on' },
            { id: 'p2', label: '--profile debug', pattern: 'service', icon: 'terminal', sub: 'or COMPOSE_PROFILES in the environment' },
            { id: 'p3', label: 'for: seeders, tools', pattern: 'network', icon: 'wrench', sub: 'a mailhog, a migration runner, a load generator' },
          ],
          edges: [
            { source: 'p1', target: 'p2' },
            { source: 'p2', target: 'p3' },
          ],
        },
        {
          id: 'ovr',
          label: 'override files — how they are configured',
          pattern: 'group',
          icon: 'layers',
          flow: 'TB',
          children: [
            { id: 'o1', label: 'the override file', pattern: 'network', icon: 'file', sub: 'compose.override.yaml — picked up automatically' },
            { id: 'o2', label: '-f base -f prod', pattern: 'service', icon: 'merge', sub: 'explicit, left to right; naming one disables the auto pickup' },
            { id: 'o3', label: 'for: dev vs prod', pattern: 'network', icon: 'swap', sub: 'bind mounts and a debug port in dev, neither in prod' },
          ],
          edges: [
            { source: 'o1', target: 'o2' },
            { source: 'o2', target: 'o3' },
          ],
        },
      ],
      edges: [],
    },
    {
      id: 'merge',
      label: 'The merge rule that catches everyone',
      pattern: 'group',
      icon: 'warn',
      flow: 'LR',
      children: [
        { id: 'm1', label: 'maps MERGE, key by key', pattern: 'service', icon: 'circlecheck', sub: 'environment: adds to the base’s, as you expect' },
        { id: 'm2', label: 'lists REPLACE, wholesale', pattern: 'warn', icon: 'swap', sub: 'ports: in an override WIPES the base’s list' },
        { id: 'm3', label: 'so print it', pattern: 'network', icon: 'search', sub: 'docker compose -f a -f b config — the resolved truth' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'two', target: 'merge' }],
}
