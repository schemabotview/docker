import type { Scene } from '@graphlearning/flow'
import { netTopology } from './net-topology'
import { bridgeDns } from './bridge-dns'
import { networkDrivers } from './network-drivers'
import { netInspect } from './net-inspect'
import { publishDnat } from './publish-dnat'
import { dnsInside } from './dns-inside'
import { netTroubleshoot } from './net-troubleshoot'

// Course 7 (networking) scenes — seven for twelve sections, because this course reuses more than
// any other: §2 and §3 share `bridge-dns` (they are two halves of one comparison), §5 and §10 share
// `net-inspect`, and §7 and §8 both return to `net-topology` — container-to-container and host mode
// are both read off the same picture. §12 you-are-here re-runs it once more, as the spine.
export const networkingScenes: Scene[] = [
  netTopology,
  bridgeDns,
  networkDrivers,
  netInspect,
  publishDnat,
  dnsInside,
  netTroubleshoot,
]
