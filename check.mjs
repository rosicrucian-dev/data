// IS THE SHARED DATA THERE, AND IS IT THE DATA THE SITE RECORDED?
//
//   node content/data/check.mjs        (from a consumer's root)
//
// This repository is mounted as a submodule by both sites, and a
// submodule has two ways of going quietly wrong that a copied
// directory never had:
//
//   - a fresh checkout without `git submodule update --init` leaves the
//     directory EMPTY, and the first sign of it is an ENOENT thrown
//     from inside a loader, naming a file and not the cause;
//   - a change committed here and not pushed, or pushed and not picked
//     up, means the two sites disagree -- which is the defect the move
//     to one repository was made to end.
//
// So the first is an ERROR and the rest are WARNINGS. Editing the data
// and building to look at it is the normal way to work, and a check
// that failed on a dirty tree would fail exactly then.

import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = process.cwd()
const git = (args, cwd = here) => {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null
  }
}

const fail = (message, remedy) => {
  console.error(`check-data: ${message}\n  ${remedy}`)
  process.exit(1)
}
const warn = (message) => console.warn(`check-data: ${message}`)

// 1. Is it there at all?
if (!existsSync(join(here, 'en')) || readdirSync(join(here, 'en')).length === 0)
  fail(
    'content/data is empty — the shared data repository is not checked out.',
    'git submodule update --init',
  )

// 2. Does what is checked out match what this site recorded? `git
//    submodule status` prefixes a '+' when the two differ.
const status = git(['submodule', 'status', '--', 'content/data'], root)
if (status?.startsWith('+'))
  warn(
    'content/data is at a different commit than this site records — ' +
      'commit the pointer (git add content/data) or check out the ' +
      'recorded one (git submodule update).',
  )

// 3. Anything uncommitted here reaches neither site.
if (git(['status', '--porcelain']))
  warn('content/data has uncommitted changes — they reach no site until committed and pushed.')

// 4. Anything committed and unpushed reaches only this one. Best
//    effort: no network, no complaint.
const head = git(['rev-parse', 'HEAD'])
const remote = git(['ls-remote', 'origin', 'HEAD'])?.split(/\s+/)[0]
if (head && remote && head !== remote) {
  const behind = git(['merge-base', '--is-ancestor', head, remote]) !== null
  warn(
    behind
      ? 'content/data is behind origin — git -C content/data pull, then commit the pointer.'
      : 'content/data is ahead of origin — git -C content/data push, or the other site cannot see it.',
  )
}

const files = readdirSync(join(here, 'en')).filter((f) => f.endsWith('.json'))
console.log(`check-data: ${files.length} tables, ${head?.slice(0, 7) ?? '?'}`)
