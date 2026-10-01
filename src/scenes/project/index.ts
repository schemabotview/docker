import type { Scene } from '@graphlearning/flow'
import { theStack } from './the-stack'
import { measured } from './measured'
import { finalDockerfile } from './final-dockerfile'
import { shipIt } from './ship-it'

// Course 12 (project) scenes — four for ten sections, the highest reuse in the app, and that is the
// point: the capstone should not introduce new pictures. §2–§4 share `measured` (the numbers are
// the argument) and `final-dockerfile`; §6–§7 reuse `compose-project` and `mount-types` from the
// courses they come from; §8–§9 share `ship-it`; §10 re-runs `the-stack`.
export const projectScenes: Scene[] = [theStack, measured, finalDockerfile, shipIt]
