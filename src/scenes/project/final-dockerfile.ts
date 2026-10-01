import type { Scene } from '@graphlearning/flow'

// §3/§4/§5 — the Dockerfile the capstone arrives at, with each line annotated by the course it came
// from. It is the single most useful artifact in the app: everything in eleven courses, on one
// screen, in the order you would actually write it.
export const finalDockerfile: Scene = {
  id: 'final-dockerfile',
  title: 'The Dockerfile, with every line’s provenance',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'Dockerfile',
      label: [
        '# syntax=docker/dockerfile:1                        # c5 §9',
        '',
        'FROM --platform=$BUILDPLATFORM node:20-slim AS build # c5 §7',
        'WORKDIR /app                                        # c4 §6',
        'COPY package*.json ./                               # c4 §11 manifest first',
        'RUN --mount=type=cache,target=/root/.npm \\           # c5 §4',
        '    --mount=type=secret,id=npmtoken \\               # c5 §5',
        '    NPM_TOKEN=$(cat /run/secrets/npmtoken) npm ci',
        'COPY . .                                            # c4 §11 source last',
        'RUN npm run build',
        '',
        'FROM node:20-slim                                   # c5 §3 new stage',
        'ENV NODE_ENV=production                             # c4 §7',
        'WORKDIR /app',
        'RUN adduser -u 10001 -D app                         # c10 §4',
        'COPY --from=build --chown=10001:10001 /app/dist ./dist',
        'COPY --from=build --chown=10001:10001 /app/node_modules ./node_modules',
        'USER 10001:10001                                    # c10 §2 the line',
        'EXPOSE 8080                                         # c4 §8 documentation',
        'HEALTHCHECK --start-period=30s CMD node healthz.js   # c4 §9',
        'CMD ["node", "dist/server.js"]                       # c4 §10 exec form',
      ].join('\n'),
    },
  ],
  edges: [],
}
