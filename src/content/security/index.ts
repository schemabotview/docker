import type { Course } from '../types'
import { theThreatModel } from './01-the-threat-model'
import { rootInContainer } from './02-root-in-container'
import { theDockerSocket } from './03-the-docker-socket'
import { runningAsNonRoot } from './04-running-as-non-root'
import { capabilities } from './05-capabilities'
import { noNewPrivilegesAndReadOnly } from './06-no-new-privileges-and-read-only'
import { userNamespaceRemapping } from './07-user-namespace-remapping'
import { rootlessDocker } from './08-rootless-docker'
import { seccomp } from './09-seccomp'
import { apparmorSelinux } from './10-apparmor-selinux'
import { secrets } from './11-secrets'
import { youAreHere } from './12-you-are-here'

// Course 10 — the threat model first (§1), because the flags only make sense against it. §2–§4 are
// what a container starts out holding; §5–§6 narrow it; §7–§8 are the two ways to remove root
// entirely; §9–§10 are the layers already on; §11 is credentials. §12 is the whole course as one
// run command, which is the honest summary: none of it is difficult.
export const security: Course = {
  id: 'security',
  title: 'Security & hardening',
  sections: [
    theThreatModel,
    rootInContainer,
    theDockerSocket,
    runningAsNonRoot,
    capabilities,
    noNewPrivilegesAndReadOnly,
    userNamespaceRemapping,
    rootlessDocker,
    seccomp,
    apparmorSelinux,
    secrets,
    youAreHere,
  ],
}
