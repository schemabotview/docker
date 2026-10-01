import type { Scene } from '@graphlearning/flow'
import { worksOnMyMachine } from './works-on-my-machine'
import { containerVsVm } from './container-vs-vm'
import { namespaceViews } from './namespace-views'
import { cgroupLimits } from './cgroup-limits'
import { layerStack } from './layer-stack'
import { engineChain } from './engine-chain'
import { ociSpecs } from './oci-specs'
import { installSession } from './install-session'
import { firstRunSession } from './first-run-session'

// Course 1 (runtime) scenes — nine for eleven sections, because two are deliberately re-run:
// `layer-stack` (§5 union-filesystem) returns for §10 images-vs-containers, where the same picture
// IS the answer; and `engine-chain` (§6) returns for §11 you-are-here, which is the course's spine
// coming back on purpose. Both are also shared forward — `layer-stack` into `images`, `dockerfile`
// and `storage`, `engine-chain` into `production`.
export const runtimeScenes: Scene[] = [
  worksOnMyMachine,
  containerVsVm,
  namespaceViews,
  cgroupLimits,
  layerStack,
  engineChain,
  ociSpecs,
  installSession,
  firstRunSession,
]
