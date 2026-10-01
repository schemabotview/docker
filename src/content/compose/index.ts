import type { Course } from '../types'
import { whyCompose } from './01-why-compose'
import { composeV2AndTheSpec } from './02-compose-v2-and-the-spec'
import { theFileShape } from './03-the-file-shape'
import { buildVsImage } from './04-build-vs-image'
import { theEverydayCommands } from './05-the-everyday-commands'
import { dependencies } from './06-dependencies'
import { networksAndVolumes } from './07-networks-and-volumes'
import { configuration } from './08-configuration'
import { profilesAndOverrides } from './09-profiles-and-overrides'
import { theDevLoop } from './10-the-dev-loop'
import { youAreHere } from './11-you-are-here'

// Course 8 — the stack as a unit. §3 is the spine (the project, and its scope); §4–§7 are what the
// file declares; §8–§9 are how one file serves several environments; §10 is the loop. §11 re-runs
// the project diagram, because nearly every Compose surprise is that scope.
export const compose: Course = {
  id: 'compose',
  title: 'Compose',
  sections: [
    whyCompose,
    composeV2AndTheSpec,
    theFileShape,
    buildVsImage,
    theEverydayCommands,
    dependencies,
    networksAndVolumes,
    configuration,
    profilesAndOverrides,
    theDevLoop,
    youAreHere,
  ],
}
