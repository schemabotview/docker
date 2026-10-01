import type { Scene } from '@graphlearning/flow'

// §8 configuration — three different things called "env" that people conflate, and the one that
// causes the most confusion: the top-level `.env` file is read by COMPOSE ITSELF to substitute
// ${VARS} in the YAML, and is NOT the container's environment. `env_file:` is the container's.
// Someone puts DATABASE_URL in .env, the service does not see it, and nothing explains why.
export const composeConfig: Scene = {
  id: 'compose-config',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'three',
      label: 'Three things called “env”, and they are not the same thing',
      pattern: 'group',
      icon: 'layers',
      flow: 'LR',
      children: [
        {
          id: 'dotenv',
          label: '.env (top level)',
          pattern: 'warn',
          icon: 'pencil',
          sub: 'read by COMPOSE, to substitute ${VARS} in the YAML itself',
        },
        {
          id: 'envfile',
          label: 'env_file: on a service',
          pattern: 'service',
          icon: 'file',
          sub: 'read into THAT container’s environment — what you usually mean',
        },
        {
          id: 'envkey',
          label: 'environment: on a service',
          pattern: 'service',
          icon: 'braces',
          sub: 'inline in the YAML, and it beats env_file',
        },
      ],
      edges: [],
    },
    {
      id: 'trap',
      label: 'The failure: DATABASE_URL in .env, and the service never sees it',
      pattern: 'group',
      icon: 'bug',
      flow: 'LR',
      children: [
        {
          id: 't1',
          label: 'it substituted nothing',
          pattern: 'warn',
          icon: 'circleslash',
          sub: 'no ${DATABASE_URL} appears anywhere in the YAML',
        },
        {
          id: 't2',
          label: 'and set nothing',
          pattern: 'warn',
          icon: 'ban',
          sub: '.env is not passed to containers — ever',
        },
        {
          id: 't3',
          label: 'settle it with config',
          pattern: 'service',
          icon: 'search',
          sub: 'docker compose config prints the FULLY resolved file',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'three', target: 'trap' }],
}
