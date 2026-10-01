import type { Section } from '../types'

export const networksAndVolumes: Section = {
  id: 'networks-and-volumes',
  title: 'Networks and volumes in Compose',
  scene: 'compose-file',
  slide: `## Declared at the top, referenced by services

\`\`\`yaml
services:
  web: { networks: [front] }
  api: { networks: [front, back] }
  db:  { networks: [back],
         volumes: ["pgdata:/var/lib/postgresql/data"] }
networks: { front: {}, back: {} }
volumes:  { pgdata: {} }
\`\`\`

That's the gateway shape from course 7 §10, in six lines: the proxy has **no route** to the database.

### Both are project-scoped
Created as \`shop_front\`, \`shop_pgdata\`. Removed by \`down\` (networks) and \`down -v\` (volumes).

### \`external: true\`
Means *this already exists; use it, don't create it, and don't delete it on \`down\`*. The right way to share a volume between stacks, or to point at a network someone else manages.

### The empty \`{}\` is not a mistake
It means "default settings". You only fill it in for a driver, a subnet, or driver options.`,
  narration:
    "Networks and volumes in Compose work the same way: declare them at the top level, reference them from services. And because Compose creates them for you, the interesting part is the shapes this makes cheap. Start with networks. If you declare none, every service goes on the project's default network and everything can reach everything. That's fine for a small stack. But the gateway pattern from course seven — where the front-facing thing has no route to the database — costs you six lines here. Declare two networks, front and back. Put the reverse proxy on front. Put the database on back. Put the API on both. Now the proxy cannot reach the database. Not a firewall rule that denies it: there is no route, no interface, no name resolution. If the proxy is compromised, the database is unreachable from it. That's a real security boundary, expressed declaratively, reviewable in a pull request, and it's the kind of thing that's tedious enough by hand that people skip it. Volumes are the same shape. Declare a name at the top level with empty braces, and reference it from a service with the volume name, a colon, and the path inside the container. Compose creates it on first up and it survives down — only down dash v removes it, as we covered. And a detail that trips people: the service-level volumes list takes both kinds, distinguished by the same rule as dash v from course six. A name on the left is a named volume. A path on the left, usually starting with dot-slash, is a bind mount. So one list can hold pgdata colon slash var slash lib and dot slash src colon slash app, and they're different mechanisms with different lifetimes. There's a long form too — type, source, target as separate keys — which is the dash dash mount equivalent and is worth using in anything production-bound for exactly the reason course six gave: it fails on a missing path instead of inventing one. Both networks and volumes are project-scoped, so they come out as shop underscore front and shop underscore pgdata. Which means two projects with a network called back don't collide, and it means the name you see in docker volume ls has a prefix you didn't write. Then external, which is worth knowing because it's how you deliberately cross the project boundary. External true on a volume or network means this already exists, use it, don't create it, and don't remove it on down. That's how two Compose stacks share a volume — a shared cache, say — or how you attach to a network that something else manages. It's also a safety measure for anything you really don't want a stray down dash v to delete: mark it external and manage it with docker volume create outside the stack. Two small things. The empty braces after a name aren't a placeholder you forgot to fill in — they mean default settings, and you only put anything inside for a driver, a subnet, or driver options. And there's a driver field on volumes that lets you put one on NFS or a cloud disk, which is how a single-host Compose deployment can still keep its data somewhere that survives the host. Next: the three things called env.",
}
