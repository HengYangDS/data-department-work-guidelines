#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

[[ $# -eq 0 ]] || {
  echo "unknown argument: $1" >&2
  exit 2
}

python3 - "$ROOT" <<'PY'
from __future__ import annotations

import os
from pathlib import Path
import re
import subprocess
import sys


root = Path(sys.argv[1]).resolve()
excluded_roots = {".git", ".ethos", "build", "node_modules"}
flat_suffixes = {".md", ".toml", ".yaml", ".yml", ".json"}
flat_names = {"AGENTS.md", ".gitlab-ci.yml"}
violations: list[str] = []
cjk_text = re.compile(r"[\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]")


def report(path: Path, line: int, message: str) -> None:
    violations.append(f"{path.relative_to(root)}:{line}: {message}")


def repository_text_files() -> list[Path]:
    result = subprocess.run(
        ["git", "-C", str(root), "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
        capture_output=True,
        check=False,
    )
    if result.returncode == 0:
        return sorted({root / os.fsdecode(name) for name in result.stdout.split(b"\0") if name})
    if (root / ".git").exists():
        raise SystemExit("could not inventory tracked and candidate files")
    return sorted(
        path
        for path in root.rglob("*")
        if path.is_file()
        and not any(part in {".git", "build", "node_modules"} for part in path.relative_to(root).parts)
    )


def blank_runs(lines: list[str]) -> list[tuple[int, int]]:
    runs: list[tuple[int, int]] = []
    start: int | None = None
    for index, line in enumerate(lines, start=1):
        if line.strip():
            if start is not None:
                runs.append((start, index - 1))
                start = None
        elif start is None:
            start = index
    if start is not None:
        runs.append((start, len(lines)))
    return runs


def validate_flat(path: Path, lines: list[str]) -> None:
    for start, end in blank_runs(lines):
        if end > start:
            report(path, end, "consecutive blank lines are not allowed")


def heredoc_body_lines(lines: list[str]) -> set[int]:
    ignored: set[int] = set()
    delimiter: str | None = None
    for line_number, line in enumerate(lines, start=1):
        if delimiter is not None:
            ignored.add(line_number)
            if line.strip() == delimiter:
                delimiter = None
            continue
        match = re.search(
            r"<<-?\s*(?:'([^']+)'|\"([^\"]+)\"|([A-Za-z_][A-Za-z0-9_]*))",
            line,
        )
        if match:
            delimiter = next(group for group in match.groups() if group is not None)
    return ignored


def validate_python(path: Path, lines: list[str]) -> None:
    top_level_definitions = {
        index
        for index, line in enumerate(lines, start=1)
        if re.match(r"^(?:async\s+def|class|def)\s+", line)
    }
    for start, end in blank_runs(lines):
        following = end + 1
        allowed = (
            end - start + 1 == 2
            and following in top_level_definitions
            and start > 1
        )
        if end > start and not allowed:
            report(path, end, "only top-level Python definitions may use two blank lines")
    ordered = sorted(top_level_definitions)
    for _, current in zip(ordered, ordered[1:]):
        blank_count = 0
        for line in reversed(lines[: current - 1]):
            if line.strip():
                break
            blank_count += 1
        if blank_count < 2:
            report(path, current, "top-level Python definitions require two blank lines")


def validate_shell(path: Path, lines: list[str]) -> None:
    ignored = heredoc_body_lines(lines)
    top_level_functions = {
        index
        for index, line in enumerate(lines, start=1)
        if index not in ignored and re.match(r"^[A-Za-z_][A-Za-z0-9_]*\(\)\s*\{", line)
    }
    filtered = [line if index not in ignored else "# heredoc" for index, line in enumerate(lines, start=1)]
    for start, end in blank_runs(filtered):
        following = end + 1
        allowed = (
            end - start + 1 == 2
            and following in top_level_functions
            and start > 1
        )
        if end > start and not allowed:
            report(path, end, "only top-level shell functions may use two blank lines")
    ordered = sorted(top_level_functions)
    for _, current in zip(ordered, ordered[1:]):
        blank_count = 0
        for line in reversed(filtered[: current - 1]):
            if line.strip():
                break
            blank_count += 1
        if blank_count < 2:
            report(path, current, "top-level shell functions require two blank lines")


for path in sorted(root.rglob("*")):
    if not path.is_file():
        continue
    relative = path.relative_to(root)
    if any(part in excluded_roots for part in relative.parts):
        continue
    if path.suffix not in flat_suffixes | {".py", ".sh"} and path.name not in flat_names:
        continue
    lines = path.read_text(encoding="utf-8").splitlines()
    if path.suffix == ".py":
        validate_python(path, lines)
    elif path.suffix == ".sh":
        validate_shell(path, lines)
    else:
        validate_flat(path, lines)

for path in repository_text_files():
    if not path.is_file() or path.is_symlink():
        continue
    content = path.read_bytes()
    if b"\0" in content:
        continue
    try:
        lines = content.decode("utf-8").splitlines()
    except UnicodeDecodeError:
        continue
    for number, line in enumerate(lines, start=1):
        if cjk_text.search(line):
            report(path, number, "CJK text is not allowed in English repository files")

if violations:
    raise SystemExit("\n".join(violations))

print("PASS text layout and English repository text boundary")
PY
