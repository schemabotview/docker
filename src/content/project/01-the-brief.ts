import type { Section } from '../types'

export const theBrief: Section = {
  id: 'the-brief',
  title: 'The brief',
  scene: 'the-stack',
  slide: `## A deliberately ordinary application

Caddy in front, a Node API, Postgres, Redis. Nothing clever — the point isn't the application, it's that **every decision from eleven courses shows up on something this normal**.

The API has the three things that make it interesting: a native dependency, a build step, and a private npm package that needs a token at build time.

### The constraints, stated up front
- **Small, and measured** — a number at each step, not "it got smaller"
- **Rebuilds in seconds** on a code edit, *and* on a cold CI runner
- **Non-root, no capabilities, read-only rootfs**, secret as a file
- **amd64 and arm64**, built in CI, pushed and deployed **by digest**

### How this course works
One change per section, measured before and after. By §10 you'll be able to say what each decision actually bought — which is the difference between knowing the flags and knowing when to use them.`,
  narration:
    "Eleven courses of mechanism. This one does all of it at once, on something real, and measures each step — because the gap between knowing a flag and knowing when to reach for it is exactly the gap this course is meant to close. The application is deliberately boring. Caddy in front doing TLS and routing. A Node API. Postgres for data. Redis for caching. There's nothing architecturally interesting here, and that's the point: if the techniques only paid off on something exotic, they wouldn't be worth teaching. The API does have three properties that make it a real example rather than a hello world. It has a native dependency, so the build needs a compiler and the runtime doesn't — which is what makes multi-stage matter rather than being a nice idea. It has a build step that produces a dist directory, so there's an artifact to carry across a stage boundary. And it depends on a private npm package, which means the build needs a token, which means we have to confront the secrets problem from courses four, five and ten rather than mentioning it. Now the constraints, stated up front so that every later section can be checked against them rather than just asserted to be an improvement. First: small, and measured. Not smaller — a number, before and after. I'll give you image sizes and rebuild times at each step, and some of them will be less impressive than you expect, which is more useful than a success story. Second: rebuilds in seconds on a code edit. And separately, rebuilds fast on a cold CI runner, which is a different problem with a different fix, and conflating them is why people do all the instruction-ordering work and then wonder why the pipeline is still four minutes. Third: non-root, no capabilities, read-only root filesystem, and the build secret handled properly. All of course ten, and we'll check what it costs. Fourth: both architectures, built in CI, pushed and deployed by digest rather than by tag. How the course works: one change per section, measured before and after, with a note saying which earlier course the change came from. By the last section you'll have a table showing what each decision bought, and two of the entries are more interesting for what they didn't buy. The first step is the one nobody publishes: a Dockerfile that works and is wrong in every way we've spent eleven courses learning about. We'll measure it, and then fix it one thing at a time. Next: make it work.",
}
