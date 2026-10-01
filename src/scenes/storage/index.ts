import type { Scene } from '@graphlearning/flow'
import { copyUpCost } from './copy-up-cost'
import { mountTypes } from './mount-types'
import { volumeSession } from './volume-session'
import { bindMount } from './bind-mount'
import { tmpfsAndSyntax } from './tmpfs-and-syntax'
import { uidMismatch } from './uid-mismatch'
import { backupSession } from './backup-session'

// Course 6 (storage) scenes — seven new, plus two re-runs. §1 the-writable-layer borrows
// `layer-stack` from the RUNTIME course: the picture is the same and §1's job is to say that the
// upperdir is where your data has been going all along. §6 tmpfs and §7 v-vs-mount share
// `tmpfs-and-syntax`. §10 you-are-here re-runs `mount-types`, the course's spine.
export const storageScenes: Scene[] = [
  copyUpCost,
  mountTypes,
  volumeSession,
  bindMount,
  tmpfsAndSyntax,
  uidMismatch,
  backupSession,
]
