import type { Section } from '../types'

export const oci: Section = {
  id: 'oci',
  title: 'OCI — why "Docker image" is a misnomer',
  scene: 'oci-specs',
  slide: `## Three written specs, many implementations

Docker handed its formats to the **Open Container Initiative** in 2015. They are now standards with several implementations each — Docker is one of them.

- **image-spec** — what an image *is*: a manifest, a config, and layer blobs, all content-addressed
- **runtime-spec** — how to run an unpacked bundle: a \`config.json\` of namespaces, cgroups, mounts, capabilities. \`runc\` is the reference; \`crun\`, gVisor and Kata are alternatives
- **distribution-spec** — the \`/v2/\` HTTP API every registry speaks

### Why this is the good news
The thing you build with a Dockerfile can be pulled by \`containerd\`, run by Podman, scheduled by Kubernetes, signed by \`cosign\`, scanned by Trivy. **Nobody asks Docker's permission.**

Learn Docker and you have learned the interface to all of it. Say "**OCI image**" — it's the accurate name.`,
  narration:
    "A short section, but it changes how you should read everything that follows. When Docker appeared, the image format was Docker's, the runtime was Docker's, and the registry protocol was Docker's. If you were building on containers, you were building on one company's implementation, and the industry was rightly nervous about that. So in 2015 Docker donated the formats to a neutral body — the Open Container Initiative, under the Linux Foundation — and they became written specifications that anyone may implement. There are three, and they map onto three questions. The first is image-spec, which answers what an image is. And the answer is deliberately unexciting: an image is a manifest, which is a small JSON document listing a config and some layers by their digests; a config, which is the JSON holding the environment variables, the default command, the entrypoint, the architecture; and the layer blobs themselves, which are gzipped tar files of filesystem diffs. Everything is content-addressed, meaning each piece is named by the SHA-256 hash of its own bytes. There is no single image file. An image is a set of blobs and a document that lists them. The second is runtime-spec, which answers how to run one. You unpack the layers into a directory, you write a config dot json describing exactly what the confinement should be — which namespaces, which cgroup limits, which mounts, which Linux capabilities — and you hand that bundle to a runtime. Runc is the reference implementation, the one Docker uses. But crun is a faster one written in C. gVisor implements the same spec while intercepting system calls in userspace for much stronger isolation. Kata Containers implements it by launching a lightweight virtual machine. All of them take the same bundle, because the bundle is a standard. The third is distribution-spec, which answers how to move one around. It is an HTTP API — paths under slash v2 — for asking a registry for a manifest and then fetching blobs by digest. Docker Hub speaks it. So do Amazon ECR, GitHub's registry, Google's, Quay, Harbor, and the registry you can run yourself in one command. Now, why does this matter to you, today, as somebody learning Docker? Because it means the thing you learn to build is not tied to the tool you build it with. The image you produce with a Dockerfile can be pulled by containerd, run by Podman without any daemon at all, scheduled by Kubernetes, signed with cosign, scanned by Trivy, and cached in a registry none of those projects control. You are learning the interface to an entire ecosystem, not one vendor's product. Which is why the careful name for the artifact is an OCI image, not a Docker image — and why saying it that way is not pedantry but an accurate description of what you are holding. Enough theory. Time to install the thing.",
}
