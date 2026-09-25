#!/usr/bin/env bash
# Install the kit into a project.
#
#   ./kit/install.sh <project-dir> [--update] [skill ...]
#
#   skills     kit/skills/<name>/  -> <project>/.claude/skills/<name>/   (all 8 unless named)
#   knowledge  knowledge/          -> <project>/.claude/knowledge/
#   data files kit/templates/*.md  -> <project>/.ai/   (not CLAUDE-md-starter.md — paste that by hand)
#
# Anything already present is SKIPPED. --update overwrites skills + knowledge (upstream-first:
# dev-notes is the source, project copies follow it). Note: --update replaces a skill's filled-in
# Project Configuration block, so re-apply it afterwards. The .ai/ data files are project state
# and are never overwritten, even with --update.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
[ $# -ge 1 ] || { sed -n 4,13p "$0" | sed 's/^# \{0,1\}//'; exit 1; }
PROJECT="$1"; shift
[ -d "$PROJECT" ] || { echo "no such directory: $PROJECT" >&2; exit 1; }

UPDATE=0; SKILLS=()
for arg in "$@"; do
  case "$arg" in
    --update) UPDATE=1 ;;
    *) [ -d "$REPO/kit/skills/$arg" ] || { echo "unknown skill: $arg" >&2; exit 1; }
       SKILLS+=("$arg") ;;
  esac
done
[ ${#SKILLS[@]} -gt 0 ] || for d in "$REPO"/kit/skills/*/; do SKILLS+=("$(basename "$d")"); done

# copy <src> <dest> <overwritable 0|1>
copy() {
  if [ -e "$2" ] && [ "$UPDATE" -eq 0 -o "$3" -eq 0 ]; then printf "  %-7s %s\n" skip "${2#$PROJECT/}"; return; fi
  [ -e "$2" ] && verb=update || verb=add
  mkdir -p "$(dirname "$2")"; rm -rf "$2"; cp -R "$1" "$2"
  printf "  %-7s %s\n" "$verb" "${2#$PROJECT/}"
}

echo "skills:";    for s in "${SKILLS[@]}"; do copy "$REPO/kit/skills/$s" "$PROJECT/.claude/skills/$s" 1; done
echo "knowledge:"; copy "$REPO/knowledge" "$PROJECT/.claude/knowledge" 1
echo "data files:"
for t in "$REPO"/kit/templates/*.md; do
  [ "$(basename "$t")" = CLAUDE-md-starter.md ] && continue
  copy "$t" "$PROJECT/.ai/$(basename "$t")" 0
done
echo "next: fill each SKILL.md's Project Configuration block; paste kit/templates/CLAUDE-md-starter.md into CLAUDE.md"
