import type { Scene } from '@graphlearning/flow'

// §5/§10 — the commands, and the two that people do not know exist: a container can be attached to
// a second network while it is running, and `--network-alias` gives it extra DNS names, which is how
// you do blue/green behind one name without a load balancer.
export const netInspect: Scene = {
  id: 'net-inspect',
  title: 'Publishing, inspecting, and attaching at runtime',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '$ docker run -d -p 8080:80 nginx        # HOST:CONTAINER',
        '$ docker run -d -p 127.0.0.1:8080:80 nginx   # loopback only',
        '$ docker run -d -p 80 nginx             # host port chosen for you',
        '$ docker run -d -P nginx                # every EXPOSEd port (c4 §8)',
        '$ docker port <ct>                      # what did it actually get?',
        '80/tcp -> 0.0.0.0:49154',
        '',
        '$ docker network create appnet',
        '$ docker network inspect appnet --format \\',
        '    "{{range .Containers}}{{.Name}} {{.IPv4Address}}{{end}}"',
        'api 172.20.0.2/16  db 172.20.0.3/16',
        '',
        '# A container can join a SECOND network while running:',
        '$ docker network connect backend api      # api now has two NICs',
        '$ docker network disconnect backend api',
        '#   which is how a gateway container sits on a public and a',
        '#   private network at once, with nothing else bridging them.',
        '',
        '# Extra DNS names for the same container:',
        '$ docker run -d --network appnet --network-alias db \\',
        '    --network-alias primary postgres:16',
        '#   blue/green behind one name, with no load balancer involved',
      ].join('\n'),
    },
  ],
  edges: [],
}
