# data

The reference data of the Western esoteric tradition as the Builders
of the Adytum and the Fraternity of the Hidden Light teach it: the
Tarot Keys and their correspondences, the Hebrew letters, the
Sephiroth and the paths between them, the Cube of Space, the signs,
the planets, the houses, the elements, the grades, and the rest of the
tables a student learns by heart.

**One fact, one home.** These files are the master. Two sites read
them and either may commit here; neither keeps a copy to edit.

| Consumer | Mounted at | What it does with them |
| --- | --- | --- |
| [botatoolbox](https://botatoolbox.org) | `content/data/` | the reference tables and the tools |
| [Hermetic Order of Aquarius](https://hermeticorderofaquarius.org) | `content/data/` | the Correspondences tables, and a quiz on each |

They are submodules, so a change is committed here, pushed, and then
picked up by each site as a pointer:

```sh
# in either site, where content/data is this repository's working tree
git -C content/data commit -am "Sulphur, as Case spells it"
git -C content/data push
git add content/data && git commit -m "Pick up the data"
```

## The format

A file per table, a top-level JSON array, one object per row, keyed by
a `slug`.

```
en/            the tables, in English — 20 files
de/            the same files in German; a row missing here falls back
.schemas/      generated JSON Schema per file, plus the editor wiring
schemas.ts     the Zod definitions the above are generated FROM
*.json         the four that are not per-language: the Tree's paths,
               the Cube of Space, and the recordings catalogue
```

**`schemas.ts` is the contract**, and the JSON Schemas are derived
from it — never edit a `.schema.json` by hand. Each consumer's
generator writes them; the `.vscode` wiring that comes with them is
what gives a non-developer autocomplete and a red underline on a bad
row, which is the point of having them at all.

## House rules

1. **Nothing derived is stored.** A channel's Key is reached through
   its sign's letter and a force's power through its planet's, so the
   Key is not a column here — a stored copy is a copy that can
   disagree. A consumer derives it and tests that it cannot drift.
2. **A fact has one home.** Where two tables share a key, each keeps
   its own columns and neither borrows the other's.
3. **The cut is not shared.** Which rows make a table, which columns
   go on which table, and what the table is called are each
   consumer's own decision: a cheat sheet wants one Astrology page, a
   school wants the Work's reading of the planets kept apart from the
   astrology. This repository holds the facts, not the arrangement.
4. **Spelling follows the sources**, which means Case: Sulphur, not
   Sulfur.

## Provenance

Split out of
[botatoolbox](https://github.com/rosicrucian-dev/botatoolbox)'s
`content/data/` on 10 November 2026 with `git subtree split`, so the
history above that date is that repository's. `schemas.ts` was copied
from its `src/content/data/schemas.ts` in the same move and still
carries Zod definitions for data that lives only there (the
meditations, the paths of wisdom): one contract is worth more than two
that must agree.

The plan this move follows, and the four phases still to come, is
`docs/data-repo-plan.md` in the Hermetic Order of Aquarius repository.
