import type { Course } from '../types'
import { theRunAnatomy } from './01-the-run-anatomy'
import { foregroundDetached } from './02-foreground-detached'
import { pid1 } from './03-pid-1'
import { lifecycleAndExitCodes } from './04-lifecycle-and-exit-codes'
import { restartPolicies } from './05-restart-policies'
import { resourceLimits } from './06-resource-limits'
import { environment } from './07-environment'
import { logs } from './08-logs'
import { lookingInside } from './09-looking-inside'
import { movingDataAndState } from './10-moving-data-and-state'
import { youAreHere } from './11-you-are-here'

// Course 2 — driving a container, where course 1 explained what one is. The spine is §4's
// lifecycle: §1–§2 are the entry to it, §3–§5 are the exit from it and what happens next, §6–§7 are
// the two things fixed at create time, and §8–§10 are how to see in while it runs and get things
// out after it stops. §11 re-runs the lifecycle diagram, which is the argument of the course.
export const containers: Course = {
  id: 'containers',
  title: 'Running & inspecting containers',
  sections: [
    theRunAnatomy,
    foregroundDetached,
    pid1,
    lifecycleAndExitCodes,
    restartPolicies,
    resourceLimits,
    environment,
    logs,
    lookingInside,
    movingDataAndState,
    youAreHere,
  ],
}
