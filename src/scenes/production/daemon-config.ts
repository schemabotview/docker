import type { Scene } from '@graphlearning/flow'

// §1/§2/§3 — daemon.json, and the fact that three of the highest-value settings in all of Docker
// operations live in one small file nobody edits. Log rotation is first because an unrotated
// json-file log is the most common way a host fills its disk, and it is two lines.
export const daemonConfig: Scene = {
  id: 'daemon-config',
  title: '/etc/docker/daemon.json — the file nobody edits',
  padding: 0.16,
  nodes: [
    {
      id: 'session',
      kind: 'code',
      filename: 'daemon.json',
      label: [
        '{',
        '  "log-driver": "json-file",',
        '  "log-opts": { "max-size": "10m", "max-file": "3" },',
        '  //  ^ THE most valuable two lines here. Without them one chatty',
        '  //    container fills the disk and takes the whole host with it.',
        '',
        '  "live-restore": true,',
        '  //  containers keep running while dockerd restarts or upgrades',
        '',
        '  "default-address-pools": [',
        '    { "base": "10.200.0.0/16", "size": 24 }',
        '  ],',
        '  //  when Docker’s 172.17/16 collides with your corporate network',
        '',
        '  "userns-remap": "default",   // c10 §7',
        '  "registry-mirrors": ["http://10.0.0.5:5001"],   // c9 §8',
        '  "storage-driver": "overlay2"',
        '}',
        '',
        '$ sudo systemctl reload docker    # log-opts, mirrors: reload is enough',
        '$ sudo systemctl restart docker   # storage-driver, userns: a restart',
        '$ docker info                     # and ALWAYS confirm it took',
      ].join('\n'),
    },
  ],
  edges: [],
}
