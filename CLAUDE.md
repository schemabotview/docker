# CLAUDE.md — docker (lean operational pointers)

The **Docker** concept app of GraphL. Workspace-wide invariants, content model and working agreement
live in the workspace [`CLAUDE.md`](../CLAUDE.md) — read that first; this file is Docker-specific.
The course-by-course plan is [`../DOCKER-PLAN.md`](../DOCKER-PLAN.md).

## What this is

A standalone concept app: its own scenes + courses. The render engine is **`@graphlearning/flow`**
and the shell is **`@graphlearning/shell`** — both pinned by version, so an engine change never
lands here until this repo upgrades and re-verifies.

Each **section** = `(scene, slide, narration)`; the left scene is a react-flow diagram or a code
snippet, the right slide is markdown. One section = one slide = one video segment.

**Authored fresh**, 2026-09-30 — there was no `docker/` scaffold on disk despite the workspace
`CLAUDE.md` listing one. Three GitHub repos hold prior Docker material and **nothing is ported from
any of them**; they were read once, for coverage:

| repo | is |
|---|---|
| `schemabotview/docker` | 10-notebook quarry + 10 monolithic wavs |
| `schemabotview/docker-ct` | a 10×10 content repo for the old `graphl-movie` runtime |
| `schemabotview/docker-content` | graphl-ux era: 10 courses / ~140 sections — the coverage baseline |

**Not a git repo yet, and the publish name is undecided**: `schemabotview/docker` is taken by its
own quarry. Java hit the same collision on 2026-09-30 and resolved it by bundling to `~/.archive/`
and deleting; the same move is recommended here but has NOT been authorised. The alternative is
`schemabotview/docker-app`, which breaks the one-name-per-concept convention every other repo keeps.

## Scope

**Docker and the container runtime.** Kubernetes is its own concept, so orchestration is not a
course: Swarm gets three honest sections in `production`, not the 16 `docker-content` gave it. The
**DCA framing is dropped** — the exam no longer anchors anything, and shaping a syllabus around it
pulls weight toward flag recall. 2026 defaults throughout: BuildKit is the builder, Compose v2 is
`docker compose`, cgroups v2 is the cgroup, rootless is first-class, multi-arch is normal.

## Course arc (12)

`runtime · containers · images · dockerfile · buildkit · storage · networking · compose ·
registries · security · production · project` — 130 sections. Played in syllabus order; `project` is
the capstone that containerises one real multi-service app end to end.

**Status**: **all 12 courses authored and verified — 130 of 130 sections**, matching
`../DOCKER-PLAN.md` exactly. `runtime` 11 · `containers` 11 · `images` 10 · `dockerfile` 12 ·
`buildkit` 10 · `storage` 10 · `networking` 12 · `compose` 11 · `registries` 10 · `security` 12 ·
`production` 11 · `project` 10. 85 scenes.

Narration `.tts` not yet generated; no wavs in `public/audio/` yet. **That is the next step**, and
it is the owner's Colab run.

## The depth contract

The goal is expertise, not a tour, and that decides what a section may be:

- **Mechanism over flag.** A section earns its place by explaining what actually happens — how `-p`
  becomes an iptables DNAT rule, how `--memory` lands in `memory.max`. A flag list is not a section.
- **Traps get their own sections** — PID 1 and signals, `CMD` vs `ENTRYPOINT`, `ARG` in image
  history, bind-mount uid/gid, `depends_on` without a healthcheck, the default bridge's missing DNS.
- **Mechanism before ergonomics.** Namespaces and cgroups precede `docker run`; layers and digests
  precede the Dockerfile.
- **Bookends.** Each course opens with a framing section and closes with `you-are-here` — the
  `python` convention. The closer is the digest step, not filler.

## Scenes that carry forward

Each course closes by re-running its own spine scene in `you-are-here` — that repetition is the
argument, not filler. These are shared ACROSS courses; refocus them rather than redrawing:

