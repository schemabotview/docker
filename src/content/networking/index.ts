import type { Course } from '../types'
import { theMentalModel } from './01-the-mental-model'
import { theDefaultBridge } from './02-the-default-bridge'
import { userDefinedBridges } from './03-user-defined-bridges'
import { theDrivers } from './04-the-drivers'
import { publishingPorts } from './05-publishing-ports'
import { whatPReallyDoes } from './06-what-p-really-does'
import { containerToContainer } from './07-container-to-container'
import { hostMode } from './08-host-mode'
import { dnsAndResolution } from './09-dns-and-resolution'
import { inspectAndAttach } from './10-inspect-and-attach'
import { troubleshooting } from './11-troubleshooting'
import { youAreHere } from './12-you-are-here'

// Course 7 — three primitives and their consequences. §1 is the spine; §2–§4 are which network to
// put a container on; §5–§8 are how traffic gets in and between; §9–§11 are the practical layer
// (resolution, live attachment, and a diagnosis order). §12 re-runs the topology.
export const networking: Course = {
  id: 'networking',
  title: 'Networking',
  sections: [
    theMentalModel,
    theDefaultBridge,
    userDefinedBridges,
    theDrivers,
    publishingPorts,
    whatPReallyDoes,
    containerToContainer,
    hostMode,
    dnsAndResolution,
    inspectAndAttach,
    troubleshooting,
    youAreHere,
  ],
}
