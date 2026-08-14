#!/usr/bin/env bash
# Runnable first-pass claim/label audit for TerraCascade (Task 2 of 04_MODEL_RESEARCH_AND_INTEGRATION.md).
# Usage: bash qa/scripts/run_claim_audit.sh
#
# This is a heuristic grep-based scan, not a substitute for human review — it
# catches the mechanical part (forbidden words, missing label keys) so the
# audit owner spends their time on judgment calls, not searching.
#
# Exit code is always 0 (informational tool); read the output.

set -u
cd "$(dirname "$0")/../.."

SEARCH_EXCLUDES=(--exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=.next --exclude-dir=qa)
SEARCH_GLOBS=(--include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' --include='*.json' --include='*.md' --include='*.mdx')

echo "== TerraCascade claim/label audit — $(date -u +%Y-%m-%dT%H:%M:%SZ) =="
echo

echo "--- 1. Forbidden language scan ---"
echo "(word-boundary matches for: live, real-time, predictive, 'order evacuation', 'open gate now', 'send alert', 'funding decision', landslide)"
FORBIDDEN_PATTERN='\b(live|real-time|real time|predictive)\b|order evacuation|open gate now|send alert|funding decision|landslide'
if grep -rniE "${SEARCH_EXCLUDES[@]}" "${SEARCH_GLOBS[@]}" -E "$FORBIDDEN_PATTERN" . 2>/dev/null; then
  echo
  echo "^^ Review each hit above. Some may be false positives (e.g. 'deliver', 'olive', a code comment quoting this very audit script) — use judgment, don't blind-delete."
else
  echo "No matches found."
fi
echo

echo "--- 2. Candidate hazard/HazardEvent fixture files ---"
CANDIDATES=$(grep -rliE "${SEARCH_EXCLUDES[@]}" "${SEARCH_GLOBS[@]}" -E 'HazardEvent|hazard_event|floodExtent|flood_extent' . 2>/dev/null)
if [ -z "$CANDIDATES" ]; then
  echo "No candidate HazardEvent fixture files found yet — nothing to check against Prithvi-100M-sen1floods11 requirements."
else
  echo "$CANDIDATES"
  echo
  echo "--- 2a. Required-field check on each candidate ---"
  for f in $CANDIDATES; do
    echo "File: $f"
    for req in "Prithvi-100M-sen1floods11" "verified-demo" "single-timestamp inference" "not a live feed"; do
      if grep -qiF "$req" "$f"; then
        echo "  [OK]   contains: $req"
      else
        echo "  [MISSING] does not contain: $req"
      fi
    done
    echo
  done
fi

echo "--- 3. Numeric fields lacking a nearby source/status/limitations key (heuristic) ---"
echo "(flags .json files with a numeric-looking 'cost'/'population'/'confidence' key that has no 'source', 'status', or 'limitations' key anywhere in the same file — file-level heuristic, not field-level; always confirm by hand)"
JSON_FILES=$(grep -rliE "${SEARCH_EXCLUDES[@]}" --include='*.json' -E '"(cost|population|confidence|casualties|damage)"[[:space:]]*:[[:space:]]*[0-9]' . 2>/dev/null)
if [ -z "$JSON_FILES" ]; then
  echo "No matching JSON fixtures found yet."
else
  for f in $JSON_FILES; do
    if grep -qiE '"(source|status|limitations)"' "$f"; then
      echo "  [OK, has label keys somewhere]  $f"
    else
      echo "  [FLAG, no source/status/limitations key found in file]  $f"
    fi
  done
fi

echo
echo "== End of automated pass. Log every finding above (or its dismissal as a false positive) in qa/claim_audit_findings.md with file:line, what's wrong, and suggested fix. =="
