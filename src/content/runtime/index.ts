import type { Course } from '../types'
import { whyContainers } from './01-why-containers'
import { containerVsVm } from './02-container-vs-vm'
import { namespaces } from './03-namespaces'
import { cgroups } from './04-cgroups'
import { unionFilesystem } from './05-union-filesystem'
import { theEngineChain } from './06-the-engine-chain'
import { oci } from './07-oci'
import { install } from './08-install'
import { firstRun } from './09-first-run'
import { imagesVsContainers } from './10-images-vs-containers'
import { youAreHere } from './11-you-are-here'

// Course 1 — the machine, before the tool. §1–§2 state the problem and the trade; §3–§5 are the
// three kernel primitives a container is made of; §6 is the spine that assembles them, and §7 says
// none of it belongs to Docker alone. §8–§9 make the theory visible as output, §10 answers the
// question the whole course was circling, and §11 re-runs §6's chain — which is the argument.
export const runtime: Course = {
  id: 'runtime',
  title: 'What a container actually is',
  sections: [
    whyContainers,
    containerVsVm,
    namespaces,
    cgroups,
    unionFilesystem,
    theEngineChain,
    oci,
    install,
    firstRun,
    imagesVsContainers,
    youAreHere,
  ],
}
