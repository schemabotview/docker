import type { Course } from '../types'
import { theWritableLayer } from './01-the-writable-layer'
import { whyNotTheContainerFs } from './02-why-not-the-container-fs'
import { theThreeMountTypes } from './03-the-three-mount-types'
import { namedVolumes } from './04-named-volumes'
import { bindMounts } from './05-bind-mounts'
import { tmpfs } from './06-tmpfs'
import { vVsMount } from './07-v-vs-mount'
import { permissions } from './08-permissions'
import { backupRestoreMigrate } from './09-backup-restore-migrate'
import { youAreHere } from './10-you-are-here'

// Course 6 — where data goes. §1–§2 are the two independent reasons the writable layer is the wrong
// place; §3 is the spine (three mounts, one ownership question) and §4–§6 are one each; §7–§8 are
// the two ways of getting it wrong that produce no error at all; §9 is getting it back out.
export const storage: Course = {
  id: 'storage',
  title: 'Storage & volumes',
  sections: [
    theWritableLayer,
    whyNotTheContainerFs,
    theThreeMountTypes,
    namedVolumes,
    bindMounts,
    tmpfs,
    vVsMount,
    permissions,
    backupRestoreMigrate,
    youAreHere,
  ],
}
