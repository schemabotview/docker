import type { Scene } from '@graphlearning/flow'

// §1 the-run-anatomy — `docker run` has a grammar, and the single most common early failure is
// putting a flag where the command goes. Everything BEFORE the image name configures the container
// and is read by Docker; everything AFTER it is argv for the process and Docker never looks at it.
// `docker run alpine -it` is not a typo Docker will correct — it runs alpine with the arguments
// "-it", which is a different thing entirely and usually an unhelpful error from the program.
//
// A transcript rather than a diagram: the content IS the token order, and a diagram of token order
// is just a worse transcript.
export const runAnatomy: Scene = {
  id: 'run-anatomy',
  title: 'docker run — and the line where Docker stops reading',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'bash',
      label: [
        '$ docker run -d --name api -p 8080:80 -e LOG=debug nginx -g "daemon off;"',
        '  ─────┬──── ───────────────┬──────────────────────  ──┬──  ──────┬──────',
        '       │                    │                          │          │',
        '       │        FLAGS: read by Docker.           IMAGE │          │',
        '       │        Configure the container.               │   ARGV: given to',
        '       │        Must come BEFORE the image.            │   the process.',
        '       │                                               │   Docker does NOT',
        '   the command                        the last thing   │   read these.',
        '                                      Docker parses  ──┘',
        '',
        '# The mistake that costs an afternoon:',
        '$ docker run alpine -it              # NOT interactive. Runs alpine',
        '                                   # argv ["-it"] -> sh: -it: not found',
        '$ docker run -it alpine              # this is the interactive one',
        '',
        '# Flags you will use every day, and what each one actually does:',
        '#   -d            detach: print the id and return; §2',
        '#   --name api    a stable name; without it you get "busy_pare"',
        '#   -p 8080:80    publish HOST:CONTAINER; §7 of the networking course',
        '#   -e LOG=debug  one env var; §7',
        '#   --rm          delete the container when it exits; §4',
      ].join('\n'),
    },
  ],
  edges: [],
}
