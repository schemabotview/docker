import type { Course } from '../types'
import { theNewBuilder } from './01-the-new-builder'
import { theBuildDag } from './02-the-build-dag'
import { multiStage } from './03-multi-stage'
import { cacheMounts } from './04-cache-mounts'
import { secretAndSshMounts } from './05-secret-and-ssh-mounts'
import { buildx } from './06-buildx'
import { multiPlatform } from './07-multi-platform'
import { remoteCache } from './08-remote-cache'
import { dockerfileFrontends } from './09-dockerfile-frontends'
import { youAreHere } from './10-you-are-here'

// Course 5 — the builder, properly. §1 states the change (a loop became a solver) and every other
// section is a capability that needed it: §2–§3 the graph's own structure, §4–§5 the mounts a
// commit-per-step builder cannot express, §6–§8 the machinery around it, §9 the frontend. §10
// re-runs the graph.
export const buildkit: Course = {
  id: 'buildkit',
  title: 'BuildKit & modern builds',
  sections: [
    theNewBuilder,
    theBuildDag,
    multiStage,
    cacheMounts,
    secretAndSshMounts,
    buildx,
    multiPlatform,
    remoteCache,
    dockerfileFrontends,
    youAreHere,
  ],
}
