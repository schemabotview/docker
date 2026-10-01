import type { Scene } from '@graphlearning/flow'

// §6/§9 — buildx as the CLI and bake as the file. The point of bake is the same as the point of
// Compose: a long command line that has to be typed identically by a person and by CI is a command
// line that will drift. `# syntax=` is here too because it is the mechanism that makes Dockerfile
// features versionable independently of the Docker you have installed.
export const buildxBake: Scene = {
  id: 'buildx-bake',
  title: 'buildx, bake, and the syntax directive',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '$ docker buildx ls                  # builders, and what each can do',
        'NAME/NODE      DRIVER     PLATFORMS',
        'default        docker     linux/amd64',
        'multi *        docker-container  linux/amd64, linux/arm64',
        '',
        '$ docker buildx create --name multi --driver docker-container --use',
        '#   the docker driver cannot do multi-platform or export cache.',
        '#   docker-container can. This is why "buildx create" exists at all.',
        '',
        '# The command that works, and that nobody types the same way twice:',
        '$ docker buildx build --platform linux/amd64,linux/arm64 \\',
        '    --cache-from type=registry,ref=acme/api:cache \\',
        '    --cache-to   type=registry,ref=acme/api:cache,mode=max \\',
        '    --secret id=npmtoken,env=NPM_TOKEN \\',
        '    -t acme/api:1.4 --push .',
        '',
        '# Same thing, in a file, so CI and a laptop run it identically:',
        '#   docker-bake.hcl',
        '#     target "api" {',
        '#       platforms  = ["linux/amd64", "linux/arm64"]',
        '#       cache-from = ["type=registry,ref=acme/api:cache"]',
        '#       tags       = ["acme/api:1.4"]',
        '#     }',
        '$ docker buildx bake api --push',
      ].join('\n'),
    },
  ],
  edges: [],
}
