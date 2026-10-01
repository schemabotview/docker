import { runtime } from './runtime'
import { containers } from './containers'
import { images } from './images'
import { dockerfile } from './dockerfile'
import { buildkit } from './buildkit'
import { storage } from './storage'
import { networking } from './networking'
import { compose } from './compose'
import { registries } from './registries'
import { security } from './security'
import { production } from './production'
import { project } from './project'
import type { Course, Section } from './types'

// Course registry, in syllabus order. Courses are added here as each is authored:
// runtime · containers · images · dockerfile · buildkit · storage · networking · compose ·
// registries · security · production · project.
export const COURSES: Record<string, Course> = {
  [runtime.id]: runtime,
  [containers.id]: containers,
  [images.id]: images,
  [dockerfile.id]: dockerfile,
  [buildkit.id]: buildkit,
  [storage.id]: storage,
  [networking.id]: networking,
  [compose.id]: compose,
  [registries.id]: registries,
  [security.id]: security,
  [production.id]: production,
  [project.id]: project,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract the recorder drives, so it cannot be a per-repo decision. Re-exported here because
// this module is what the app and the scripts already import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
