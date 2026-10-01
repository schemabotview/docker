import type { Scene } from '@graphlearning/flow'

// §2/§3/§11 — a realistic file, annotated. It is a transcript rather than a diagram because YAML
// shape IS the content here, and because the things worth pointing at (no `version:`, no published
// port on the database, the healthcheck that makes depends_on mean something) are all lines.
export const composeFile: Scene = {
  id: 'compose-file',
  title: 'compose.yaml — a realistic stack, annotated',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'compose.yaml',
      label: [
        'name: shop                 # pin the project name; do not rely on the dir',
        '',
        'services:',
        '  api:',
        '    build: .               # or `image:` — one or the other, or both',
        '    ports: ["127.0.0.1:8080:8080"]    # loopback only (c7 §5)',
        '    environment:',
        '      DATABASE_URL: postgres://app@db:5432/shop   # "db" = the SERVICE',
        '    depends_on:',
        '      db:',
        '        condition: service_healthy   # waits. Plain depends_on does not.',
        '    restart: unless-stopped',
        '',
        '  db:',
        '    image: postgres:16-alpine',
        '    # NO ports: — nothing outside Docker needs it (c7 §7)',
        '    environment:',
        '      POSTGRES_PASSWORD_FILE: /run/secrets/pgpw',
        '    secrets: [pgpw]',
        '    volumes: ["pgdata:/var/lib/postgresql/data"]',
        '    healthcheck:',
        '      test: ["CMD-SHELL", "pg_isready -U postgres -q"]',
        '      interval: 10s',
        '      start_period: 30s     # the option people omit (c4 §9)',
        '',
        'volumes:  { pgdata: {} }',
        'secrets:  { pgpw: { file: ./pgpw.txt } }',
      ].join('\n'),
    },
  ],
  edges: [],
}
