import type { Section } from '../types'

export const theEngineChain: Section = {
  id: 'the-engine-chain',
  title: 'The engine chain',
  scene: 'engine-chain',
  slide: `## "Docker" is five programs

Follow the chain. Typing \`docker run\` sends an **HTTP request** — the CLI does not create anything itself.

- **\`docker\`** — an HTTP client over \`/var/run/docker.sock\`
- **\`dockerd\`** — the REST API: builds, images, networks, volumes
- **\`containerd\`** — pulls images, tracks container lifecycle
- **\`containerd-shim\`** — **one per container**; owns the pid
- **\`runc\`** — sets the namespaces and cgroups, \`exec\`s your process, **then exits**

### What the shape explains
- **\`docker\` over SSH works** — a client talking to a remote endpoint (§8)
- **\`restart docker\` doesn't kill containers** — the shims hold them, not \`dockerd\`
- **Mounting the socket = root on the host** — that API can start a privileged container
- **Kubernetes dropped \`dockerd\`, kept \`containerd\`** — it never needed the top two boxes`,
  narration:
    "Now the spine of this course, and the diagram we'll come back to at the end. When you type docker run, it is tempting to assume that the docker command creates the container. It doesn't. It creates nothing. Docker is five programs in a chain, and the docker on your PATH is only the first of them. The docker CLI is an HTTP client. That's the whole of it. It parses your flags, turns them into a JSON request, and POSTs that to an endpoint — by default a Unix socket at slash var slash run slash docker dot sock. Next, dockerd, the daemon. It serves that REST API and it owns the high-level concerns: it builds images, it keeps the image store, it manages networks and volumes, it decides what a container should look like. But dockerd does not create containers either. It hands a specification down to containerd over gRPC. Containerd is the container runtime proper. It pulls images from registries, unpacks them, and tracks the lifecycle of every container on the host — created, running, stopped. It is a separate project, and that fact will matter in a moment. Then, per container, two more programs. Containerd starts a containerd-shim — one shim process for each container — and the shim is what actually owns the container's process. Finally the shim invokes runc. Runc is the piece that does the work we spent three sections on: it creates the namespaces, it writes the cgroup files, it sets up the mounts, and then it execs your process. And then — this is the part worth remembering — runc exits. Its job is finished. Your process keeps running, held by the shim, and it is at that point an ordinary host process that happens to be confined. Four things about the real world fall directly out of this shape. First, because the CLI is just an HTTP client, it can talk to a different endpoint entirely — over TCP, or over SSH to another machine — which is how one docker command administers a remote host, and we'll see it in the next section. Second, you can restart the Docker daemon without killing your containers, because dockerd is not their parent. The shims are, and the shims survive. Third, and this one is a genuine security lesson: mounting the Docker socket into a container is equivalent to giving that container root on the host. Not similar to — equivalent to. Anything that can reach that API can ask for a privileged container with the host's filesystem mounted. Fourth, this is the answer to a piece of news that confused a lot of people. When Kubernetes announced it was removing dockerd support, nothing about container images or Dockerfiles changed, because Kubernetes only ever needed containerd and runc — the bottom of this chain. It dropped the top two boxes. Your images kept working, because an image was never a Docker-specific thing in the first place. Which is exactly the next section.",
}
