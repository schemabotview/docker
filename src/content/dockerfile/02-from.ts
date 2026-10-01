import type { Section } from '../types'

export const from: Section = {
  id: 'from',
  title: 'FROM — choosing a base',
  scene: 'base-choices',
  slide: `## The first line decides three things

Size, attack surface, and whether you can debug it.

- **\`node:20\`** ~1.1 GB — the full toolchain. A *build* stage, not a shipping one
- **\`node:20-slim\`** ~200 MB — Debian, no build tools. **The sane default**
- **\`node:20-alpine\`** ~130 MB — but see below
- **distroless** ~110 MB, **no shell** — a hardened runtime stage
- **\`scratch\`** — empty. One static binary: Go, Rust

### Alpine is not a smaller Debian
It uses **musl**, not glibc. Python wheels rebuild from source, some native modules break, DNS resolution differs, and a class of timing bugs appears. Worth it when you've *proven* your stack is fine on it — not by default.

### "No shell" is a feature
It's why \`docker exec\` fails on distroless. An attacker has no tools either. Debug by joining its namespaces (course 2 §9).

### Always pin
\`FROM node:20-slim\` floats. \`@sha256:…\` doesn't (course 3 §3).`,
  narration:
    "The first line of a Dockerfile is the one with the most consequences and the least thought put into it. It decides three things at once: how big your image is, how much attack surface it carries, and whether you'll be able to debug it at three in the morning. Look at the range. Node colon 20, the plain tag, is about one point one gigabytes. That is a complete Debian with a full build toolchain: gcc, make, Python, header files, git. That's not waste — you genuinely need most of it to compile native modules — but it is not what you want to ship. It is what you want to build in, which is what multi-stage builds are for, in the next course. Node colon 20 dash slim is about two hundred megabytes. Still Debian, still glibc, still has a shell and the ordinary tools, but without the build toolchain. For most services this is the right answer and the right default, and if you take one recommendation from this section it is: start with slim, and only move if you have a measured reason. Node colon 20 dash alpine is about a hundred and thirty megabytes, and here we need to be careful, because the advice to just use alpine is the most repeated piece of Docker advice and it is wrong often enough to hurt. Alpine is not a smaller Debian. It is a different Linux distribution built on musl instead of glibc, and the C library is not an implementation detail. Concretely: pip installing a Python package that ships a pre-built wheel for glibc will not find a matching wheel, so it compiles from source, and your thirty-second build becomes eleven minutes — or fails, because the compiler isn't there. Some native Node modules don't build at all. DNS resolution behaves differently in ways that have bitten real production systems. And there's a well-documented class of performance problems from musl's malloc under multi-threaded load. None of this means avoid Alpine. It means Alpine is a choice you make after verifying your stack is happy on it, not a default you adopt because the number is smaller. Then distroless, which is Google's family of images containing a language runtime and nothing else. No shell, no package manager, no ls, no cat. Around a hundred and ten megabytes for Node, and the smallness is almost beside the point — the real benefit is that there is nothing in there for an attacker to use. If someone achieves remote code execution in your application, their next move is usually to run a shell, and there isn't one. And scratch, which is the truly empty image: zero bytes, no filesystem at all. It works for a single statically-linked binary — a Go or Rust program — and you'll need to copy in CA certificates and a passwd entry yourself if you want TLS or a non-root user. Now, no shell is a feature and it is also the thing that will confuse you the first time. Docker exec on a distroless container fails with executable file not found, and the container is perfectly healthy. That's course two, section nine: bring your own tools in a debug container joined to its namespaces. Finally, and this is easy to forget in a section about choosing: pin it. FROM node colon 20 dash slim is a floating tag, so your build today and your rebuild in March are not the same base. Add the digest. Next: the instruction that produces essentially all of your image's size.",
}
