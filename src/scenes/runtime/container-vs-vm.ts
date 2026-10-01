import type { Scene } from '@graphlearning/flow'

// §2 container-vs-vm — the one comparison everybody is shown and almost nobody is shown precisely.
// The difference is a single row: a VM brings its OWN kernel and the hypervisor must emulate
// hardware under it; a container borrows the HOST's kernel and gets isolation from kernel features
// instead. Everything people say about containers — seconds not minutes, megabytes not gigabytes,
// weaker isolation, and the hard constraint that a Linux container needs a Linux kernel — falls out
// of that row.
//
// Two stacks side by side, each drawn bottom-up. The right-hand column carries an explicit EMPTY
// row where the VM column has its guest kernels — without it the layout centred the two columns
// against each other, the two "Physical host" cards sat at different heights, and the comparison
// that is the whole point of the scene did not line up. Drawing the absence also makes it the thing
// the eye lands on, which is what the slide and the narration are both about.
export const containerVsVm: Scene = {
  id: 'container-vs-vm',
  padding: 0.08,
  nodes: [
    {
      id: 'compare',
      label: 'Same hardware · two ways to isolate',
      pattern: 'group',
      icon: 'scale',
      flow: 'LR',
      children: [
        {
          id: 'vms',
          label: 'Virtual machines',
          pattern: 'group',
          icon: 'building',
          flow: 'BT',
          children: [
            { id: 'vhw', label: 'Physical host', pattern: 'external', icon: 'cpu', sub: 'CPU, RAM, disks' },
            { id: 'hyp', label: 'Hypervisor', pattern: 'service', icon: 'layers', sub: 'emulates hardware per guest' },
            {
              id: 'guests',
              label: 'Two guests',
              pattern: 'group',
              icon: 'boxes',
              flow: 'LR',
              children: [
                { id: 'g1', label: 'Guest kernel + OS', pattern: 'warn', icon: 'gears', sub: '~1 GB, boots in ~30s' },
                { id: 'g2', label: 'Guest kernel + OS', pattern: 'warn', icon: 'gears', sub: 'a second full copy' },
              ],
            },
            {
              id: 'vapps',
              label: 'Your two apps',
              pattern: 'group',
              icon: 'package',
              flow: 'LR',
              children: [
                { id: 'va1', label: 'app A', pattern: 'network', icon: 'filecode' },
                { id: 'va2', label: 'app B', pattern: 'network', icon: 'filecode' },
              ],
            },
          ],
          edges: [
            { source: 'vhw', target: 'hyp' },
            { source: 'hyp', target: 'guests' },
            { source: 'guests', target: 'vapps' },
          ],
        },
        {
          id: 'containers',
          label: 'Containers',
          pattern: 'group',
          icon: 'box',
          flow: 'BT',
          children: [
            { id: 'chw', label: 'Physical host', pattern: 'external', icon: 'cpu', sub: 'CPU, RAM, disks' },
            {
              id: 'kernel',
              label: 'ONE shared kernel',
              pattern: 'service',
              icon: 'gears',
              sub: 'namespaces + cgroups do the isolating',
            },
            {
              id: 'gap',
              label: 'no guest OS row here',
              pattern: 'external',
              icon: 'circleslash',
              sub: 'the row a VM needs per guest, and a container does not',
            },
            {
              id: 'cts',
              label: 'Two containers',
              pattern: 'group',
              icon: 'boxes',
              flow: 'LR',
              children: [
                { id: 'c1', label: 'app A + its libraries', pattern: 'network', icon: 'package', sub: '~50 MB, starts in ~50ms' },
                { id: 'c2', label: 'app B + its libraries', pattern: 'network', icon: 'package', sub: 'shares the kernel above' },
              ],
            },
          ],
          edges: [
            { source: 'chw', target: 'kernel' },
            { source: 'kernel', target: 'gap' },
            { source: 'gap', target: 'cts' },
          ],
        },
      ],
      edges: [],
    },
  ],
  edges: [],
}
