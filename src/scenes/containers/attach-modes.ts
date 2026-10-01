import type { Scene } from '@graphlearning/flow'

// §2 foreground-detached — what `-d`, `-i` and `-t` actually connect. They are not a mode switch;
// each one is a decision about ONE stream. -i keeps the container's stdin open and wired to yours;
// -t allocates a pseudo-terminal so the program believes it is talking to a human; -d detaches
// everything and returns. The reason to draw it is that the three combinations people type without
// thinking — nothing, -d, -it — are three different wirings, and the failures are stream failures:
// a program that exits instantly because stdin closed, or one with no colour and no line editing.
//
// Three columns, one per mode, each showing what is connected to what. padding 0.15 rather than the
// usual 0.09: the -it column is four cards deep, so at 0.09 the scene ran under the eyebrow and the
// pager.
export const attachModes: Scene = {
  id: 'attach-modes',
  padding: 0.15,
  nodes: [
    {
      id: 'modes',
      label: 'Three wirings between your terminal and pid 1',
      pattern: 'group',
      icon: 'plug',
      flow: 'LR',
      children: [
        {
          id: 'fg',
          label: 'default — attached',
          pattern: 'group',
          icon: 'monitor',
          flow: 'TB',
          children: [
            { id: 'fg-t', label: 'your terminal', pattern: 'user', icon: 'terminal', sub: 'blocked until it exits' },
            { id: 'fg-o', label: 'stdout + stderr', pattern: 'network', icon: 'file', sub: 'streamed to you live' },
            { id: 'fg-p', label: 'pid 1', pattern: 'service', icon: 'box', sub: 'Ctrl-C sends SIGINT to it' },
          ],
          edges: [
            { source: 'fg-t', target: 'fg-o' },
            { source: 'fg-o', target: 'fg-p' },
          ],
        },
        {
          id: 'det',
          label: '-d — detached',
          pattern: 'group',
          icon: 'gitbranch',
          flow: 'TB',
          children: [
            { id: 'd-t', label: 'your terminal', pattern: 'user', icon: 'terminal', sub: 'prints the id, returns at once' },
            { id: 'd-o', label: 'stdout + stderr', pattern: 'network', icon: 'file', sub: 'captured by the log driver; §8' },
            { id: 'd-p', label: 'pid 1', pattern: 'service', icon: 'box', sub: 'keeps running; docker logs to see it' },
          ],
          edges: [
            { source: 'd-t', target: 'd-o', label: 'not connected' },
            { source: 'd-o', target: 'd-p' },
          ],
        },
        {
          id: 'it',
          label: '-it — interactive',
          pattern: 'group',
          icon: 'usercheck',
          flow: 'TB',
          children: [
            { id: 'i-t', label: 'your terminal', pattern: 'user', icon: 'terminal', sub: 'keystrokes go in, output comes back' },
            { id: 'i-i', label: '-i keeps stdin open', pattern: 'network', icon: 'link', sub: 'without it, stdin closes and a shell exits' },
            { id: 'i-tty', label: '-t allocates a tty', pattern: 'network', icon: 'monitor', sub: 'so the program prints a prompt and colour' },
            { id: 'i-p', label: 'pid 1 — usually a shell', pattern: 'service', icon: 'box', sub: 'lives as long as you stay in it' },
          ],
          edges: [
            { source: 'i-t', target: 'i-i' },
            { source: 'i-i', target: 'i-tty' },
            { source: 'i-tty', target: 'i-p' },
          ],
        },
      ],
      edges: [],
    },
  ],
  edges: [],
}
