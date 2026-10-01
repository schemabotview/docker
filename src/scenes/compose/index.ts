import type { Scene } from '@graphlearning/flow'
import { composeFile } from './compose-file'
import { composeProject } from './compose-project'
import { composeCommands } from './compose-commands'
import { dependsHealth } from './depends-health'
import { composeConfig } from './compose-config'
import { profilesOverrides } from './profiles-overrides'

// Course 8 (compose) scenes — six for eleven sections, the highest reuse in the app and deliberately
// so: this course is about ONE file, so `compose-file` is the right left-hand frame for §2, §4, §7
// and §10, each time reading a different part of it. §11 you-are-here re-runs `compose-project`,
// the spine — the project scope that explains nearly every Compose surprise.
export const composeScenes: Scene[] = [
  composeFile,
  composeProject,
  composeCommands,
  dependsHealth,
  composeConfig,
  profilesOverrides,
]
