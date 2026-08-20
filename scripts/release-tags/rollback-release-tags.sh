#!/usr/bin/env bash
#
# Undo create-release-tags.sh, restoring the remote's tags to exactly the state
# they were in before it ran.
#
#   - 222 tags that the script created are deleted
#   - 80 tags that the script force-updated are restored to their original
#     commit, as lightweight tags (which is what they were)
#   - the 107 tags the script never touched are not touched here either
#
# Usage:
#   scripts/release-tags/rollback-release-tags.sh            # dry run, prints the plan
#   scripts/release-tags/rollback-release-tags.sh --push     # apply locally and push

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$DIR/rollback.tsv"
REMOTE="${REMOTE:-origin}"
PUSH=false
[[ "${1:-}" == "--push" ]] && PUSH=true

[[ -f "$MANIFEST" ]] || { echo "missing manifest: $MANIFEST" >&2; exit 1; }

declare -a RESTORE=() DELETE=() MISSING=()

while IFS=$'\t' read -r tag action commit; do
  [[ "$tag" == \#* || -z "$tag" ]] && continue
  case "$action" in
    restore)
      if git cat-file -e "$commit^{commit}" 2>/dev/null; then
        RESTORE+=("$tag:$commit")
      else
        MISSING+=("$tag ($commit)")
      fi
      ;;
    delete) DELETE+=("$tag") ;;
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

if ! $PUSH; then
  echo
  echo "dry run — re-run with --push to apply"
  exit 0
fi

for entry in "${RESTORE[@]}"; do
  git tag -f "${entry%%:*}" "${entry##*:}" >/dev/null
done

batch=()
flush() { [[ ${#batch[@]} -gt 0 ]] && git push "$REMOTE" "${batch[@]}" && batch=(); return 0; }

for entry in "${RESTORE[@]}"; do
  tag="${entry%%:*}"
  batch+=("+refs/tags/$tag:refs/tags/$tag")
  [[ ${#batch[@]} -ge 60 ]] && flush
done
flush

for tag in "${DELETE[@]}"; do
  batch+=(":refs/tags/$tag")
  [[ ${#batch[@]} -ge 60 ]] && flush
done
flush

for tag in "${DELETE[@]}"; do git tag -d "$tag" >/dev/null 2>&1 || true; done

echo "rollback complete"
