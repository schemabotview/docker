import type { Course } from '../types'
import { whatARegistryIs } from './01-what-a-registry-is'
import { thePull } from './02-the-pull'
import { authentication } from './03-authentication'
import { thePush } from './04-the-push'
import { tagsInPractice } from './05-tags-in-practice'
import { pinningByDigest } from './06-pinning-by-digest'
import { aLocalRegistry } from './07-a-local-registry'
import { mirrorsAndCaching } from './08-mirrors-and-caching'
import { provenance } from './09-provenance'
import { youAreHere } from './10-you-are-here'

// Course 9 — the other end of push and pull. §1–§2 are what a registry is and the request sequence
// (the spine); §3–§4 are how it authenticates and how a push differs; §5–§6 are naming, and the one
// decision that matters; §7–§8 are running one; §9 is what you can actually prove.
export const registries: Course = {
  id: 'registries',
  title: 'Registries & distribution',
  sections: [
    whatARegistryIs,
    thePull,
    authentication,
    thePush,
    tagsInPractice,
    pinningByDigest,
    aLocalRegistry,
    mirrorsAndCaching,
    provenance,
    youAreHere,
  ],
}
