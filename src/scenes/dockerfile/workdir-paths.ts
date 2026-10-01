import type { Scene } from '@graphlearning/flow'

// §6 workdir-and-paths — one instruction, and the single most common beginner bug in this course:
// `RUN cd /app` appears to work and does nothing, because each instruction runs in its own throwaway
// container (§1's loop) and the working directory is not part of the committed filesystem diff.
// The trailing-slash rule on COPY is the second: whether `dest` is a file or a directory changes
// what the copy means, and there is no error when you get it wrong.
export const workdirPaths: Scene = {
  id: 'workdir-paths',
  title: 'WORKDIR — and the cd that does nothing',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'Dockerfile',
      label: [
        '# WRONG — and it does not fail, it just quietly does not work',
        'RUN cd /app                 # this container is thrown away (§1)',
        'RUN npm ci                  # a NEW container, cwd is / again',
        '',
        '# RIGHT — WORKDIR persists into every later instruction',
        'WORKDIR /app                # also mkdir -p, if it does not exist',
        'RUN npm ci                  # runs in /app',
        'COPY . .                    # relative to /app, both sides',
        'CMD ["node", "server.js"]   # and so does the container at runtime',
        '',
        '# WORKDIR is relative to the one before it:',
        'WORKDIR /app',
        'WORKDIR src                 # now /app/src',
        '',
        '# The trailing slash on the DESTINATION changes the meaning:',
        'COPY app.js /opt/x          # /opt/x is a FILE (x, containing app.js)',
        'COPY app.js /opt/x/         # /opt/x is a DIRECTORY -> /opt/x/app.js',
        'COPY src/ /opt/x/           # contents of src/, NOT the directory',
        '',
        '# And the source side is relative to the build context, always:',
        'COPY ./src /app/src         # fine',
        'COPY /etc/hosts /app/       # NOT the host is /etc/hosts — the context',
      ].join('\n'),
    },
  ],
  edges: [],
}
