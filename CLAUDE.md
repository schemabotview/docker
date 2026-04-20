# Docker Learning Content Repo

## Role
You are a Docker expert and content creator. This repo contains educational content covering Docker and containerization concepts, targeting developers who want to build strong container fundamentals and advance to production-ready Docker skills.

See `../CLAUDE.md` for shared notebook conventions, repo structure, audio generation, TTS guidelines, and content guidelines.

## Local Setup

```bash
pip install jupyter notebook
```

Docker itself must be installed locally to run code examples:

```bash
# Verify Docker is available
docker version
```

Code cells that invoke `docker` CLI commands can be run via `!docker ...` in notebook cells or executed directly in a terminal.

## Content Guidelines

- Use real-world analogies to explain container concepts (e.g., shipping containers, VMs vs containers)
- Prefer concise `docker` CLI examples over GUI walkthroughs
- Show both the command and its output where the output is instructive
- Cover the "why" before the "how" — explain what problem each feature solves

## Topics Covered

| # | Topic | Notebook | Audio |
|---|---|---|---|
| 01 | What is Docker & Containerization | `01-what-is-docker-and-containerization.ipynb` | `01-what-is-docker-and-containerization.wav` |
| 02 | Docker Architecture & the Engine | `02-docker-architecture-and-the-engine.ipynb` | `02-docker-architecture-and-the-engine.wav` |
| 03 | Images & Layers | `03-images-and-layers.ipynb` | `03-images-and-layers.wav` |
| 04 | Your First Container | `04-your-first-container.ipynb` | `04-your-first-container.wav` |
| 05 | Writing Dockerfiles | `05-writing-dockerfiles.ipynb` | `05-writing-dockerfiles.wav` |
| 06 | Dockerfile Best Practices | `06-dockerfile-best-practices.ipynb` | `06-dockerfile-best-practices.wav` |
| 07 | Multi-Stage Builds | `07-multi-stage-builds.ipynb` | `07-multi-stage-builds.wav` |
| 08 | Container Lifecycle & Management | `08-container-lifecycle-and-management.ipynb` | `08-container-lifecycle-and-management.wav` |
| 09 | Resource Limits & Constraints | `09-resource-limits-and-constraints.ipynb` | `09-resource-limits-and-constraints.wav` |
| 10 | Volumes | `10-volumes.ipynb` | `10-volumes.wav` |
| 11 | Bind Mounts & tmpfs | `11-bind-mounts-and-tmpfs.ipynb` | `11-bind-mounts-and-tmpfs.wav` |
| 12 | Docker Network Types | `12-docker-network-types.ipynb` | `12-docker-network-types.wav` |
| 13 | Bridge & User-Defined Networks | `13-bridge-and-user-defined-networks.ipynb` | `13-bridge-and-user-defined-networks.wav` |
| 14 | Port Mapping & Container Communication | `14-port-mapping-and-container-communication.ipynb` | `14-port-mapping-and-container-communication.wav` |
| 15 | Compose Overview & YAML Syntax | `15-compose-overview-and-yaml-syntax.ipynb` | `15-compose-overview-and-yaml-syntax.wav` |
| 16 | Multi-Service Stacks | `16-multi-service-stacks.ipynb` | `16-multi-service-stacks.wav` |
| 17 | Compose in Development & CI/CD | `17-compose-in-development-and-ci-cd.ipynb` | `17-compose-in-development-and-ci-cd.wav` |
| 18 | Docker Hub & Image Management | `18-docker-hub-and-image-management.ipynb` | `18-docker-hub-and-image-management.wav` |
| 19 | Private Registries | `19-private-registries.ipynb` | `19-private-registries.wav` |
| 20 | Image Security Scanning | `20-image-security-scanning.ipynb` | `20-image-security-scanning.wav` |
| 21 | Container Security Fundamentals | `21-container-security-fundamentals.ipynb` | `21-container-security-fundamentals.wav` |
| 22 | Non-Root Users & Secrets Management | `22-non-root-users-and-secrets-management.ipynb` | `22-non-root-users-and-secrets-management.wav` |
| 23 | Seccomp, AppArmor & Read-Only Filesystems | `23-seccomp-apparmor-and-read-only-filesystems.ipynb` | `23-seccomp-apparmor-and-read-only-filesystems.wav` |
| 24 | Health Checks & Logging | `24-health-checks-and-logging.ipynb` | `24-health-checks-and-logging.wav` |
