import type { Scene } from '@graphlearning/flow'
import { daemonConfig } from './daemon-config'
import { runtimeLayer } from './runtime-layer'
import { diskMap } from './disk-map'
import { troubleshootTree } from './troubleshoot-tree'
import { swarmOutline } from './swarm-outline'

// Course 11 (production) scenes — five for eleven sections. §1–§3 share `daemon-config` (they are
// three settings in one file); §5 observability and §6 disk share `disk-map`; §8 CI and §9
// devcontainers reuse `runtime-layer` and `troubleshoot-tree` respectively, refocused. §11
// you-are-here re-runs `disk-map`, because "the disk is full" is the incident that actually happens.
export const productionScenes: Scene[] = [daemonConfig, runtimeLayer, diskMap, troubleshootTree, swarmOutline]
