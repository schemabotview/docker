import type { Scene } from '@graphlearning/flow'
import { imageAnatomy } from './image-anatomy'
import { digestChain } from './digest-chain'
import { imageReference } from './image-reference'
import { historyRead } from './history-read'
import { sizeSharing } from './size-sharing'
import { manifestList } from './manifest-list'
import { pruneTable } from './prune-table'
import { saveLoad } from './save-load'

// Course 3 (images) scenes — eight new, plus two re-runs. §2 layers borrows `layer-stack` from the
// RUNTIME course, because the picture is identical and §2's job is to name its parts as image
// anatomy rather than as kernel mechanism. §10 you-are-here re-runs `image-anatomy`, this course's
// spine. `image-anatomy` and `manifest-list` both carry forward into `registries`.
export const imagesScenes: Scene[] = [
  imageAnatomy,
  digestChain,
  imageReference,
  historyRead,
  sizeSharing,
  manifestList,
  pruneTable,
  saveLoad,
]
