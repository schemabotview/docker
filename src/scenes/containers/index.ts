import type { Scene } from '@graphlearning/flow'
import { runAnatomy } from './run-anatomy'
import { attachModes } from './attach-modes'
import { pid1Signals } from './pid-1-signals'
import { lifecycleStates } from './lifecycle-states'
import { restartPolicies } from './restart-policies'
import { envPrecedence } from './env-precedence'
import { logsPipeline } from './logs-pipeline'
import { execSession } from './exec-session'
import { cpAndCommit } from './cp-and-commit'

// Course 2 (containers) scenes — eight new, plus two re-runs. §6 resource-limits borrows
// `cgroup-limits` from the RUNTIME course rather than redrawing it: the picture is identical and
// the point of §6 is that the flags you now type are the file writes you already met. §11
// you-are-here re-runs `lifecycle-states`, this course's spine.
export const containersScenes: Scene[] = [
  runAnatomy,
  attachModes,
  pid1Signals,
  lifecycleStates,
  restartPolicies,
  envPrecedence,
  logsPipeline,
  execSession,
  cpAndCommit,
]
