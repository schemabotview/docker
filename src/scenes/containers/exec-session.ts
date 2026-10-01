import type { Scene } from '@graphlearning/flow'

// §9 looking-inside — four commands, and the one idea underneath them: `docker exec` does not open
// a door into a box, it starts a NEW process and joins it to the existing container's namespaces.
// Which is why the new process sees the same filesystem and the same network, why killing it does
// not stop the container, and why `exec` fails on a container that has exited — there are no
// namespaces left to join.
//
// A transcript, with the distroless case at the end because that is the moment the technique stops
// working and people conclude the container is broken.
export const execSession: Scene = {
  id: 'exec-session',
  title: 'Four ways to look inside a running container',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '$ docker exec -it api sh     # a NEW process, joined to api’s namespaces',
        '/ $ ls /app                  # same filesystem the container sees',
        '/ $ exit                     # exits the shell; api keeps running',
        '',
        '$ docker inspect api --format "{{.State.Status}}"   # one field, exactly',
        'running',
        '$ docker inspect api --format "{{.State.ExitCode}}" # why it stopped',
        '$ docker inspect api | jq ".[0].Config.Env"         # or all of it',
        '',
        '$ docker top api             # its processes, as the HOST numbers them',
        'UID    PID    PPID   CMD',
        'root   4417   4390   nginx: master process',
        '#      ^^^^ the real host pid — §3 of the runtime course',
        '',
        '$ docker stats --no-stream api   # live cgroup accounting; §6',
        'NAME   CPU %   MEM USAGE / LIMIT   MEM %   NET I/O',
        'api    0.02%   12.4MiB / 512MiB    2.42%   1.2kB / 0B',
        '',
        '# When the image has no shell (distroless, scratch) exec has nothing to run:',
        '$ docker exec -it api sh',
        'OCI runtime exec failed: exec: "sh": executable file not found',
        '',
        '# Bring your own tools, into the SAME namespaces:',
        '$ docker run -it --pid container:api --net container:api nicolaka/netshoot',
      ].join('\n'),
    },
  ],
  edges: [],
}
