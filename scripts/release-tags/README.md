# Retroactive release tags

One git tag (`vX.Y.Z`) per Cypress release, pointing at the
cypress-documentation commit that represents the documentation as of that
release — a reference point for "what did the docs say when Cypress X.Y.Z
shipped?".

Run `./create-release-tags.sh` to create the tags locally, then
`./create-release-tags.sh --push` to publish them. Pushing needs credentials
allowed to write `refs/tags/*`. The script needs full repository history
(`git fetch --unshallow`).

`release-tags.tsv` is the manifest: tag, commit, Cypress release date, how the
commit was chosen, and that commit's subject line.

## How the commits were chosen

The list of releases comes from `docs/app/references/changelog.mdx`, which has
an entry for all 409 Cypress releases. Cross-checked against the `cypress`
package on npm: every version npm publishes from `0.8.2` onward has a changelog
entry, so no release is missing.

For each version, the anchor is the first commit on `main`'s first-parent
history where that release's changelog entry appears. In practice that is the
release-branch merge or the squashed "X.Y.Z Release" PR. The changelog has
lived in several places over the years, all of which are searched:

- `source/guides/references/changelog.md` and `_changelog_older.md` (2016–2018)
- `{source,content,docs/guides/references}/_changelogs/X.Y.Z.md` — one file per
  release (2018–2023)
- `content/guides/references/changelog.md`,
  `docs/guides/references/changelog.mdx`,
  `docs/app/references/changelog.mdx` — the consolidated file (2021–today)

The manifest's `anchor` column records which rule produced each row:

- **`changelog`** (255 tags) — the commit that introduced the changelog entry.
  Verified programmatically: the entry is present at that commit and absent at
  its first parent.
- **`date`** (45 tags, `0.13.7`–`0.19.4`) — these releases predate the
  changelog living in this repository, so the anchor is the last commit on
  `main` on or before the release date.
- **`manual`** (2 tags) — see below.

## Known wrinkles

- **`v10.1.0`** — the 10.1.0 release notes were committed as
  `content/_changelogs/10.0.4.md` with a `## 10.0.4` heading in `e9c022383`
  ("10.0.4 (#4562)"), and renamed to 10.1.0 two days later in `83da438eb`
  ("Fix change log (#4567)"). The tag points at `e9c022383`, where the content
  actually shipped. There was no Cypress 10.0.4.
- **`v14.4.0`** — landed in `e11d097f0` ("chore: add app v14.4.0 changelog
  (#6190)") with an `# 14.4.0` h1 instead of `## 14.4.0`; the heading level was
  fixed the next day. The tag points at `e11d097f0`.
- **`v6.9.0` / `v6.9.1`** — their changelogs were backfilled two days *after*
  the 7.0.0 docs landed, so these two tags are out of chronological order
  relative to `v7.0.0`. That is what the history says.
- **`v0.19.3` / `v0.19.4`** — the repository was nearly dormant in mid-2017, so
  both resolve to the same commit (`8f3e47c25`).

## What is not covered

107 releases (`0.3.3`–`0.13.6`, March–December 2015) predate this repository's
first commit (2016-01-10), so there is no documentation state to point at. Those
tags already exist, inherited from the cypress monorepo back when the docs lived
there, and are left untouched — the manifest does not list them.

Note that this means the tag set is not uniform: `v0.3.3`–`v0.13.6` point at
cypress monorepo commits that are not part of this repository's history, while
every tag from `v0.13.7` on points at a cypress-documentation commit.
