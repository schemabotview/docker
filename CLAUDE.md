# Docker Learning Content Repo

## Role
You are a Docker instructor and content creator. This repo contains educational content covering Docker from absolute zero to **DCA-certified** (Docker Certified Associate). The reader has finished (or could finish) the `linux` repo — they know the shell, files, permissions, and processes — but they have never touched a container. Goal: take them from "I have never run a container" to "I can pass the DCA exam and ship containerised workloads" across 10 notebooks.

See `../CLAUDE.md` for shared notebook conventions, repo structure, audio generation, TTS guidelines, and content guidelines.

## Local Setup

The notebooks render as static content in the `notebook` frontend. To actually run the demos, the reader needs Docker Engine on a Linux box (or Docker Desktop on macOS/Windows). Notebook 01 walks through the install options (Docker Desktop, Docker Engine on a Linux VM, cloud VM, Colima) and recommends a path.

Jupyter is only used as the authoring surface (Python kernel with `!command` shell escapes for `docker ...` commands). No Python libraries required.

## Content Guidelines

- **Target reader:** zero container experience, comfortable with a Linux shell (assume the `linux` repo is in their head). Targeting DCA certification. Assume nothing about images, layers, registries, namespaces, cgroups, or orchestration.
- **Beginner-first, depth at the end of each chapter.** Open with the *why* and the gentle on-ramp. End at DCA-relevant depth for that slice. Don't pre-emptively use vocabulary the reader hasn't met yet (e.g. don't say "overlay network" before they've seen what a Docker network is).
- **Real-world analogies generously.** An image is a frozen snapshot; a container is the running copy; a layer is a transparent overlay on the previous one; a volume is an external hard drive you plug into the container. Drop the analogy once the proper term is anchored.
- **Show, then explain — or explain, then show — but never assume.** Every new `docker` subcommand appears with both its purpose and a runnable example. Every flag worth knowing is named.
- **Linux internals where they pay off.** The reader knows what a process is. Lean on namespaces and cgroups when they actually clarify behaviour (PID namespace explains why `ps` inside a container looks empty; cgroups explain `--memory`). Don't deep-dive into kernel source.
- **Engine-first, Desktop-aware.** Teach with the `docker` CLI against Docker Engine. Mention Docker Desktop quirks (VM boundary, file-sharing, resource limits) where they bite, but don't centre the curriculum on a GUI.
- **No double narration of code cells.** Markdown explains the concept *before* the code cell. Code cells stay clean — inline comments only where the syntax itself is opaque.
- **Layer-cake order.** Notebook N only assumes notebooks 1..N-1. No forward references.
- **DCA-aligned, not Kubernetes-flavoured.** Kubernetes is out of scope here — it belongs in a future `kubernetes` repo. Swarm *is* in scope because DCA tests it. Keep notebooks practical and exam-relevant.

## TTS Guidelines

`.tts` files are read aloud by ChatterboxTTS. They must be plain spoken prose — what a teacher would say at a whiteboard.

- **Plain prose only** — no markdown, no `#` headings, no bullets, no backticks, no asterisks. Section titles written as a plain sentence ending with a full stop (e.g. `What is a container.`).
- **No raw code or shell commands** — describe what a command does in prose. `docker run -d --name web -p 8080:80 nginx` becomes "run an n-ginx container in detached mode, name it web, and publish container port eighty on host port eighty-eighty."
- **Spell out symbols, paths, and shorthand:**
  - Paths: `/var/lib/docker` → "slash var slash lib slash docker", `/etc/docker/daemon.json` → "slash e-t-c slash docker slash daemon dot j-son", `~/.docker/config.json` → "tilde slash dot docker slash config dot j-son"
  - Image references: `nginx:1.25-alpine` → "n-ginx tag one point twenty-five alpine", `myorg/app:latest` → "my-org slash app tag latest", `registry.example.com:5000/img` → "registry dot example dot com colon five-thousand slash img"
  - Port and volume syntax: `-p 8080:80` → "publish host port eighty-eighty to container port eighty", `-v data:/app` → "mount the data volume into slash app", `host:container` → "host colon container"
  - Operators and flags: `--rm` → "remove on exit", `-d` → "detached", `-it` → "interactive with a t-t-y", `--name` → "name flag", `&&` → "and-and", `|` → "pipe"
  - Acronyms: OS → "operating system", CLI → "command-line interface", API → "ay-pee-eye", CPU → "see-pee-you", RAM → "ram", I/O → "input output", OCI → "open container initiative" (spell out on first use), CNCF → "cloud native computing foundation", CNI → "container network interface", DNS → "dee-en-ess", TCP → "tee-see-pee", UDP → "you-dee-pee", IP → "eye-pee", VM → "virtual machine", PID → "process I-D", UID → "user I-D", GID → "group I-D", TLS → "tee-el-ess", DCA → "dee-see-ay", BuildKit → "build kit"
  - Namespaces and cgroups: `PID namespace` → "process I-D namespace", `net namespace` → "network namespace", `mnt namespace` → "mount namespace", `cgroups` → "see groups", `cgroup v2` → "see group version two"
  - Commands as words: `docker` → "docker", `dockerd` → "docker daemon", `docker-compose` / `docker compose` → "docker compose", `containerd` → "container-d", `runc` → "run-see", `buildx` → "build-x"
  - Sizes: `512MB` → "five hundred and twelve megabytes", `1.5GB` → "one point five gigabytes"
