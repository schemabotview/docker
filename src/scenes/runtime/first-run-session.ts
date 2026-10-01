import type { Scene } from '@graphlearning/flow'

// §9 first-run — the first `docker run`, annotated so that every line maps onto a box in §6's chain
// and a primitive from §3–§5. Two runs, because they teach different things: hello-world shows the
// pull → create → start sequence and a process that EXITS, and the alpine run shows the container's
// own view of the world — pid 1, its own root filesystem, its own hostname — which is §3 made
// checkable at a prompt rather than asserted on a diagram.
//
// A standalone code card; the sequence is the content, so no diagram would add to it.
//
// The in-container prompt is written `/ $` rather than Alpine's real `/ #`: the code highlighter
// treats a `#` as a comment, so on the rendered frame every command inside the container greyed out
// while its output stayed bright — the inverse of what this scene is for. Nothing in the lesson
// turns on the prompt character.
export const firstRunSession: Scene = {
  id: 'first-run-session',
  title: 'docker run — and what each line of it means',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '$ docker run hello-world',
        'Unable to find image "hello-world:latest" locally   # no layers cached',
        'latest: Pulling from library/hello-world            # containerd pulls',
        'c1ec31eb5944: Pull complete                         # one layer blob',
        'Digest: sha256:7e1a4e2d11e2ac7726fa1f4b1b4a26b2f4b5d2...',
        'Hello from Docker!                                  # runc exec’d it',
        '',
        '$ docker ps          # nothing running — it printed and EXITED',
        'CONTAINER ID   IMAGE   COMMAND   STATUS   PORTS   NAMES',
        '',
        '$ docker ps -a       # still there, just not running',
        'CONTAINER ID   IMAGE         STATUS                     NAMES',
        '9c1f0a3e2b77   hello-world   Exited (0) 12 seconds ago   busy_pare',
        '',
        '$ docker run -it --rm alpine sh    # -it: keep stdin + a tty',
        '/ $ ps                             # §3: its OWN process view',
        'PID   USER     COMMAND',
        '    1 root     sh                  <- our shell IS pid 1 in here',
        '/ $ cat /etc/os-release | head -1   # §5: its OWN root filesystem',
        'NAME="Alpine Linux"                 <- on an Ubuntu host',
        '/ $ hostname                        # §3: its OWN uts namespace',
        '4f9c2a1b8e03                        <- the container id',
        '/ $ exit                            # --rm: removed on exit',
      ].join('\n'),
    },
  ],
  edges: [],
}
