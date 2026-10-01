import type { Scene } from '@graphlearning/flow'

// §4 lifecycle-and-exit-codes (reused by §11 you-are-here) — the SPINE of this course. Every
// command in it is a transition on this diagram, and the state people forget is `exited`: a
// container that has stopped still exists, still owns its writable layer, and still holds disk.
//
// Deliberately drawn as a straight line rather than a state machine with a loop back from `exited`
// to `running`. `docker start` does go backwards, and scripts/lint-scenes.mjs would reject the
// cycle — correctly, because the engine cannot draw one: it breaks an edge arbitrarily and the
// arrows end up pointing at nothing. The backwards moves are on the cards instead, which is also
// the honest reading: the normal life of a container is one pass, left to right.
export const lifecycleStates: Scene = {
  id: 'lifecycle-states',
  padding: 0.1,
  // The chain runs TOP TO BOTTOM and the table sits beside it. As one LR row of five states next to
  // a seven-row table the scene laid out 2.6:1 in a square pane and rendered at 11pt.
  flow: 'LR',
  nodes: [
    {
      id: 'life',
      label: 'One pass, top to bottom — and two places it can stall',
      pattern: 'group',
      icon: 'workflow',
      flow: 'TB',
      children: [
        {
          id: 'created',
          label: 'created',
          pattern: 'network',
          icon: 'file',
          sub: 'docker create — spec written, nothing running',
        },
        {
          id: 'running',
          label: 'running',
          pattern: 'service',
          icon: 'box',
          sub: 'pid 1 alive · docker start returns here',
        },
        {
          id: 'paused',
          label: 'paused',
          pattern: 'warn',
          icon: 'clock',
          sub: 'frozen by cgroup freezer · still holds memory',
        },
        {
          id: 'exited',
          label: 'exited',
          pattern: 'warn',
          icon: 'power',
          sub: 'pid 1 returned · STILL EXISTS, still holds disk',
        },
        {
          id: 'gone',
          label: 'removed',
          pattern: 'external',
          icon: 'trash',
          sub: 'docker rm · writable layer freed at last',
        },
      ],
      edges: [
        { source: 'created', target: 'running', label: 'docker start' },
        { source: 'running', target: 'paused', label: 'docker pause' },
        { source: 'paused', target: 'exited', label: 'unpause, then stop' },
        { source: 'running', target: 'exited', label: 'stop · kill · pid 1 returns' },
        { source: 'exited', target: 'gone', label: 'docker rm · --rm does it for you' },
      ],
    },
    {
      id: 'codes',
      kind: 'table',
      pattern: 'storage',
      label: 'Read the exit code first — four of them mean something specific',
      sub: 'docker ps -a shows it · docker inspect --format "{{.State.ExitCode}}" reads it exactly',
      headers: ['Code', 'What happened', 'Where to look'],
      values: [
        ['0', 'the process finished normally', 'nothing is wrong — it just ended'],
        ['1–125', "your program's own exit code", 'your application logs'],
        ['125', 'the docker run command itself was wrong', 'the flags, before the image name'],
        ['126', 'the command was found but is not executable', 'a missing +x, or a text file'],
        ['127', 'the command was not found in the image', 'a typo, or a shell that is not there'],
        ['137', 'SIGKILL — 128+9', 'MEMORY. The OOM killer, or stop timing out'],
        ['143', 'SIGTERM — 128+15', 'a clean docker stop it chose not to survive'],
      ],
    },
  ],
  edges: [{ source: 'life', target: 'codes' }],
}
