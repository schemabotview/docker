import type { Scene } from '@graphlearning/flow'

// §6/§12 — every dial from the course set on one real container, as a command. It is a transcript
// because the payoff of this course is literally a run invocation, and seeing all of it at once
// makes the point that none of the individual lines is difficult.
export const hardenedRun: Scene = {
  id: 'hardened-run',
  title: 'Every dial in this course, on one container',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '$ docker run -d --name api \\',
        '    --user 10001:10001 \\               # §4  not root',
        '    --cap-drop ALL \\                   # §5  then add back nothing',
        '    --security-opt no-new-privileges \\ # §6  setuid cannot regain it',
        '    --read-only \\                      # §6  the rootfs is immutable',
        '    --tmpfs /tmp:size=64m,mode=1777 \\  # §6  ...so give it a /tmp',
        '    --pids-limit 100 \\                 # c2 §6  no fork bomb',
        '    --memory 512m --cpus 1.5 \\         # c2 §6  a blast radius',
        '    -p 127.0.0.1:8080:8080 \\           # c7 §5  not the internet',
        '    --mount type=bind,src=/srv/cfg,dst=/cfg,ro \\   # c6 §7  read-only',
        '    acme/api@sha256:7e1a4e2d…          # c3 §3  pinned by digest',
        '',
        '# What that container can still do, if the app is fully compromised:',
        '#   read /cfg, write /tmp (64 MB of RAM), talk to its own networks,',
        '#   and use 1.5 cores. It cannot write its own filesystem, gain a',
        '#   capability, become root, fork without limit, or be reached from',
        '#   outside the host. None of those lines is difficult.',
        '',
        '# The one that undoes all of it:',
        '$ docker run --privileged …    # every capability, all devices, no seccomp',
      ].join('\n'),
    },
  ],
  edges: [],
}
