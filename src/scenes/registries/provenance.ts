import type { Scene } from '@graphlearning/flow'

// §9 provenance — what is actually verifiable today, stated honestly. The useful framing is that a
// signature, an SBOM and a provenance attestation answer three DIFFERENT questions, and people
// conflate them: "who published this", "what is inside it", and "how was it built". A scan answers
// none of the three — it tells you about known vulnerabilities in what an SBOM already listed.
export const provenance: Scene = {
  id: 'provenance',
  padding: 0.11,
  flow: 'TB',
  nodes: [
    {
      id: 'three',
      label: 'Three artifacts, three different questions',
      pattern: 'group',
      icon: 'shieldcheck',
      flow: 'LR',
      children: [
        {
          id: 'sig',
          label: 'a signature',
          pattern: 'service',
          icon: 'fingerprint',
          sub: 'WHO published this digest · cosign, keyless via OIDC',
        },
        {
          id: 'sbom',
          label: 'an SBOM',
          pattern: 'service',
          icon: 'scroll',
          sub: 'WHAT is inside it · every package and version',
        },
        {
          id: 'prov',
          label: 'a provenance attestation',
          pattern: 'service',
          icon: 'workflow',
          sub: 'HOW it was built · SLSA — which repo, commit and runner',
        },
      ],
      edges: [],
    },
    {
      id: 'how',
      label: 'And how you get them — mostly one flag',
      pattern: 'group',
      icon: 'wrench',
      flow: 'LR',
      children: [
        {
          id: 'h1',
          label: 'buildx --attest',
          pattern: 'network',
          icon: 'package',
          sub: 'sbom=true and provenance=mode=max, pushed alongside',
        },
        {
          id: 'h2',
          label: 'cosign sign',
          pattern: 'network',
          icon: 'lock',
          sub: 'and cosign verify in the deploy step, or it proves nothing',
        },
        {
          id: 'h3',
          label: 'a scanner reads the SBOM',
          pattern: 'warn',
          icon: 'search',
          sub: 'Trivy, Scout — known CVEs, not "is this safe"',
        },
      ],
      edges: [],
    },
    {
      id: 'honest',
      label: 'The honest limit',
      pattern: 'warn',
      icon: 'circleslash',
      sub: 'a signature nobody verifies at deploy time is decoration',
    },
  ],
  edges: [
    { source: 'three', target: 'how' },
    { source: 'how', target: 'honest' },
  ],
}
