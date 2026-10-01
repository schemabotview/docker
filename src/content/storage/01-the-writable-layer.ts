import type { Section } from '../types'

export const theWritableLayer: Section = {
  id: 'the-writable-layer',
  title: 'The writable layer',
  scene: 'layer-stack',
  slide: `## Where your data has been going all along

Five courses without persisting anything. The diagram is course 1 §5's — and the **upperdir** is where every file your containers wrote has landed.

- It is created **per container**, and removed with the container
- It is not shared: two containers from one image get two of them
- It is part of the **union**, so every read and write goes through overlayfs

### It's fine for a lot of things
Temporary files, a scratch directory, anything you'd be happy to lose. Not a mistake to use — it's the default for a reason.

### It's wrong for two
**Anything you want to keep** (§2, first half) and **anything written hot or large** (§2, second half). Both reasons are independent, and most people only know the first.

That's what the rest of this course is about: putting a path **outside** the union.`,
  narration:
    "Five courses in, and nothing we have run has kept any data. That was deliberate, and it is now the thing to fix. The diagram is the one from course one, section five, and it's back because the answer to where has my data been going is already on it. It's been going into the upperdir — the single writable layer that sits on top of the image's read-only ones. Three facts about that layer. It is created per container, when the container is created, and it is removed when the container is removed. Not when the container stops — a stopped container still has its writable layer, which is why course two said docker ps dash a is where disk hides — but when it's removed, the layer and everything in it go. Second, it is not shared. Run ten containers from one image and you get ten separate writable layers, all sitting on the same shared read-only base. Nothing one container writes is visible to another. That's usually what you want, and it's occasionally a surprise when people expect two replicas of a service to see each other's uploads. Third, and this is the one with performance consequences we'll get to in a moment, it is part of the union. Every read and every write inside a container goes through overlayfs, which has to work out which layer each path lives in. Now, I want to be careful here, because the usual framing is the writable layer is bad, use volumes, and that's too blunt. The writable layer is fine for a great many things. Temporary files your application makes and deletes. A scratch directory for an in-flight computation. Rendered output that will be regenerated anyway. Log files you're also sending to stdout. If losing it when the container is replaced would be a shrug, the writable layer is the right place and adding a volume is added complexity for nothing. There are exactly two kinds of thing it's wrong for, and they're independent reasons which is why the next section covers both. The first is anything you want to keep, and everybody knows that one. The second is anything written hot or large, and hardly anybody knows that one — it's a performance property of copy-on-write, and it's the reason running a database on the writable layer is a bad idea even if you didn't care about losing the data. Both reasons point at the same fix: put that path outside the union altogether, so it isn't a layer at all. That's what a mount is, and the rest of this course is the three kinds. Next: the two reasons, properly.",
}
