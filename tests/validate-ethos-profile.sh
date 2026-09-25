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
import json
import re
import tomllib
from pathlib import Path

profile_path = sys.argv[1]
profile = tomllib.load(open(profile_path, "rb"))
root = Path(profile_path).parent.parent
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
if set(roots) != {"docs", "openspec"}:
    raise SystemExit("profile retains roots rejected by the accepted typed contract")

normative = profile.get("normative_sources", [])
if not normative or len(set(normative)) != len(normative):
    raise SystemExit("profile must name unique current normative topics")
if "docs/charter.md" not in normative:
    raise SystemExit("profile must include the foundational charter")
if any(not (root / path).is_file() for path in normative):
    raise SystemExit("profile names a missing normative topic")

workspace = tomllib.loads((root / ".ethos/workspace.toml").read_text(encoding="utf-8"))
commit_policy = workspace.get("commit_policy")
if not isinstance(commit_policy, dict) or commit_policy != {
    "subject_pattern": "^.+$",
    "signing_required": True,
    "signing_format": "ssh",
}:
    raise SystemExit("workspace must require SSH-signed commits without fixed identity")

release = tomllib.loads((root / ".ethos/release.toml").read_text(encoding="utf-8"))
if "release" in release or "attestation" in release:
    raise SystemExit("release policy retains unused legacy declarations")
publication = release.get("publication", {})
if publication.get("local_verification_command") != "bash tools/ci/scripts/run-documentation-verification.sh":
    raise SystemExit("release policy does not bind local verification")
if publication.get("local_installation_command") != "npm ci --ignore-scripts":
    raise SystemExit("release policy does not bind local installation")
peers = {peer.get("id"): peer for peer in publication.get("peers", [])}
if set(peers) != {"gitlab", "github"}:
    raise SystemExit("release policy must declare both independent publication peers")
if peers["gitlab"].get("git_remote") != "origin" or peers["github"].get("git_remote") != "github":
    raise SystemExit("release policy points at the wrong Git remotes")

package = json.loads((root / "package.json").read_text(encoding="utf-8"))
lock = json.loads((root / "package-lock.json").read_text(encoding="utf-8"))
version = package["version"]
if lock["version"] != version or lock["packages"][""]["version"] != version:
    raise SystemExit("package and lockfile versions disagree")
charter = (root / "docs/charter.md").read_text(encoding="utf-8")
if not re.search(rf"\bv{re.escape(version)}\b", charter):
    raise SystemExit("charter version does not match the native package owner")
if not (root / "guidelines.md").exists() and int(version.split(".", 1)[0]) < 3:
    raise SystemExit("breaking guidance topology retained a pre-3.0 version")

print(
    "PASS ETHOS profile: default code-correctness gates="
    + ", ".join(expected_default)
    + "; signed commits are declared without fixed identity"
)
PY
