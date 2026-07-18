#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

[[ $# -eq 0 ]] || {
  echo "unknown argument: $1" >&2
  exit 2
}

python3 - "$ROOT" <<'PY'
from __future__ import annotations

from pathlib import Path
import re
import shlex
import sys


root = Path(sys.argv[1]).resolve()
decision_root = root / "docs" / "decisions"

if (root / "docs" / "superpowers").exists():
    raise SystemExit(
        "retired execution-method documents remain in current docs topology: "
        "docs/superpowers"
    )

legacy_decisions = sorted(decision_root.glob("20??-??-??-*.md"))
if legacy_decisions:
    names = ", ".join(path.relative_to(root).as_posix() for path in legacy_decisions)
    raise SystemExit(f"date-only decision records remain: {names}")

accepted_root = decision_root / "accepted"
records = sorted(accepted_root.glob("DR-[0-9][0-9][0-9][0-9]-*.md"))
if not records:
    raise SystemExit("missing numbered accepted DR records")

required_sections = [
    "Context",
    "Decision",
    "Alternatives Rejected",
    "Consequences and Boundary",
    "Evidence and Revisit",
]


FENCE_OPEN = re.compile(r"^(?P<indent> {0,3})(?P<fence>`{3,}|~{3,})(?P<info>.*)$")
PROMPT = re.compile(r"^\s*(?:\$\s+|[A-Za-z0-9_.-]+@[A-Za-z0-9_.-]+(?::[^$#\s]+)?\$\s+)")
LIST_PREFIX = re.compile(r"^\s*(?:[-*+] |\d+[.)] )")
INLINE_CODE = re.compile(r"(?P<tick>`+)(?P<code>[^\n]*?)(?P=tick)")
SHELL_FENCE_LANGUAGES = frozenset(
    {"bash", "console", "fish", "shell", "shell-session", "sh", "terminal", "zsh"}
)
COMMAND_HEADS = frozenset({"ethos", "openspec"})
SHELL_LAUNCHERS = frozenset({"bash", "fish", "sh", "zsh"})
COMMAND_WRAPPERS = frozenset({"command", "env", "nice", "nohup", "sudo", "time"})
COMMAND_SUBCOMMANDS = {
    "ethos": frozenset(
        {
            "audit",
            "fleet",
            "handoff",
            "hook",
            "land",
            "lane",
            "openspec",
            "orient",
            "plan",
            "playbooks",
            "prove",
            "publish",
            "quality",
            "report",
            "status",
        }
    ),
    "openspec": frozenset({"archive", "list", "show", "status", "validate"}),
}


def fenced_blocks(text: str) -> list[tuple[str, int, list[str]]]:
    """Return Markdown fence info, start line, and body without regex scanning prose."""
    blocks: list[tuple[str, int, list[str]]] = []
    opening: tuple[str, int, str, list[str]] | None = None
    for line_number, line in enumerate(text.splitlines(), start=1):
        if opening is None:
            match = FENCE_OPEN.match(line)
            if match:
                opening = (
                    match.group("fence")[0],
                    len(match.group("fence")),
                    match.group("info").strip(),
                    [],
                )
                start_line = line_number
            continue
        fence_char, fence_length, info, body = opening
        closing = re.match(rf"^ {{0,3}}{re.escape(fence_char)}{{{fence_length},}}\s*$", line)
        if closing:
            blocks.append((info, start_line, body))
            opening = None
        else:
            body.append(line)
    return blocks


def shell_tokens(source: str) -> list[str]:
    """Tokenize one potential shell line; malformed snippets remain non-executable prose."""
    try:
        return shlex.split(source, comments=True, posix=True)
    except ValueError:
        return []


def executable_tokens(tokens: list[str]) -> list[str]:
    """Remove common shell prefixes before classifying a command head."""
    remaining = list(tokens)
    while remaining and re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", remaining[0]):
        remaining.pop(0)
    while remaining and remaining[0] in COMMAND_WRAPPERS:
        wrapper = remaining.pop(0)
        if wrapper == "env":
            while remaining and (
                remaining[0].startswith("-")
                or re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", remaining[0])
            ):
                remaining.pop(0)
        elif wrapper in {"nice", "sudo"}:
            while remaining and remaining[0].startswith("-"):
                remaining.pop(0)
    return remaining


def command_invocation(source: str, *, shell_context: bool, fenced: bool = False) -> bool:
    """Recognize execution syntax without treating a path or concept as a command."""
    candidate = source.strip()
    if not candidate or candidate.startswith("#"):
        return False
    prompt = PROMPT.match(candidate)
    if prompt:
        return True
    tokens = shell_tokens(candidate)
    if not tokens:
        return False
    if shell_context:
        # A shell-labelled fence is an execution/log carrier once it has a non-comment line.
        return True
    tokens = executable_tokens(tokens)
    if not tokens:
        return False
    head = tokens[0]
    if head in SHELL_LAUNCHERS:
        return len(tokens) > 1
    if head.startswith("./scripts/"):
        # A bare path remains an artifact reference even in a generic text fence. It
        # becomes a command only when a shell fence or syntax supplies execution context.
        return shell_context or len(tokens) > 1
    if head in COMMAND_HEADS:
        # Use the public command grammar instead of rejecting a natural-language mention
        # such as "ethos lifecycle". A flag is also a concrete CLI invocation.
        return len(tokens) > 1 and (
            tokens[1].startswith("-") or tokens[1] in COMMAND_SUBCOMMANDS[head]
        )
    return False


def execution_violation(text: str) -> str | None:
    """Find structured command/log content, leaving prose and Markdown links untouched."""
    for info, start_line, body in fenced_blocks(text):
        language = info.lower().split(maxsplit=1)[0] if info else ""
        shell_context = language in SHELL_FENCE_LANGUAGES
        for offset, line in enumerate(body, start=1):
            if command_invocation(line, shell_context=shell_context, fenced=True):
                return f"fenced execution content at line {start_line + offset}"

    fenced_line_numbers = {
        line_number
        for _, start_line, body in fenced_blocks(text)
        for line_number in range(start_line + 1, start_line + 1 + len(body))
    }
    for line_number, line in enumerate(text.splitlines(), start=1):
        if line_number in fenced_line_numbers:
            continue
        visible = line
        for match in INLINE_CODE.finditer(line):
            if command_invocation(match.group("code"), shell_context=False):
                return f"inline command invocation at line {line_number}"
            visible = visible.replace(match.group(0), "")
        candidate = LIST_PREFIX.sub("", visible).strip()
        if command_invocation(candidate, shell_context=False):
            return f"shell prompt or command invocation at line {line_number}"
    return None


for record in records:
    text = record.read_text(encoding="utf-8")
    decision_id = record.name.split("-", 2)[0] + "-" + record.name.split("-", 2)[1]
    if f"decision_id: {decision_id}" not in text:
        raise SystemExit(f"DR identity mismatch: {record.relative_to(root)}")
    if "decision_status: accepted" not in text:
        raise SystemExit(f"DR decision status missing: {record.relative_to(root)}")
    headings = re.findall(r"^## ([^\n]+?)\s*$", text, flags=re.MULTILINE)
    if headings != required_sections:
        raise SystemExit(
            f"DR sections must be exactly {', '.join(required_sections)}: "
            f"{record.relative_to(root)}"
        )
    violation = execution_violation(text)
    if violation:
        raise SystemExit(
            f"DR contains {violation}: {record.relative_to(root)}"
        )

print(f"PASS governance boundary: accepted_drs={len(records)}")
PY
