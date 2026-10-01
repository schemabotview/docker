import type { Scene } from '@graphlearning/flow'

// §8 install — a transcript, not a diagram, because the thing worth showing is the four commands
// that prove the install is real and the ONE line of `docker info` that tells you which of the five
// programs from §6 you are actually talking to. `docker context` is here deliberately: the CLI is an
// HTTP client, so "am I on the right machine?" is a question you must be able to answer, and it is
// the reason a command can succeed against the wrong host entirely.
//
// A single standalone code card, so NO `hug` — it IS the scene, and the width floor is what renders
// its type at the deck-wide size.
export const installSession: Scene = {
  id: 'install-session',
  title: 'Prove the install, then prove which engine you reached',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '$ curl -fsSL https://get.docker.com | sh    # Linux: Engine, not Desktop',
        '',
        '$ sudo usermod -aG docker $USER              # then log out and back in',
        '$ docker version                             # TWO versions, not one',
        'Client: Docker Engine - Community',
        ' Version:    28.1.1',
        'Server: Docker Engine - Community             <- the daemon answered',
        ' Engine:  28.1.1',
        ' containerd:  1.7.27                          <- §6’s chain, listed',
        ' runc:        1.2.5',
        '',
        '$ docker context ls          # WHICH engine is "the server"?',
        'NAME        DESCRIPTION                     DOCKER ENDPOINT',
        'default *   Current DOCKER_HOST based cfg   unix:///var/run/docker.sock',
        'prod-eu     staging box                     ssh://deploy@10.0.4.8',
        '',
        '$ docker context use prod-eu   # same CLI, a different machine entirely',
        '$ docker info | grep -i "storage driver"',
        ' Storage Driver: overlay2        <- §5’s union filesystem, named',
      ].join('\n'),
    },
  ],
  edges: [],
}
