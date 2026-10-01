import type { Scene } from '@graphlearning/flow'
import { threatModel } from './threat-model'
import { rootAndSocket } from './root-and-socket'
import { capabilities } from './capabilities'
import { usernsRootless } from './userns-rootless'
import { hardenedRun } from './hardened-run'
import { secretsPaths } from './secrets-paths'

// Course 10 (security) scenes — six for twelve sections, with the heaviest reuse after `compose`.
// §2 and §3 share `root-and-socket` (they are the same mistake at two scales); §7 and §8 share
// `userns-rootless`; §6 and §12 share `hardened-run`, which is the course's payoff written as a
// command. §9 seccomp and §10 MAC reuse `capabilities`, since all three narrow the same surface.
export const securityScenes: Scene[] = [
  threatModel,
  rootAndSocket,
  capabilities,
  usernsRootless,
  hardenedRun,
  secretsPaths,
]
