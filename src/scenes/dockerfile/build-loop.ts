import type { Scene } from '@graphlearning/flow'

// §1 the-dockerfile (reused by §12 you-are-here) — the SPINE. A build is not a script that runs; it
// is a LOOP, once per instruction: start a container from the layer so far, run the instruction in
// it, commit the filesystem difference as a new layer, throw the container away. Everything in this
// course follows from that loop — why each RUN is a layer, why `cd` does not persist, why deleting
// in a later step does not shrink the image, and why the cache can skip a step entirely.
export const buildLoop: Scene = {
  id: 'build-loop',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'loop',
      label: 'One instruction, four steps — then again for the next one',
      pattern: 'group',
      icon: 'repeat',
      flow: 'LR',
      children: [
        {
          id: 'prev',
          label: 'the layers so far',
          pattern: 'storage',
          icon: 'layers',
          sub: 'FROM gives you the first one',
        },
        {
          id: 'ct',
          label: 'a throwaway container',
          pattern: 'service',
          icon: 'box',
          sub: 'started on top of them, just for this step',
        },
        {
          id: 'exec',
          label: 'the instruction runs',
          pattern: 'service',
          icon: 'terminal',
          sub: 'RUN executes · COPY copies · ENV touches no files',
        },
        {
          id: 'commit',
          label: 'the diff becomes a layer',
          pattern: 'storage',
          icon: 'harddrive',
          sub: 'what changed, tarred — the container is discarded',
        },
      ],
      edges: [
        { source: 'prev', target: 'ct' },
        { source: 'ct', target: 'exec' },
        { source: 'exec', target: 'commit' },
      ],
    },
    {
      id: 'why',
      label: 'Which is why all of this is true',
      pattern: 'group',
      icon: 'brain',
      flow: 'LR',
      children: [
        { id: 'w1', label: 'each step is a layer', pattern: 'network', icon: 'layers', sub: 'so instruction COUNT is image structure' },
        { id: 'w2', label: 'no state survives', pattern: 'warn', icon: 'circleslash', sub: 'RUN cd /app does nothing — use WORKDIR' },
        { id: 'w3', label: 'deleting only hides', pattern: 'warn', icon: 'ban', sub: 'the earlier layer still ships the bytes' },
        { id: 'w4', label: 'a step can be skipped', pattern: 'service', icon: 'zap', sub: 'if its inputs are unchanged — the cache, §11' },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'loop', target: 'why', label: 'next instruction, on top of this layer' }],
}
