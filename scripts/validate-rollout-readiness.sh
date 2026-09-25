#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

[[ $# -eq 0 ]] || {
  echo "unknown argument: $1" >&2
  exit 2
}

python3 - "$ROOT" <<'PY'
from pathlib import Path
import re
import sys
import tomllib

root = Path(sys.argv[1])
profile = tomllib.loads((root / ".ethos/profile.toml").read_text(encoding="utf-8"))
normative = profile["normative_sources"]
route_contract = {
    "README.md": {"docs/README.md"},
    "AGENTS.md": {
        "docs/README.md",
        "docs/charter.md",
        "docs/governance/ethos.md",
    },
    "docs/README.md": {Path(path).name for path in normative},
}

for source, targets in route_contract.items():
    text = (root / source).read_text(encoding="utf-8")
    links = set(re.findall(r"\]\(([^)#]+)(?:#[^)]+)?\)", text))
    missing = sorted(targets - links)
    if missing:
        raise SystemExit(f"missing task routes in {source}: {', '.join(missing)}")

root_text = (root / "README.md").read_text(encoding="utf-8")
root_links = set(re.findall(r"\]\(([^)#]+)(?:#[^)]+)?\)", root_text))
duplicate_topics = sorted(root_links & set(normative))
if duplicate_topics:
    raise SystemExit(f"root entry repeats topic routes: {', '.join(duplicate_topics)}")

if (root / "docs/history/README.md").exists():
    raise SystemExit("redundant historical-context page remains")

for topic in sorted(route_contract["docs/README.md"] - {"charter.md"}):
    text = (root / "docs" / topic).read_text(encoding="utf-8")
    if "**When to use:**" not in text:
        raise SystemExit(f"missing reader entry in docs/{topic}")

if (root / "guidelines.md").exists():
    raise SystemExit("retired root monolith remains")

print("PASS navigation readiness; this is not team-adoption evidence")
PY
