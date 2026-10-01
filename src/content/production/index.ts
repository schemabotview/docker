import type { Course } from '../types'
import { theDaemon } from './01-the-daemon'
import { storageDrivers } from './02-storage-drivers'
import { loggingDrivers } from './03-logging-drivers'
import { theRuntimeLayer } from './04-the-runtime-layer'
import { observability } from './05-observability'
import { disk } from './06-disk'
import { theTroubleshootingPlaybook } from './07-the-troubleshooting-playbook'
import { dockerInCi } from './08-docker-in-ci'
import { devcontainers } from './09-devcontainers'
import { swarmInHonestOutline } from './10-swarm-in-honest-outline'
import { youAreHere } from './11-you-are-here'

// Course 11 — operating it. §1–§4 are the daemon and what is under it; §5–§7 are seeing and
// diagnosing, with §6 (disk) as the spine because that is the incident that actually happens;
// §8–§9 are the pipeline and the desk; §10 is the honest decision about a second host.
export const production: Course = {
  id: 'production',
  title: 'Operating Docker',
  sections: [
    theDaemon,
    storageDrivers,
    loggingDrivers,
    theRuntimeLayer,
    observability,
    disk,
    theTroubleshootingPlaybook,
    dockerInCi,
    devcontainers,
    swarmInHonestOutline,
    youAreHere,
  ],
}
