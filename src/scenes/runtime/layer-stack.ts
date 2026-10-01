import type { Scene } from '@graphlearning/flow'

// §5 union-filesystem (reused by §10 images-vs-containers, and forward into the `images`,
// `dockerfile` and `storage` courses) — the third primitive, and the one that makes an image cheap.
// overlayfs takes a list of read-only directories, stacks them, and presents ONE merged tree. Write
// to a file that lives in a lower layer and the kernel copies it UP first — copy-on-write — so the
// lower layer is never touched and can therefore be shared by every container that uses it.
//
// TWO COLUMNS, not one tall stack. The first version was a single bottom-up column of six cards: it
// rendered about 0.35:1 in a square pane, so it used a quarter of the width and shrank its own type
// to fit the height. Splitting image from container costs nothing — each column still reads
// bottom-up — and it makes §10's claim the literal shape of the diagram: the LEFT column is the
// image, the RIGHT column is the container.
//
// padding 0.16 and a ONE-WORD edge label, both measured off the frame: at 0.1 the scene ran under
// the eyebrow and the pager, and "copy-up on first write" rendered on top of a layer card rather
// than in the gap between the columns.
export const layerStack: Scene = {
  id: 'layer-stack',
  padding: 0.16,
  nodes: [
    {
      id: 'overlay',
      label: 'overlayfs — read-only layers, one writable layer, one view',
      pattern: 'group',
      icon: 'layers',
      flow: 'LR',
      children: [
        {
          id: 'lowers',
          label: 'lowerdir — the IMAGE · read-only · shared by every container',
          pattern: 'group',
          icon: 'package',
          flow: 'BT',
          children: [
            { id: 'l1', label: 'debian rootfs', pattern: 'storage', icon: 'harddrive', sub: '/bin /etc /usr — 74 MB' },
            { id: 'l2', label: 'apt-get install python', pattern: 'storage', icon: 'boxes', sub: 'adds /usr/bin/python3 — 41 MB' },
            { id: 'l3', label: 'pip install -r reqs', pattern: 'storage', icon: 'boxes', sub: 'adds site-packages — 12 MB' },
            { id: 'l4', label: 'COPY app.py', pattern: 'storage', icon: 'filecode', sub: 'adds /app/app.py — 4 KB' },
          ],
          edges: [],
        },
        {
          id: 'ct',
          label: 'this CONTAINER — one writable layer, and what it sees',
          pattern: 'group',
          icon: 'box',
          flow: 'BT',
          children: [
            {
              id: 'upper',
              label: 'upperdir',
              pattern: 'warn',
              icon: 'pencil',
              sub: 'writable, this container only, and it dies with it',
            },
            {
              id: 'merged',
              label: 'merged — the / it sees',
              pattern: 'service',
              icon: 'folder',
              sub: 'one tree; the topmost version of each path wins',
            },
          ],
          edges: [{ source: 'upper', target: 'merged', label: 'union' }],
        },
      ],
      edges: [{ source: 'lowers', target: 'ct', label: 'copy-up' }],
    },
  ],
  edges: [],
}
