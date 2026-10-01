import type { Scene } from '@graphlearning/flow'

// §3 authentication — the token dance, because the 401-then-token flow explains both "it works
// interactively and fails in CI" and why `docker login` stores something you should worry about.
// The plain-base64 config file is the part people do not know: by default `docker login` writes
// your password, reversibly encoded, to a file in your home directory.
export const registryAuth: Scene = {
  id: 'registry-auth',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'dance',
      label: 'How a pull actually authenticates — a 401, then a token',
      pattern: 'group',
      icon: 'key',
      flow: 'LR',
      children: [
        { id: 'a1', label: 'GET /v2/… anonymously', pattern: 'user', icon: 'globe', sub: 'the client always tries this first' },
        { id: 'a2', label: '401 + a Www-Authenticate', pattern: 'network', icon: 'ban', sub: 'which names the auth service and the scope' },
        { id: 'a3', label: 'GET a token for that scope', pattern: 'service', icon: 'lock', sub: 'short-lived, and scoped to ONE repository' },
        { id: 'a4', label: 'retry with the token', pattern: 'service', icon: 'circlecheck', sub: 'so a leaked token is narrow and expires' },
      ],
      edges: [
        { source: 'a1', target: 'a2' },
        { source: 'a2', target: 'a3' },
        { source: 'a3', target: 'a4' },
      ],
    },
    {
      id: 'store',
      label: 'And what docker login leaves on your disk',
      pattern: 'group',
      icon: 'warn',
      flow: 'LR',
      children: [
        {
          id: 's1',
          label: 'config.json',
          pattern: 'warn',
          icon: 'file',
          sub: 'in ~/.docker — your password, base64: encoded, not encrypted',
        },
        {
          id: 's2',
          label: 'a credential helper',
          pattern: 'service',
          icon: 'shieldcheck',
          sub: 'credsStore puts it in the OS keychain instead — do this',
        },
        {
          id: 's3',
          label: 'in CI, never login',
          pattern: 'service',
          icon: 'terminal',
          sub: '--password-stdin from a secret, and a token not a password',
        },
      ],
      edges: [],
    },
  ],
  edges: [{ source: 'dance', target: 'store' }],
}
