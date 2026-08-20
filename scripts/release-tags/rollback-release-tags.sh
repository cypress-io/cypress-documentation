#!/usr/bin/env bash
#
# Undo create-release-tags.sh, restoring the remote's tags to exactly the state
# they were in before it ran.
#
#   - 222 tags that the script creates are deleted
#   - 80 tags that the script force-updates are restored to their original
#     commit, as lightweight tags (which is what they were)
#   - the 107 tags the script never touches are not touched here either
#
# Safe to run against a partially applied state: it inspects the remote and
# only acts on refs that actually need changing. None of the original commits
# contain .github/workflows, so unlike the create script this does not need a
# credential with `workflow` scope.
#
# Usage:
#   scripts/release-tags/rollback-release-tags.sh            # dry run, prints the plan
#   scripts/release-tags/rollback-release-tags.sh --push     # apply locally and push

set -uo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$DIR/rollback.tsv"
REMOTE="${REMOTE:-origin}"
PUSH=false
[[ "${1:-}" == "--push" ]] && PUSH=true

[[ -f "$MANIFEST" ]] || { echo "missing manifest: $MANIFEST" >&2; exit 1; }

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

declare -a RESTORE=() DELETE=() MISSING=()

while IFS=$'\t' read -r tag action commit; do
  [[ "$tag" == \#* || -z "$tag" ]] && continue
  case "$action" in
    restore)
      # already back at its original commit? nothing to do
      [[ "${REMOTE_TARGET[$tag]:-}" == "$commit" ]] && continue
      if git cat-file -e "$commit^{commit}" 2>/dev/null; then
        RESTORE+=("$tag:$commit")
      else
        MISSING+=("$tag ($commit)")
      fi
      ;;
    delete)
      # only delete what is actually on the remote
      [[ -n "${REMOTE_TARGET[$tag]:-}" ]] && DELETE+=("$tag")
      ;;
  esac
done < "$MANIFEST"

echo "restore ${#RESTORE[@]} tags to their original commits"
echo "delete  ${#DELETE[@]} tags created by create-release-tags.sh"

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo
  echo "WARNING: ${#MISSING[@]} original commits are not in the local object store." >&2
  echo "Fetch them before rolling back, e.g.:" >&2
  echo "  git fetch $REMOTE '+refs/*:refs/remotes/all/*'" >&2
  printf '  %s\n' "${MISSING[@]}" >&2
fi

if [[ ${#RESTORE[@]} -eq 0 && ${#DELETE[@]} -eq 0 ]]; then
  echo "nothing to do — remote already matches the pre-existing state"
  exit 0
fi

if ! $PUSH; then
  echo
  echo "dry run — re-run with --push to apply"
  exit 0
fi

for entry in "${RESTORE[@]}"; do
  git tag -f "${entry%%:*}" "${entry##*:}" >/dev/null
done

ok=0
declare -a FAILED=()
batch=()

flush() {
  [[ ${#batch[@]} -eq 0 ]] && return 0
  if git push "$REMOTE" "${batch[@]}"; then
    ok=$(( ok + ${#batch[@]} ))
  else
    FAILED+=("${batch[@]}")
  fi
  batch=()
  return 0
}

for entry in "${RESTORE[@]}"; do
  batch+=("+refs/tags/${entry%%:*}:refs/tags/${entry%%:*}")
  [[ ${#batch[@]} -ge 60 ]] && flush
done
flush

for tag in "${DELETE[@]}"; do
  batch+=(":refs/tags/$tag")
  [[ ${#batch[@]} -ge 60 ]] && flush
done
flush

for tag in "${DELETE[@]}"; do git tag -d "$tag" >/dev/null 2>&1 || true; done

echo
echo "rollback: $ok refs updated, ${#FAILED[@]} failed"
[[ ${#FAILED[@]} -gt 0 ]] && exit 1
exit 0
