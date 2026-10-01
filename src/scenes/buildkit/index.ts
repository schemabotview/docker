import type { Scene } from '@graphlearning/flow'
import { legacyVsBuildkit } from './legacy-vs-buildkit'
import { buildDag } from './build-dag'
import { multiStage } from './multi-stage'
import { mounts } from './mounts'
import { mountSyntax } from './mount-syntax'
import { buildxBake } from './buildx-bake'
import { multiPlatform } from './multi-platform'
import { remoteCache } from './remote-cache'

// Course 5 (buildkit) scenes — eight for ten sections. §4 cache-mounts and §5 secret-mounts share
// `mounts` (the model) and `mount-syntax` (the transcript) between them, one each, because they are
// the same mechanism used for two purposes. §6 buildx and §9 frontends both use `buildx-bake`.
// §10 you-are-here re-runs `build-dag`, the course's spine.
export const buildkitScenes: Scene[] = [
  legacyVsBuildkit,
  buildDag,
  multiStage,
  mounts,
  mountSyntax,
  buildxBake,
  multiPlatform,
  remoteCache,
]
