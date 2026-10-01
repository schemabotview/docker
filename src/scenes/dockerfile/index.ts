import type { Scene } from '@graphlearning/flow'
import { buildLoop } from './build-loop'
import { baseChoices } from './base-choices'
import { runLayers } from './run-layers'
import { copyAdd } from './copy-add'
import { buildContext } from './build-context'
import { workdirPaths } from './workdir-paths'
import { envVsArg } from './env-vs-arg'
import { metadataInstructions } from './metadata-instructions'
import { healthStates } from './health-states'
import { cmdEntrypoint } from './cmd-entrypoint'
import { cacheRule } from './cache-rule'

// Course 4 (dockerfile) scenes — eleven for twelve sections. §12 you-are-here re-runs `build-loop`,
// which is the course's spine: every instruction is one turn of that loop, and every rule in the
// course is a consequence of it. `build-loop` and `cache-rule` both carry forward into `buildkit`,
// where the loop becomes a graph and the linear cache becomes a content-addressed one.
export const dockerfileScenes: Scene[] = [
  buildLoop,
  baseChoices,
  runLayers,
  copyAdd,
  buildContext,
  workdirPaths,
  envVsArg,
  metadataInstructions,
  healthStates,
  cmdEntrypoint,
  cacheRule,
]
