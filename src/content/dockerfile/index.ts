import type { Course } from '../types'
import { theDockerfile } from './01-the-dockerfile'
import { from } from './02-from'
import { run } from './03-run'
import { copyVsAdd } from './04-copy-vs-add'
import { theBuildContext } from './05-the-build-context'
import { workdirAndPaths } from './06-workdir-and-paths'
import { envVsArg } from './07-env-vs-arg'
import { metadata } from './08-metadata'
import { healthcheck } from './09-healthcheck'
import { cmdVsEntrypoint } from './10-cmd-vs-entrypoint'
import { theCache } from './11-the-cache'
import { youAreHere } from './12-you-are-here'

// Course 4 — writing one. §1 is the execution model and everything else is a consequence of it:
// §2–§6 are the instructions that put bytes in the image, §7–§10 are the ones that only touch the
// config, and §11 is the ordering problem that decides what a rebuild costs. §12 re-runs the loop.
export const dockerfile: Course = {
  id: 'dockerfile',
  title: 'Writing a Dockerfile',
  sections: [
    theDockerfile,
    from,
    run,
    copyVsAdd,
    theBuildContext,
    workdirAndPaths,
    envVsArg,
    metadata,
    healthcheck,
    cmdVsEntrypoint,
    theCache,
    youAreHere,
  ],
}
