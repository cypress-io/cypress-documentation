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
#
# Written for bash 3.2 (the version macOS ships): no associative arrays.

set -o pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$DIR/rollback.tsv"
REMOTE="${REMOTE:-origin}"
PUSH=false
[ "${1:-}" = "--push" ] && PUSH=true

[ -f "$MANIFEST" ] || { echo "missing manifest: $MANIFEST" >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

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

# restore.tsv: tags whose remote target is not already the original commit
# delete.txt: tags that exist on the remote and should not
awk -F'\t' -v RESTORE="$TMP/restore.tsv" -v DELETE="$TMP/delete.txt" '
  NR == FNR { have[$1] = $2; onremote[$1] = 1; next }
  $1 ~ /^#/ || $1 == "" { next }
  $2 == "restore" { if (have[$1] != $3) print $1 "\t" $3 > RESTORE; next }
  $2 == "delete"  { if ($1 in onremote) print $1 > DELETE }
' "$TMP/remote.tsv" "$MANIFEST"

: >> "$TMP/restore.tsv"; : >> "$TMP/delete.txt"

# Original commits must be in the local object store to be restorable.
: > "$TMP/missing.txt"; : > "$TMP/restore_ok.tsv"
while IFS="$(printf '\t')" read -r tag commit; do
  [ -z "$tag" ] && continue
  if git cat-file -e "$commit^{commit}" 2>/dev/null; then
    printf '%s\t%s\n' "$tag" "$commit" >> "$TMP/restore_ok.tsv"
  else
    printf '%s (%s)\n' "$tag" "$commit" >> "$TMP/missing.txt"
  fi
done < "$TMP/restore.tsv"

restore=$(grep -c . < "$TMP/restore_ok.tsv")
delete=$(grep -c . < "$TMP/delete.txt")
missing=$(grep -c . < "$TMP/missing.txt")

echo "restore $restore tags to their original commits"
echo "delete  $delete tags created by create-release-tags.sh"

if [ "$missing" -gt 0 ]; then
  echo
  echo "WARNING: $missing original commits are not in the local object store." >&2
  echo "Fetch them before rolling back, e.g.:" >&2
  echo "  git fetch $REMOTE '+refs/*:refs/remotes/all/*'" >&2
  sed 's/^/  /' "$TMP/missing.txt" >&2
fi

if [ "$restore" -eq 0 ] && [ "$delete" -eq 0 ]; then
  echo "nothing to do — remote already matches the pre-existing state"
  exit 0
fi

if [ "$PUSH" != true ]; then
  echo
  echo "dry run — re-run with --push to apply"
  exit 0
fi

while IFS="$(printf '\t')" read -r tag commit; do
  [ -z "$tag" ] && continue
  git tag -f "$tag" "$commit" >/dev/null
done < "$TMP/restore_ok.tsv"

ok=0
failed=0
specs=""
n=0

flush() {
  [ -z "$specs" ] && return 0
  if git push "$REMOTE" $specs; then
    ok=$((ok + n))
  else
    failed=$((failed + n))
  fi
  specs=""
  n=0
  return 0
}

while IFS="$(printf '\t')" read -r tag commit; do
  [ -z "$tag" ] && continue
  specs="$specs +refs/tags/$tag:refs/tags/$tag"
  n=$((n + 1))
  [ "$n" -ge 60 ] && flush
done < "$TMP/restore_ok.tsv"
flush

while read -r tag; do
  [ -z "$tag" ] && continue
  specs="$specs :refs/tags/$tag"
  n=$((n + 1))
  [ "$n" -ge 60 ] && flush
done < "$TMP/delete.txt"
flush

while read -r tag; do
  [ -z "$tag" ] && continue
  git tag -d "$tag" >/dev/null 2>&1
done < "$TMP/delete.txt"

echo
echo "rollback: $ok refs updated, $failed failed"
[ "$failed" -gt 0 ] && exit 1
exit 0
