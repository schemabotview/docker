import type { Section } from '../types'

export const whatARegistryIs: Section = {
  id: 'what-a-registry-is',
  title: 'What a registry is',
  scene: 'image-anatomy',
  slide: `## An HTTP API over content-addressed blobs

Not a database of images. A server with two kinds of thing:

- **blobs** — layer tarballs and config JSON, each addressed by \`sha256:…\`, stored once
- **manifests** — the documents that list them, addressable by **digest** *and* by **tag**

The diagram is course 3 §1's, because what a registry stores **is** that shape. Push and pull are just moving those pieces over HTTP.

### Which is why deduplication is free
Two images sharing a base share the blob. The registry stores one copy, and a client that has it downloads nothing.

### And why a registry is simple to run
No image format knowledge, no build logic. It stores blobs by hash and serves them back. That's why \`registry:2\` is one container (§7).

### The API is a spec
\`/v2/\`, from OCI's distribution-spec (course 1 §7). Hub, ECR, GHCR, Quay, Harbor all speak it.`,
  narration:
    "Eight courses of pulling and pushing images with no real account of what's on the other end. A registry sounds like it should be a complicated piece of infrastructure — a database of images, some index, some knowledge of what an image is. It isn't. It's an HTTP server that stores two kinds of thing. The first is blobs. A blob is just a chunk of bytes with a name, and the name is the SHA-256 hash of those bytes. Layer tarballs are blobs. The config JSON is a blob. The registry has no idea what's in them and doesn't need to: it takes bytes, computes a hash, stores them under that hash, and serves them back when asked for that hash. The second is manifests. A manifest is the small document from course three that lists a config and some layers by digest, and manifests are special only in that they can be addressed two ways — by their own digest, like a blob, and by a tag, which is a human-assigned name pointing at a digest. That's the entire data model. The diagram is course three's, because what a registry stores is exactly that structure, and pushing and pulling are just moving those pieces over HTTP. Two consequences worth drawing out. The first is that deduplication is free and automatic. If two images share a base layer, they reference the same digest, and a content-addressed store keeps one copy. Push fifty images built from the same Debian base and the registry holds that base once. Nobody implemented deduplication; it falls out of naming things by their content. The same property on the client side means a pull downloads only the blobs you lack. The second is that a registry is genuinely simple to operate. It doesn't need to understand the image format, doesn't need to parse layers, doesn't need any build logic. It needs to store blobs by hash, store manifests, and serve them. Which is why the reference implementation is a single container you can run in one command, and section seven does exactly that. Compare that with how much machinery you'd expect behind a package repository for a language ecosystem. And the API is a specification, not Docker's private protocol. It's the OCI distribution-spec, from course one — a small set of endpoints under slash v2 — and Docker Hub, Amazon ECR, GitHub's registry, Google Artifact Registry, Quay, Harbor, GitLab's registry and the registry you run yourself all implement it. That's why you can push to any of them with the same command and why an image built with Docker can be pulled by containerd or Podman from any of them. Learning how a registry works is not learning about Docker Hub; it's learning an interface with a dozen implementations. Next: following a pull, request by request.",
}
