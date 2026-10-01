import type { Scene } from '@graphlearning/flow'

// §4 copy-vs-add — ADD does two extra things, and both of them are surprises rather than features:
// it fetches URLs (without caching, without verification, and it cannot unpack what it fetched) and
// it auto-extracts LOCAL tar archives (which means a file named x.tar.gz silently becomes a
// directory). COPY does one predictable thing, which is why every style guide says use COPY.
export const copyAdd: Scene = {
  id: 'copy-add',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'copy',
      label: 'COPY — copies files. That is the whole behaviour.',
      pattern: 'group',
      icon: 'copy',
      flow: 'LR',
      children: [
        { id: 'c1', label: 'COPY src dest', pattern: 'service', icon: 'filecode', sub: 'from the build context only — never from the host at large' },
        { id: 'c2', label: '--chown=app:app', pattern: 'network', icon: 'usercheck', sub: 'ownership without a second RUN chown layer' },
        { id: 'c3', label: '--from=builder', pattern: 'network', icon: 'merge', sub: 'from an earlier STAGE — multi-stage, course 5' },
      ],
      edges: [],
    },
    {
      id: 'add',
      label: 'ADD — copies files, and then does two more things',
      pattern: 'group',
      icon: 'warn',
      flow: 'LR',
      children: [
        {
          id: 'a1',
          label: 'auto-extracts local tars',
          pattern: 'warn',
          icon: 'package',
          sub: 'ADD x.tar.gz /o/ gives you a DIRECTORY, not the file',
        },
        {
          id: 'a2',
          label: 'fetches a URL',
          pattern: 'warn',
          icon: 'globe',
          sub: 'no cache, no checksum — and it will NOT extract it',
        },
        {
          id: 'a3',
          label: 'so: use COPY',
          pattern: 'service',
          icon: 'circlecheck',
          sub: 'for a URL, RUN curl && verify the checksum && clean up',
        },
      ],
      edges: [],
    },
    {
      id: 'ok',
      label: 'The one modern case for ADD',
      pattern: 'network',
      icon: 'gitbranch',
      sub: 'ADD git@… clones a repo, with BuildKit, cached properly',
    },
  ],
  edges: [
    { source: 'copy', target: 'add', label: 'everything COPY does, plus two surprises' },
    { source: 'add', target: 'ok' },
  ],
}
