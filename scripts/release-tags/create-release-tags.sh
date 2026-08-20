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
#   scripts/release-tags/create-release-tags.sh --push     # create tags and push them
#
# Pushing requires credentials allowed to write refs/tags/* on the remote.

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$DIR/release-tags.tsv"
REMOTE="${REMOTE:-origin}"
PUSH=false
[[ "${1:-}" == "--push" ]] && PUSH=true

[[ -f "$MANIFEST" ]] || { echo "missing manifest: $MANIFEST" >&2; exit 1; }

git fetch --tags "$REMOTE" >/dev/null 2>&1 || true

created=0
declare -a TAGS=()

while IFS=$'\t' read -r tag commit released anchor subject; do
  [[ "$tag" == \#* || -z "$tag" ]] && continue

  if ! git cat-file -e "$commit^{commit}" 2>/dev/null; then
    echo "SKIP $tag: commit $commit not present locally (fetch full history first)" >&2
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

  TAGS+=("$tag")
  created=$((created + 1))
done < "$MANIFEST"

echo "created/updated $created tags locally"

if ! $PUSH; then
  echo "run again with --push to publish them to $REMOTE"
  exit 0
fi

batch=()
for tag in "${TAGS[@]}"; do
  batch+=("+refs/tags/$tag:refs/tags/$tag")
  if [[ ${#batch[@]} -ge 60 ]]; then
    git push "$REMOTE" "${batch[@]}"
    batch=()
  fi
done
[[ ${#batch[@]} -gt 0 ]] && git push "$REMOTE" "${batch[@]}"

echo "pushed $created tags to $REMOTE"
