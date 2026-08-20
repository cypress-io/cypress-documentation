#!/usr/bin/env bash
#
# Retroactively create one git tag per Cypress release, pointing at the
# cypress-documentation commit that represents the documentation as of that
# release.
#
# Reads release-tags.tsv (same directory) and writes an annotated tag for each
# row. Existing tags listed in the manifest are force-updated; tags not listed
# are left alone.
#
# Usage:
#   scripts/release-tags/create-release-tags.sh            # create tags locally, no push
#   scripts/release-tags/create-release-tags.sh --push     # create tags and push what is missing
#
# The script is resumable: it only pushes refs whose remote target differs from
# the manifest, so re-running after a partial failure pushes just the remainder.
#
# PUSHING REQUIRES A CREDENTIAL WITH `workflow` SCOPE. Most of these tags point
# at commits whose tree contains .github/workflows/*.yml, and GitHub refuses to
# let an OAuth App token create such a ref without that scope:
#
#   ! [remote rejected] v3.7.0 -> v3.7.0 (refusing to allow an OAuth App to
#     create or update workflow `.github/workflows/...` without `workflow` scope)
#
# Use one of:
#   REMOTE=git@github.com:cypress-io/cypress-documentation.git \
#     scripts/release-tags/create-release-tags.sh --push      # SSH; not an OAuth App
#   a classic PAT with `repo` + `workflow` scopes
#   a fine-grained PAT with Contents: write and Workflows: write
#
# Written for bash 3.2 (the version macOS ships): no associative arrays.

set -o pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$DIR/release-tags.tsv"
REMOTE="${REMOTE:-origin}"
PUSH=false
[ "${1:-}" = "--push" ] && PUSH=true

[ -f "$MANIFEST" ] || { echo "missing manifest: $MANIFEST" >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

created=0
: > "$TMP/desired.tsv"

while IFS="$(printf '\t')" read -r tag commit released anchor subject; do
  case "$tag" in ''|\#*) continue ;; esac

  if ! git cat-file -e "$commit^{commit}" 2>/dev/null; then
    echo "SKIP $tag: commit $commit not present locally (run: git fetch --unshallow)" >&2
    continue
  fi

  case "$anchor" in
    changelog)
      how="This tag marks the commit where the ${tag#v} changelog entry landed in this
repository, i.e. the state of the documentation when ${tag#v} shipped."
      ;;
    date)
      how="This repository had no changelog entry for ${tag#v} at the time, so this tag
marks the last commit on the main branch on or before the release date,
i.e. the state of the documentation when ${tag#v} shipped."
      ;;
    *)
      how="This tag marks the commit where the ${tag#v} release notes were published in
this repository. The notes shipped under a mislabelled heading/filename
that was corrected in a later commit."
      ;;
  esac

  message="Cypress ${tag#v} documentation

Cypress ${tag#v} was released ${released}.

${how}

  commit:  ${commit}
  subject: ${subject}

Tag created retroactively to give every Cypress release a corresponding
documentation reference point."

  GIT_COMMITTER_DATE="$(git log -1 --format=%cI "$commit")" \
    git tag -f -a "$tag" -m "$message" "$commit" >/dev/null

  printf '%s\t%s\n' "$tag" "$commit" >> "$TMP/desired.tsv"
  created=$((created + 1))
done < "$MANIFEST"

echo "created/updated $created tags locally"

if [ "$PUSH" != true ]; then
  echo "run again with --push to publish them to $REMOTE"
  exit 0
fi

# Map every remote tag to the commit it resolves to, peeling annotated tags.
# Tag objects created on another machine have different object ids but the same
# target, so compare targets, never tag object ids.
echo "checking $REMOTE ..."
if ! git ls-remote --tags "$REMOTE" > "$TMP/lsremote.txt"; then
  echo "could not read tags from $REMOTE" >&2
  exit 1
fi

awk '
{
  ref = $2; sub("refs/tags/", "", ref)
  if (ref ~ /\^\{\}$/) { sub(/\^\{\}$/, "", ref); peel[ref] = $1 }
  else if (!(ref in direct)) { direct[ref] = $1 }
}
END { for (r in direct) print r "\t" ((r in peel) ? peel[r] : direct[r]) }
' "$TMP/lsremote.txt" > "$TMP/remote.tsv"

awk -F'\t' -v TODO="$TMP/todo.txt" -v COUNT="$TMP/correct.txt" '
  NR == FNR { have[$1] = $2; next }
  { if (($1 in have) && have[$1] == $2) correct++; else print $1 > TODO }
  END { print correct + 0 > COUNT }
' "$TMP/remote.tsv" "$TMP/desired.tsv"

[ -f "$TMP/todo.txt" ] || : > "$TMP/todo.txt"
todo=$(grep -c . < "$TMP/todo.txt")
correct=$(cat "$TMP/correct.txt")

echo "$correct already correct on $REMOTE, $todo to push"

# A silent "nothing to do" is the dangerous outcome, so make the arithmetic
# prove itself before trusting it.
if [ "$((correct + todo))" -ne "$created" ]; then
  echo "internal error: $correct + $todo != $created — refusing to continue" >&2
  exit 1
fi

[ "$todo" -eq 0 ] && { echo "nothing to do"; exit 0; }

pushed=0
failed=0
specs=""
n=0

flush() {
  [ -z "$specs" ] && return 0
  if git push "$REMOTE" $specs; then
    pushed=$((pushed + n))
  else
    failed=$((failed + n))
  fi
  specs=""
  n=0
  return 0
}

while read -r tag; do
  [ -z "$tag" ] && continue
  specs="$specs +refs/tags/$tag:refs/tags/$tag"
  n=$((n + 1))
  [ "$n" -ge 60 ] && flush
done < "$TMP/todo.txt"
flush

echo
echo "pushed $pushed, failed $failed"

if [ "$failed" -gt 0 ]; then
  cat >&2 <<'MSG'

Some refs were rejected. If the errors mention `workflow` scope, the credential
in use cannot create refs whose tree contains .github/workflows/*.yml. Re-run
with one of:

  REMOTE=git@github.com:cypress-io/cypress-documentation.git \
    scripts/release-tags/create-release-tags.sh --push

  ...or an HTTPS credential with `workflow` scope (classic PAT with
  `repo` + `workflow`, or a fine-grained PAT with Workflows: write).

The script is resumable — it will push only what is still missing.
MSG
  exit 1
fi