- `engine-chain` — CLI → socket → dockerd → containerd → shim → runc → process. `runtime` §6/§11,
  then `production`. TWO bands, not one row: one LR row of five laid out 2.4:1 and rendered at 11pt.
  The band seam is also the Docker/OCI seam.
- `layer-stack` — lowerdirs (the image) beside an upperdir + merged view (the container).
  `runtime` §5/§10, `images` §2, then `dockerfile` and `storage`. Two columns, same reason.
- `cgroup-limits` — `/sys/fs/cgroup` as a directory of files. `runtime` §4, `containers` §6 — where
  the whole point is that the flags ARE those file writes.
- `image-anatomy` — manifest → config + layer blobs. `images` §1/§10, then `registries`.
- `build-loop` — container → run → commit → discard, once per instruction. `dockerfile` §1/§12,
  then `buildkit`, where the loop becomes a graph.
- `mount-types` — volume / bind / tmpfs, keyed on who owns the storage. `storage` §3/§10,
  `project` §7.
- `net-topology` — namespace, veth, bridge. `networking` §1/§7/§8/§12, then `production`.
- `compose-project` — the project scope. `compose` §3/§11, `project` §6.
- `disk-map` — the four places bytes go. `production` §5/§6/§11.

**Scene reuse is deliberate and rises through the app.** Early courses run ~1 scene per section;
`compose` runs 6 scenes for 11 sections and `project` 4 for 10. The capstone should not introduce
new pictures — it re-runs the ones the reader already knows.

## Layout rules learned on the frames

Every one of these passed `tsc`, `vite build` and `npm run check`:

- **A flat LR chain of 5+ cards renders at 11pt.** Split it into two bands or stand it up `TB`.
- **Top-level nodes with no `flow` lay out side by side.** Three bands became nine cards wide.
- **An edge label between two cards in a tight band lands ON one of them.** One word, or none —
  the `sub` beneath the card usually already says it.
- **A deep scene at `padding: 0.09` runs under the eyebrow and the pager.** 0.14–0.16 for anything
  four cards deep or three bands tall.
- **A 2-line leaf label costs the `sub` a row**, and the last word clips through the border. The
  linter's `leafSub` limit assumes a 1-line label, so it passes. Keep both short on narrow cards.
- **`service` (orange) does not read as the opposite of `warn` (red).** For a hit/miss or good/bad
  contrast use `storage` (green) against `warn`.

## Layout

```
src/scenes/          scenes + registry (a scene can be shared across sections)
src/content/         courses → sections + registry
src/main.tsx         mounts <ConceptApp> — the router, section view, slide panel,
                     catalog and narration are @graphlearning/shell
src/theme.css        this repo's three brand tokens — its entire design surface
scripts/             concept.json (publishing identity) · lint-scenes.mjs · frames.mjs.
                     The record/capture/thumb TOOLS are @graphlearning/shell bins
public/audio/<course>/   narration wavs
```

## Verifying

`npm run build` + `npm run check` + `npm run frames`, then **look at the frames**. All three passed
on every defect found in course 1's first pass: two edge labels rendering on top of the cards they
ran between, `oci-specs` and `layer-stack` running under the eyebrow and the pager, and the Alpine
prompt `/ #` greying out every in-container command as a comment while its output stayed bright.
Note the dev server may land on **5174** if another repo holds 5173 — pass `FRAMES_BASE`.

## Icons

`@graphlearning/flow@0.8.0` ships a **curated** 75-name icon registry, not all of lucide. An
unknown name is not an error — it silently falls back to the pattern's default glyph, which is why
`java/`'s scenes ask for `binary` and `activity` and quietly get neither. Useful here: `box` `boxes`
`package` `layers` `harddrive` `warehouse` `network` `router` `dooropen` `plug` `gears` `power`
`workflow` `terminal` `tree` `fingerprint` `skull` `circleslash` `lock` `key` `shieldcheck`.
