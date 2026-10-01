import type { Section } from '../types'

export const theDaemon: Section = {
  id: 'the-daemon',
  title: 'The daemon',
  scene: 'daemon-config',
  slide: `## Three of the most valuable settings in Docker live in one file

\`/etc/docker/daemon.json\`. Most hosts have never had it edited.

- **\`log-opts\` with \`max-size\` and \`max-file\`** — see §3. The two most valuable lines here
- **\`live-restore: true\`** — containers keep running while \`dockerd\` restarts or upgrades. Without it, a daemon upgrade is an outage
- **\`default-address-pools\`** — when Docker's \`172.17/16\` collides with your corporate network, which produces a routing failure nobody suspects Docker for

### Applying it
\`systemctl reload docker\` is enough for log options and mirrors. Storage driver and \`userns-remap\` need a **restart**. Then **always** \`docker info\` to confirm — a JSON syntax error means the daemon refuses to start, and on a reboot that's a host that comes back with nothing running.

### And the log to read
\`journalctl -u docker\`. Not \`docker logs\` — that's for containers.`,
  narration:
    "Ten courses of using Docker; this one is about operating it. And it starts with a file that on most hosts has never been opened: slash etc slash docker slash daemon dot json. It doesn't exist by default. Everything works without it. And three of the highest-value settings in all of Docker operations live in it. The first is log rotation, which gets its own section shortly, and is genuinely the two most valuable lines you can write about Docker: max-size and max-file, under log-opts. Without them, the default json-file driver writes without limit, and one chatty container eventually fills the host's disk — taking down not just itself but everything else on the machine, including the daemon. The second is live-restore. Set it to true and containers keep running while dockerd restarts. Remember from course one that the shims own the container processes, not the daemon, so this is possible — but it's off by default, and without it, upgrading Docker or restarting the daemon stops every container on the host. That turns a routine package upgrade into an outage, which is exactly the kind of surprise you want to have configured away before it happens rather than after. The third is default-address-pools, and it's the one that produces the most confusing incident of the three. Docker's default bridge network uses 172 dot 17 dot 0 dot 0 slash 16, and it will happily take more ranges in that space as you create networks. If your corporate network, or your VPN, or your cloud VPC uses any of those addresses, then containers on that host cannot reach those machines — the route to the bridge wins. And the symptom is that one specific internal service is unreachable from containers on one specific host, which nobody attributes to Docker. Setting an address pool in a range you control avoids it permanently. There are others worth knowing — the storage driver, registry mirrors from course nine, userns-remap from course ten, and the metrics address in section five. All in the same file. Now applying changes, because there's a real trap. Some settings take effect on a reload: systemctl reload docker, which is gentle and doesn't touch containers. Log options, registry mirrors and the address pools are in that group — though note log options only apply to containers created afterwards, so existing ones keep their old settings until recreated. Others need a full restart: the storage driver, userns-remap, live-restore itself. And the trap: daemon dot json is JSON, so a trailing comma or a missing brace means the daemon refuses to start. If you edit it and don't restart, everything keeps working and you've left a landmine — the next reboot brings the host back with no Docker at all and no obvious reason why. So after any edit: apply it, then run docker info and confirm the setting is actually there. Finally, the log. When the daemon misbehaves, docker logs is not the command — that's for containers. It's journalctl dash u docker on systemd hosts, and that's where you'll find the reason a container failed to start, a network couldn't be created, or the daemon refused a configuration. Next: the storage driver underneath all of it.",
}
