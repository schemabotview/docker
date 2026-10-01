import type { Course } from '../types'
import { theBrief } from './01-the-brief'
import { theNaiveImage } from './02-the-naive-image'
import { multiStage } from './03-multi-stage'
import { cache } from './04-cache'
import { hardened } from './05-hardened'
import { composeDev } from './06-compose-dev'
import { data } from './07-data'
import { multiArch } from './08-multi-arch'
import { ci } from './09-ci'
import { shipped } from './10-shipped'

// Course 12 — the capstone. One ordinary stack, one change per section, measured before and after.
// The arc is deliberately naive-first (§2) so every later section has a number to beat, and the two
// lessons the measurements carry — size and speed are independent, hardening is free — are only
// visible because §3 and §5 each move exactly one column.
export const project: Course = {
  id: 'project',
  title: 'Capstone: containerise it for real',
  sections: [
    theBrief,
    theNaiveImage,
    multiStage,
    cache,
    hardened,
    composeDev,
    data,
    multiArch,
    ci,
    shipped,
  ],
}
