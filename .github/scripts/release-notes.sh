#!/usr/bin/env bash
# Prints the Markdown release notes for the commits in <from>..<to>, grouped by
# Conventional Commit type. Merge commits and the version bump (chore(release)) are left out.
#
# Usage: release-notes.sh <from> <to> <owner/repo>
set -euo pipefail

from=$1
to=$2
repo=$3

types=(feat fix perf refactor style docs build test chore)
declare -A titles=(
  [feat]='Features'
  [fix]='Bug fixes'
  [perf]='Performance'
  [refactor]='Refactoring'
  [style]='Style'
  [docs]='Documentation'
  [build]='Build and CI'
  [test]='Tests'
  [chore]='Other'
)
declare -A sections=()

pattern='^([a-z]+)(\(([^)]*)\))?(!)?: (.+)$'

while IFS=$'\t' read -r sha subject; do
  if [[ $subject =~ $pattern ]]; then
    type=${BASH_REMATCH[1]}
    scope=${BASH_REMATCH[3]}
    breaking=${BASH_REMATCH[4]}
    text=${BASH_REMATCH[5]}
  else
    type=chore scope='' breaking='' text=$subject
  fi

  [[ $type == chore && $scope == release ]] && continue
  case $type in
    ci) type=build ;;
    feat | fix | perf | refactor | style | docs | build | test) ;;
    *) type=chore ;;
  esac

  # Keep subjects literal: no @mentions (a zero-width space follows the @) and no HTML.
  text=${text//@/@​}
  text=${text//</&lt;}
  text=${text//>/&gt;}

  line='- '
  [[ -n $breaking ]] && line+='**BREAKING** '
  [[ -n $scope ]] && line+="**$scope:** "
  line+="$text ([${sha:0:7}](https://github.com/$repo/commit/$sha))"
  sections[$type]+="$line"$'\n'
done < <(git log --no-merges --reverse --format='%H%x09%s' "$from..$to")

empty=true
for type in "${types[@]}"; do
  [[ -z ${sections[$type]:-} ]] && continue
  empty=false
  printf '## %s\n\n%s\n' "${titles[$type]}" "${sections[$type]}"
done

if $empty; then
  printf 'No changes since the previous release.\n\n'
fi
