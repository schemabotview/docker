import type { Section } from '../types'

export const theDockerSocket: Section = {
  id: 'the-docker-socket',
  title: 'The socket, and other grants',
  scene: 'root-and-socket',
  slide: `## Mounting the socket **is** giving root on the host

Not "access to Docker". Anything that can reach that API can ask for a container that is \`--privileged\`, with \`/\` bind-mounted, running whatever it likes. That's a root shell, one API call away.

That mount appears in the setup instructions for CI helpers, dashboards, auto-updaters and reverse proxies with service discovery. All of them are asking for the machine.

### The same grant, three other shapes
- **\`--privileged\`** — every capability, all devices, seccomp off
- **\`-v /:/host\`** — the host's filesystem, writable. Including \`~/.ssh\`
- **\`--pid=host\`, \`--net=host\`** — each removes one namespace

### If something genuinely needs the API
Put a **socket proxy** in front that allows only the endpoints it needs, read-only.

The \`docker\` **group is the same thing**: adding a user to it is granting root.`,
  narration:
    "This is the one that actually causes incidents, and it isn't an escape — it's a grant. Mounting the Docker socket into a container is giving that container root on the host. I want to be completely unambiguous: not similar to root, not a path that might lead to root. Equal to root, immediately, by design. Here's why. The socket is the Docker API. Anything that can talk to it can create containers. So a process in that container asks the API for a new container that is privileged, with the host's root filesystem bind-mounted at some path, running a shell. The API creates it, because that's what the API is for. The new container is running as root with the host's filesystem mounted writable. Game over, in about three API calls, using nothing but the documented interface. And the reason this matters so much in practice is where that mount appears: in the setup instructions for an enormous amount of popular software. CI runners that build images. Dashboards like Portainer. Auto-updaters like Watchtower. Reverse proxies with container service discovery, like Traefik. All of them say mount the socket, and all of them are asking for root on your host. Sometimes that's a reasonable trade for something you trust and control. Very often it's a convenience you agreed to without reading it that way. There are three other shapes of the same grant. Dash dash privileged, which gives every capability, access to all devices, and turns seccomp off. People reach for it when something doesn't work and it does make things work, because it removes essentially every restriction. It's not a bit more access; it's all of it. If a container needs privileged to function, find out which specific capability or device it needs and grant that one. Bind-mounting the host's root filesystem, dash v slash colon slash host, which is sometimes done by monitoring agents. That's read and write access to slash etc slash shadow, to everyone's SSH keys, to every other container's data. Read-only is much better if it's genuinely needed. And the namespace-removing flags — dash dash pid equals host, dash dash net equals host, mounting slash proc — each of which removes one of the walls from course one and should be a deliberate decision. Now, what if something genuinely needs the Docker API? Use a socket proxy. It's a small container that sits in front of the real socket and allows only specific endpoints, read-only. Your reverse proxy doing service discovery needs to list containers — GET slash containers slash json — and nothing else. A proxy that permits exactly that and denies container creation turns root-on-the-host into read-only-metadata. It's a few lines of configuration and it's the difference between a compromise of that component being catastrophic and being uninteresting. Finally, the one nobody mentions. Adding a user to the docker group on Linux means they can talk to the socket without sudo. Which, by everything just said, means they have root. The docker group is a root-equivalent group. That's a perfectly reasonable trade on your own laptop, and it is worth knowing that's the trade you made, and worth thinking hard about on a shared machine. Rootless Docker, in section eight, is the answer that doesn't require it. Next: the one-line fix, properly.",
}
