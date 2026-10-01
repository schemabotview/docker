import type { Scene } from '@graphlearning/flow'

// §4 cgroups — the other half of a container, and the one with no magic in it at all: a cgroup is a
// DIRECTORY, the limits are FILES in it, and `--memory=512m` is dockerd writing a number into one.
// Showing the tree with real paths is what turns "Docker limits the container" into "the kernel
// accounts for a set of pids, and you can cat the file".
//
// cgroup v2 deliberately: one unified hierarchy, not v1's controller-per-tree. The right-hand column
// is what the limit DOES when it is hit, because the two answers differ and that difference is the
// section's trap — memory kills, CPU throttles.
export const cgroupLimits: Scene = {
  id: 'cgroup-limits',
  padding: 0.09,
  nodes: [
    {
      id: 'fs',
      label: '/sys/fs/cgroup — one unified tree (cgroup v2)',
      pattern: 'group',
      icon: 'tree',
      flow: 'TB',
      children: [
        {
          id: 'slice',
          label: 'system.slice/docker-3f2a.scope',
          pattern: 'group',
          icon: 'folder',
          flow: 'LR',
          children: [
            { id: 'procs', label: 'cgroup.procs', pattern: 'storage', icon: 'file', sub: 'the pids this cgroup accounts for' },
            { id: 'memmax', label: 'memory.max = 536870912', pattern: 'warn', icon: 'gauge', sub: 'written by dockerd for --memory=512m' },
            { id: 'cpumax', label: 'cpu.max = 150000 100000', pattern: 'warn', icon: 'gauge', sub: 'written for --cpus=1.5' },
            { id: 'stat', label: 'memory.current', pattern: 'storage', icon: 'barchart', sub: 'live usage — what docker stats reads' },
          ],
          edges: [],
        },
        {
          id: 'outcome',
          label: 'What happens at the ceiling — and the two answers differ',
          pattern: 'group',
          icon: 'warn',
          flow: 'LR',
          children: [
            {
              id: 'oom',
              label: 'Memory: killed',
              pattern: 'warn',
              icon: 'skull',
              sub: 'OOM killer ends it — exit 137, no warning',
            },
            {
              id: 'throttle',
              label: 'CPU: throttled',
              pattern: 'warn',
              icon: 'clock',
              sub: 'still alive, just slower — silent latency',
            },
          ],
          edges: [],
        },
      ],
      edges: [{ source: 'slice', target: 'outcome', label: 'kernel enforces, per period' }],
    },
  ],
  edges: [],
}
