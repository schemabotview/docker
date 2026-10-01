import type { Scene } from '@graphlearning/flow'
import { runtimeScenes } from './runtime'
import { containersScenes } from './containers'
import { imagesScenes } from './images'
import { dockerfileScenes } from './dockerfile'
import { buildkitScenes } from './buildkit'
import { storageScenes } from './storage'
import { networkingScenes } from './networking'
import { composeScenes } from './compose'
import { registriesScenes } from './registries'
import { securityScenes } from './security'
import { productionScenes } from './production'
import { projectScenes } from './project'

// Scene registry. Sections reference scenes by id; scenes are grouped by course (one folder each,
// mirroring src/content). Ids are globally unique across courses, so the flat lookup below is
// unambiguous. Courses are added here as each is authored (runtime · containers · images ·
// dockerfile · buildkit · storage · networking · compose · registries · security · production ·
// project).
const ALL: Scene[] = [...runtimeScenes, ...containersScenes, ...imagesScenes, ...dockerfileScenes, ...buildkitScenes, ...storageScenes, ...networkingScenes, ...composeScenes, ...registriesScenes, ...securityScenes, ...productionScenes, ...projectScenes]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
