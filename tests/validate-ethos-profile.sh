#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROFILE="$ROOT/.ethos/profile.toml"

[[ -f "$PROFILE" ]] || {
  echo "missing ETHOS profile: $PROFILE" >&2
  exit 1
}

gates_json="$(bash "$ROOT/scripts/ethos-repo.sh" quality gates --json)"
python3 - "$PROFILE" "$gates_json" <<'PY'
from __future__ import annotations

import json
import sys
import tomllib


profile_path, raw_gates = sys.argv[1:]
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
expected_descriptors = {*expected_default, "repository-root-binding"}
if set(by_id) != expected_descriptors:
    raise SystemExit(
        "profile descriptor ids must be exactly " + ", ".join(sorted(expected_descriptors))
    )
for gate_id, descriptor in by_id.items():
    if descriptor.get("command", [None])[0] != "bash":
        raise SystemExit(f"profile descriptor must invoke through bash: {gate_id}")

registry = json.loads(raw_gates)["data"]["gates"]
adopter_gate_ids = {
    gate_id for gate_id, gate in registry.items() if gate.get("profile") == "adopter"
}
if adopter_gate_ids != expected_descriptors:
    raise SystemExit(
        "profile descriptors must all compile into the adopter overlay; got "
        + ", ".join(sorted(adopter_gate_ids))
    )

print(
    "PASS ETHOS profile: default code-correctness gates="
    + ", ".join(expected_default)
    + "; explicit descriptor=repository-root-binding"
)
PY
