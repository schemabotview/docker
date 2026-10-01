import type { Scene } from '@graphlearning/flow'
import { registryPull } from './registry-pull'
import { registryAuth } from './registry-auth'
import { tagScheme } from './tag-scheme'
import { localRegistry } from './local-registry'
import { provenance } from './provenance'

// Course 9 (registries) scenes — five for ten sections, and heavy reuse by design. §1 and §4 reuse
// `image-anatomy` from the IMAGES course (what a registry stores IS that shape) and `registry-pull`
// respectively; §5 and §6 share `tag-scheme`; §7 and §8 share `local-registry`; §10 re-runs
// `registry-pull`, the spine.
export const registriesScenes: Scene[] = [registryPull, registryAuth, tagScheme, localRegistry, provenance]
