import type { Section } from '../types'

export const thePull: Section = {
  id: 'the-pull',
  title: 'The pull, request by request',
  scene: 'registry-pull',
  slide: `## Four GETs

1. **\`GET /v2/library/nginx/manifests/1.25\`** — by **tag**. The only request that isn't content-addressed
2. An **index** comes back; pick the entry matching this platform (course 3 §7)
3. **\`GET\`** the config blob **by digest** — \`Env\`, \`Cmd\`, and the layer \`diff_id\`s
4. **\`GET\`** the layer blobs **by digest** — in parallel, and **only the ones you lack**

### Two properties fall out
- **Transfer is a set difference.** Rebuild on an unchanged base and the pull ships your layers only. That's course 3 §6's "what a pull costs"
- **It's verifiable.** Every blob is hashed on arrival and checked against the digest that named it. A registry cannot hand you different bytes

### So the tag is the weak link
Step 1 is the one lookup a publisher can repoint. Everything after it is nailed down by hashes — which is exactly why pinning by digest (course 3 §3) is the whole of the security story here.`,
  narration:
    "Let's follow a pull all the way through, because the sequence explains several things we've asserted in earlier courses. You type docker pull nginx colon 1.25. Request one: GET slash v2 slash library slash nginx slash manifests slash 1.25. Note the shape — the repository path, then manifests, then the reference. And note that the reference here is a tag. This is the only request in the whole sequence that is not content-addressed, and hold onto that, because it's where the trust boundary is. What comes back is usually an index rather than a manifest — the multi-architecture object from course three. The client reads it, finds the entry whose platform matches, and takes that entry's digest. Request two is the same endpoint again, this time with the digest instead of the tag, to fetch the actual manifest. Then request three: GET slash v2 slash library slash nginx slash blobs slash sha256 and the config's digest. That's the config blob — environment, command, entrypoint, architecture, and the ordered list of layer identifiers. And then request four, or rather requests four through however many layers there are: GET on the blobs endpoint for each layer digest, in parallel, and — this is the part that matters — only for the ones the local store doesn't already have. The client checks its own content-addressed store first, and any layer it already holds is skipped entirely. Two properties fall straight out of that. The first is that transfer is a set difference. When you rebuild your application on an unchanged base image and push it, the target host already has every base layer, so the pull fetches your layers and nothing else. That's course three's point about what a pull actually costs, and now you can see the mechanism: it's not an optimisation Docker implemented, it's a consequence of addressing everything by content. The second is that the whole thing is verifiable. Each blob is hashed as it arrives and checked against the digest that was used to request it. If they don't match, the client rejects it. So a registry — even a compromised one, even a man in the middle with a valid certificate — cannot hand you different bytes for a digest you asked for. It can refuse, it can be slow, it cannot lie. Which brings us back to step one. Everything from the index onwards is nailed down by hashes. Step one is a tag lookup, and a tag is a mutable pointer that the publisher controls. So the entire trust question for an image collapses to: do you trust whoever can move that tag, during the window between now and when you pull. That's why pinning by digest, from course three, isn't a nice-to-have for reproducibility. It's the one thing that removes the mutable step from the sequence, and everything after it is arithmetic. One practical note about the shape of the API: the push is the same sequence in reverse, with an extra step. The client asks whether the registry already has each blob with a HEAD request, uploads only the ones it doesn't, and puts the manifest last. Which means an interrupted push can leave blobs present with no manifest referencing them — that's section ten's garbage collection problem, arriving early. Next: how any of this is authenticated.",
}
