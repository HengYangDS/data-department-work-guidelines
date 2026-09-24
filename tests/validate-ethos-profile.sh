#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROFILE="$ROOT/.ethos/profile.toml"

[[ -f "$PROFILE" ]] || {
  echo "missing ETHOS profile: $PROFILE" >&2
  exit 1
}

python3 - "$PROFILE" <<'PY'
from __future__ import annotations

import sys
import tomllib

profile_path = sys.argv[1]
profile = tomllib.load(open(profile_path, "rb"))
proof = profile["proof"]
expected_default = ["docs-integrity", "markdown-format"]
if proof.get("code_correctness_gates") != expected_default:
    raise SystemExit(
        "profile code_correctness_gates must be exactly " + ", ".join(expected_default)
    )

descriptors = proof.get("gates")
if not isinstance(descriptors, list):
    raise SystemExit("profile proof.gates must be a list")
by_id = {descriptor.get("id"): descriptor for descriptor in descriptors}
if set(by_id) != set(expected_default):
    raise SystemExit(
        "profile descriptor ids must be exactly " + ", ".join(expected_default)
    )
for gate_id, descriptor in by_id.items():
    if descriptor.get("command", [None])[0] != "bash":
        raise SystemExit(f"profile descriptor must invoke through bash: {gate_id}")

roots = profile.get("roots", {})
if set(roots) - {"rules", "docs", "openspec", "agent_skills"}:
    raise SystemExit("profile retains roots rejected by the accepted typed contract")

print(
    "PASS ETHOS profile: default code-correctness gates="
    + ", ".join(expected_default)
    + "; root binding is a separate repository-native validation"
)
PY