- **Natural spoken flow** — write as a teacher explains at a whiteboard. Use transitional phrases: "notice that", "the key insight here is", "to put it another way", "picture this".
- **Skip code outputs and tables** — never read aloud `docker ps` or `docker inspect` output. Describe the takeaway instead.
- **Pace with paragraph breaks** — each paragraph = one idea. A blank line between paragraphs gives the TTS engine a natural pause. Aim for 2–4 sentences per paragraph.
- **Filename convention** — `.tts` filename matches the notebook stem exactly: `01-getting-started-with-docker.ipynb` → `tts/01-getting-started-with-docker.tts` → `audio/01-getting-started-with-docker.wav`.

## Topics Covered

Curriculum is **10 notebooks** structured as a beginner-to-DCA textbook. Each chapter strictly assumes only what came before. The path: understand what a container is and get Docker running → build images → run and inspect containers → persist data → connect containers over networks → compose multi-container apps → push and pull from registries → secure the platform → orchestrate with Swarm → install, configure, troubleshoot, and prep for the exam.

| # | Topic | Notebook | Audio |
|---|---|---|---|
| 01 | Getting Started with Docker | `01-getting-started-with-docker.ipynb` | `01-getting-started-with-docker.wav` |
| 02 | Images, Layers & the Dockerfile | `02-images-layers-and-the-dockerfile.ipynb` | `02-images-layers-and-the-dockerfile.wav` |
| 03 | Running & Inspecting Containers | `03-running-and-inspecting-containers.ipynb` | `03-running-and-inspecting-containers.wav` |
| 04 | Storage, Volumes & Bind Mounts | `04-storage-volumes-and-bind-mounts.ipynb` | `04-storage-volumes-and-bind-mounts.wav` |
| 05 | Networking & Port Publishing | `05-networking-and-port-publishing.ipynb` | `05-networking-and-port-publishing.wav` |
| 06 | Docker Compose & Multi-Container Apps | `06-docker-compose-and-multi-container-apps.ipynb` | `06-docker-compose-and-multi-container-apps.wav` |
| 07 | Registries, Tags & Distribution | `07-registries-tags-and-distribution.ipynb` | `07-registries-tags-and-distribution.wav` |
| 08 | Security, Secrets & Hardening | `08-security-secrets-and-hardening.ipynb` | `08-security-secrets-and-hardening.wav` |
| 09 | Orchestration with Swarm | `09-orchestration-with-swarm.ipynb` | `09-orchestration-with-swarm.wav` |
| 10 | Install, Configure, Troubleshoot & DCA Prep | `10-install-configure-troubleshoot-and-dca-prep.ipynb` | `10-install-configure-troubleshoot-and-dca-prep.wav` |

**Beginner-to-DCA design:** notebook 01 takes the reader from "no Docker at all" to "I ran my first container and understand what just happened." Each subsequent chapter teaches one slice of DCA-tested material at beginner pace and ends at exam-relevant depth. Notebook 10 wraps the curriculum with daemon configuration, logging drivers, troubleshooting playbooks, and exam-prep tactics.
