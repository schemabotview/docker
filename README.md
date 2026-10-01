# Docker — a GraphL concept app

Video-first Docker, built as scenes and slides. **Docker and the container runtime underneath it —
Kubernetes is a separate concept.**

Each **section** is one `(scene, slide, narration)` triple and one video segment: a react-flow
diagram or a code card on the left, a markdown slide on the right, a spoken script underneath.
Scenes are declarative — an author lists nodes and edges, and `@graphlearning/flow` computes every
position, so layout is deterministic and screenshots reproduce.

## The arc

12 courses, 130 sections:

`runtime · containers · images · dockerfile · buildkit · storage · networking · compose ·
registries · security · production · project`

The aim is expertise rather than a tour, so sections explain mechanism — how `-p` becomes an
iptables DNAT rule, how a `COPY` invalidates every layer below it, how `--memory` lands in a cgroup
file, how BuildKit runs two stages at once — and the places Docker expertise is actually tested get
sections of their own. `project` is the capstone: one real multi-service app containerised end to
end. The full plan is [`../DOCKER-PLAN.md`](../DOCKER-PLAN.md).

**All 12 courses are authored and verified: 130 sections, 85 scenes.** No narration wavs yet —
that's the Colab step.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

The catalog is at `#/`; a section is at `#/<courseId>-<sectionId>`, e.g. `#/runtime-cgroups`.

## Verify a change

```bash
npm run build        # must stay clean
npm run check        # tsc --noEmit + the scene text linter
npm run frames       # renders every section, measures overflow and type size
```

Then **look at the frames** in `frames/`. The first three commands pass on a slide that is wrong;
only the rendered frame shows an edge label sitting on a card. Every defect fixed on the first pass
of this course — two edge labels landing on the cards they ran between, a scene running under the
page chrome, a shell prompt the highlighter read as a comment — was invisible to all three.

## Structure

```
src/content/    courses → sections (one file per section) + registry
src/scenes/     hand-authored scenes + registry
src/main.tsx    mounts <ConceptApp> from @graphlearning/shell
src/theme.css   --brand / --brand-hover / --accent-2 — this repo's whole design surface
scripts/        concept.json · lint-scenes.mjs · frames.mjs
public/audio/<course>/   narration wavs (generated from .tts via Colab)
```

The render engine (`@graphlearning/flow`) and the app shell (`@graphlearning/shell`) are consumed
as published packages, pinned by version — not as workspace symlinks.
