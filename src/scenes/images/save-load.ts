import type { Scene } from '@graphlearning/flow'

// §9 save-load-export-import — two pairs that look interchangeable and are not. save/load move an
// IMAGE, preserving its layers, its history and its config; export/import move a CONTAINER's
// flattened filesystem, losing all three. The tell that people miss is that an imported tar has no
// CMD and no ENTRYPOINT, so it starts and immediately does nothing.
//
// Two bands, deliberately parallel so the losses in the second one are read as absences.
export const saveLoad: Scene = {
  id: 'save-load',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'imgpair',
      label: 'save / load — moves an IMAGE, and keeps everything',
      pattern: 'group',
      icon: 'package',
      flow: 'LR',
      children: [
        { id: 's1', label: 'docker save -o a.tar', pattern: 'service', icon: 'harddrive', sub: 'every layer, the config and the history' },
        { id: 's2', label: 'a tar on a USB stick', pattern: 'external', icon: 'file', sub: 'the air-gap transfer, and offline CI' },
        { id: 's3', label: 'docker load -i a.tar', pattern: 'service', icon: 'package', sub: 'same digests, same tags, same layers' },
      ],
      edges: [
        { source: 's1', target: 's2' },
        { source: 's2', target: 's3' },
      ],
    },
    {
      id: 'ctpair',
      label: 'export / import — a CONTAINER’s filesystem, and loses three things',
      pattern: 'group',
      icon: 'box',
      flow: 'LR',
      children: [
        { id: 'e1', label: 'docker export', pattern: 'warn', icon: 'box', sub: 'one flat tar of the merged filesystem' },
        { id: 'e2', label: 'layers gone', pattern: 'warn', icon: 'circleslash', sub: 'flattened to one — nothing is shared any more' },
        { id: 'e3', label: 'history gone', pattern: 'warn', icon: 'circleslash', sub: 'no record of how any of it got there' },
        { id: 'e4', label: 'CMD and ENV gone', pattern: 'warn', icon: 'skull', sub: 'docker import gives you an image that does nothing' },
      ],
      edges: [
        { source: 'e1', target: 'e2' },
        { source: 'e2', target: 'e3' },
        { source: 'e3', target: 'e4' },
      ],
    },
  ],
  edges: [{ source: 'imgpair', target: 'ctpair', label: 'the pair that looks the same and is not' }],
}
