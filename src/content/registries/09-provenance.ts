import type { Section } from '../types'

export const provenance: Section = {
  id: 'provenance',
  title: 'Provenance',
  scene: 'provenance',
  slide: `## Three artifacts, three different questions

- **A signature** — *who* published this digest. \`cosign\`, keyless via OIDC, so there's no key to manage or leak
- **An SBOM** — *what* is inside it. Every package and version
- **A provenance attestation** — *how* it was built. SLSA: which repo, which commit, which builder

A **scan** answers none of the three. It reads what an SBOM already lists and tells you which of those have known CVEs today.

### Getting them is mostly one flag
\`\`\`bash
docker buildx build --attest type=sbom \\
  --attest type=provenance,mode=max --push .
\`\`\`
They're pushed as separate artifacts **alongside** the image, referenced by its digest.

### The honest limit
A signature nobody verifies at deploy time is decoration. The value is in the **admission check** — \`cosign verify\` in your deploy step, or a policy controller that refuses unsigned images. Producing the metadata is the easy half.`,
  narration:
    "Supply chain security around images has moved quickly, and the vocabulary is genuinely confusing because three different artifacts get lumped together. They answer three different questions, so let's separate them. A signature answers who published this. Someone with a key signs the image's digest, and anyone can verify that signature. The modern tool is cosign, and the interesting thing about it is keyless signing: instead of managing a private key, you authenticate with an OIDC identity — a GitHub Actions workflow identity, or your Google account — and the signature is bound to that identity and recorded in a public transparency log. No key to store, no key to leak, no key rotation. That removes the main reason people never got around to signing anything. An SBOM — software bill of materials — answers what is inside this. It's a structured list of every package and version in the image: the distribution packages, the language dependencies, transitively. On its own it tells you nothing about safety; it's an inventory. Its value is that when a vulnerability is announced in some library at eleven at night, you can answer which of our two hundred images contain it with a query instead of a two-day audit. A provenance attestation answers how was this built. The SLSA framework defines the format: which source repository, which commit, which builder, which parameters. That's what lets you say this image came from this commit in this repo, built by our CI, and not from someone's laptop. And a scan is none of those three, which is the confusion worth clearing up. A scanner — Trivy, Grype, Docker Scout — reads the package inventory, which is what an SBOM is, and cross-references it against vulnerability databases. It tells you which known CVEs apply to what's in there, today. That's useful and it's a moving target: the same image scans clean today and has fourteen criticals next month, with no change to the image. A scan is a snapshot of knowledge, not a property of the artifact. Producing all of this is mostly one flag. Buildx takes dash dash attest with type sbom and type provenance, and pushes them as separate artifacts alongside the image in the registry, referenced by its digest. Cosign sign is a second command in your pipeline. None of it is difficult. And now the honest limit, which is the point of this section. A signature that nobody verifies is decoration. An SBOM nobody queries is a file. Producing the metadata is the easy half, and it's the half that gets done, because it's a flag in a build. The valuable half is the check: cosign verify in your deployment step, failing the deploy if the signature is missing or the identity is wrong; or an admission controller that refuses to run an unsigned image at all. Without that, you've added artifacts to your registry and changed nothing about what can actually be deployed. So if you're adopting this, start from the verification end. Decide what your deploy step will refuse, and then produce whatever that check needs. It's a smaller amount of work than the full picture suggests, and it's the part that actually constrains anything. One section left.",
}
