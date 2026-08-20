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

set -uo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$DIR/release-tags.tsv"
REMOTE="${REMOTE:-origin}"
PUSH=false
[[ "${1:-}" == "--push" ]] && PUSH=true

[[ -f "$MANIFEST" ]] || { echo "missing manifest: $MANIFEST" >&2; exit 1; }

created=0
declare -a TAGS=()

while IFS=$'\t' read -r tag commit released anchor subject; do
  [[ "$tag" == \#* || -z "$tag" ]] && continue

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

  TAGS+=("$tag:$commit")
  created=$((created + 1))
done < "$MANIFEST"

echo "created/updated $created tags locally"

if ! $PUSH; then
  echo "run again with --push to publish them to $REMOTE"
  exit 0
fi

# Work out what the remote already has, peeling annotated tags to their commit.
# Tag objects created on a different machine have different SHAs but the same
# target, so compare targets, not tag object ids.
echo "checking $REMOTE ..."
declare -A REMOTE_TARGET=()
while read -r sha ref; do
  [[ -z "${ref:-}" ]] && continue
  name="${ref#refs/tags/}"
  if [[ "$name" == *'^{}' ]]; then
    REMOTE_TARGET["${name%^\{\}}"]="$sha"
  elif [[ -z "${REMOTE_TARGET[$name]:-}" ]]; then
    REMOTE_TARGET["$name"]="$sha"
  fi
done < <(git ls-remote --tags "$REMOTE")

declare -a TODO=()
for entry in "${TAGS[@]}"; do
  tag="${entry%%:*}"; commit="${entry##*:}"
  [[ "${REMOTE_TARGET[$tag]:-}" == "$commit" ]] || TODO+=("$tag")
done

already=$(( created - ${#TODO[@]} ))
echo "$already already correct on $REMOTE, ${#TODO[@]} to push"
[[ ${#TODO[@]} -eq 0 ]] && { echo "nothing to do"; exit 0; }

pushed=0
declare -a FAILED=()
batch=()

flush() {
  [[ ${#batch[@]} -eq 0 ]] && return 0
  local names=("${batch[@]##*:refs/tags/}")
  if git push "$REMOTE" "${batch[@]}"; then
    pushed=$(( pushed + ${#batch[@]} ))
  else
    FAILED+=("${names[@]}")
  fi
  batch=()
  return 0
}

for tag in "${TODO[@]}"; do
  batch+=("+refs/tags/$tag:refs/tags/$tag")
  [[ ${#batch[@]} -ge 60 ]] && flush
done
flush

echo
echo "pushed $pushed, failed ${#FAILED[@]}"

if [[ ${#FAILED[@]} -gt 0 ]]; then
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
