import type { Course } from '../types'
import { whatAnImageIs } from './01-what-an-image-is'
import { layers } from './02-layers'
import { contentAddressing } from './03-content-addressing'
import { imageReferences } from './04-image-references'
import { inspectAndHistory } from './05-inspect-and-history'
import { size } from './06-size'
import { manifestLists } from './07-manifest-lists'
import { pruning } from './08-pruning'
import { saveLoadExportImport } from './09-save-load-export-import'
import { youAreHere } from './10-you-are-here'

// Course 3 — the image, opened up. §1 is the spine (manifest → config + blobs) and §2–§4 are its
// three properties: what a blob holds, how everything is named, and how a name is written. §5–§7
// are what you can read off one, §8–§9 are moving and reclaiming, and §10 re-runs §1's diagram.
export const images: Course = {
  id: 'images',
  title: 'Images, layers & digests',
  sections: [
    whatAnImageIs,
    layers,
    contentAddressing,
    imageReferences,
    inspectAndHistory,
    size,
    manifestLists,
    pruning,
    saveLoadExportImport,
    youAreHere,
  ],
}
