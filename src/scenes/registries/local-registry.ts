import type { Scene } from '@graphlearning/flow'

// §7/§8 — running one, and the mirror that fixes rate limits and air-gapped builds. Two commands
// and one daemon.json setting, because the useful content here is that this is genuinely small:
// the registry is one container, and a pull-through cache is the same container with a flag.
export const localRegistry: Scene = {
  id: 'local-registry',
  title: 'A registry of your own, in two commands',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '# 1 — a plain registry. That is the whole installation.',
        '$ docker run -d -p 5000:5000 -v regdata:/var/lib/registry \\',
        '    --restart unless-stopped --name registry registry:2',
        '',
        '$ docker tag myapp:1.4 localhost:5000/myapp:1.4',
        '$ docker push localhost:5000/myapp:1.4',
        '#   "localhost:5000" is a REGISTRY because of the colon (c3 §4)',
        '',
        '# 2 — a pull-through cache: the same image, one config file.',
        '#   config.yml:  proxy: { remoteurl: https://registry-1.docker.io }',
        '$ docker run -d -p 5001:5000 -v mirror:/var/lib/registry \\',
        '    -v ./config.yml:/etc/docker/registry/config.yml registry:2',
        '',
        '#   then tell the daemon to use it, in /etc/docker/daemon.json:',
        '#     { "registry-mirrors": ["http://10.0.0.5:5001"] }',
        '#   every docker pull now goes through it. Rate limits, solved.',
        '',
        '# The two things that will bite you:',
        '#   TLS — the daemon refuses plain HTTP except for "localhost".',
        '#         Give it a certificate, or list it in insecure-registries.',
        '#   AUTH — registry:2 has NONE by default. Anyone who can reach',
        '#          port 5000 can push. Put a proxy with auth in front.',
      ].join('\n'),
    },
  ],
  edges: [],
}
