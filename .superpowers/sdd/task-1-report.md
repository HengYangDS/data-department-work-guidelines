# Task 1 implementation report

## Scope and implementation

Implemented the documentation quality gate in `scripts/validate-docs.sh` and
made it executable. The gate resolves the repository root, validates command
availability, runs Markdown lint, checks local links and fenced blocks, checks
four canonical contracts, extracts Mermaid blocks, and renders each extracted
block to SVG.

The default is strict: it requires exactly five Mermaid diagrams. The explicit
`--allow-incomplete` mode changes only the expected Mermaid count to zero, so
it accepts no diagrams and skips rendering because no `.mmd` files are created.
The optional `--render-dir` retains artifacts; otherwise, a temporary directory
is removed on exit.

Normalized the three owned Markdown documents by replacing metadata `<br>` tags
with separate blockquote paragraphs. Wrapped prose that markdownlint flagged;
the retrospective decision matrix was converted to equivalent bullets because
Markdown table rows cannot be wrapped without changing their structure.

## Problem, basis, and net gain

The prior baseline had no reusable gate, and owned Markdown failed lint for
inline HTML and line length. The task brief specifies the required interface,
canonical contracts, Mermaid counts, and rendering command. The gate creates a
single repeatable quality boundary; the Markdown normalization removes the
current lint violations without changing the stated rules or decisions.

## Self-review

- Confirmed `set -euo pipefail`, argument rejection, repository-root resolution,
  missing-command detection, temporary artifact cleanup, and executable mode.
- Confirmed strict mode defaults to five diagrams; incomplete mode accepts only
  zero diagrams and has no render iteration when extraction produces none.
- Confirmed the canonical phrase list and local-link/fence validation exactly
  match the task brief.
- Kept modifications within the assigned documentation files and the requested
  task report.

## Test evidence

- **Baseline invocation before implementation**: expected failure because the
  script did not exist, exit 127.
- **`markdownlint-cli2` on three owned Markdown files**: pass, with
  `Summary: 0 error(s)`.
- **`bash -n scripts/validate-docs.sh`**: pass, exit 0.
- **Unknown argument (`--unknown`)**: pass, exit 2 with
  `unknown argument: --unknown`.
- **Incomplete gate with `/tmp/data-guidelines-qa`**: blocked before Mermaid
  validation by unowned task brief lint errors.
- **Strict default gate**: blocked at the same lint precondition; it would then
  require five diagrams.

## Concern and review condition

The required full-repository command `markdownlint-cli2 '**/*.md'` currently
fails on the unowned `.superpowers/sdd/task-1-brief.md`: MD041 on line 1 and
MD012 on line 186. Consequently, both gate modes stop before the Python
Mermaid-count check; the required successful incomplete-mode end-to-end run
cannot be evidenced without a controller-owned correction or exclusion for that
brief. Once that lint precondition is corrected, rerun:

```bash
./scripts/validate-docs.sh --allow-incomplete \
  --render-dir /tmp/data-guidelines-qa
```

Expected result: zero diagrams extracted, no `.mmd` or SVG artifacts, and exit
0. Strict final mode should remain failing until exactly five diagrams are added
and rendered successfully.

## Review-fix evidence (2026-07-12)

### Root cause and correction

The gate passed both `**/*.md` directly to `markdownlint-cli2` and `rglob("*.md")`
to the structural scan. Both traversals therefore included ignored
`.superpowers/sdd` collaboration artifacts, while the task brief itself fails
repository lint. The former fence check counted raw ````` substrings; a valid
longer fenced code block that contains a three-backtick example therefore
looked unbalanced.

`scripts/validate-docs.sh` now excludes `.superpowers/sdd/**` in both paths:
the markdownlint glob receives `#.superpowers/sdd/**`, and the Python file list
filters the same root-relative path. Its fenced-block parser is line-oriented:
it recognizes Markdown opening fences of three or more backticks or tildes,
closes only with the same marker type and at least the opening length, detects
true unclosed fences, and extracts only `mermaid`-labelled blocks. Root-local
link checks, canonical phrase checks, strict default `EXPECTED_MERMAID=5`, the
explicit zero-only `--allow-incomplete` mode, and `mmdc` rendering remain in
place.

### Fresh verification

- `bash -n scripts/validate-docs.sh`: pass (exit 0).
- `./scripts/validate-docs.sh --unknown`: pass (exit 2); output:
  `unknown argument: --unknown`.
- Targeted fence regression fixture: the pre-fix script rejected a valid
  four-backtick fenced sample containing a three-backtick code sample with
  `unbalanced fenced block: guidelines.md` (exit 1). The fixed script accepted
  the same fixture (exit 0), reporting one Markdown file and zero diagrams.
- Fresh required invocation:
  `./scripts/validate-docs.sh --allow-incomplete --render-dir /tmp/data-guidelines-task1-fix-qa`
  passed (exit 0). `markdownlint-cli2` reported `Linting: 8 file(s)` and
  `Summary: 0 error(s)`; the structural scan reported
  `validated 8 Markdown files and extracted 0 diagrams`.
- `/tmp/data-guidelines-task1-fix-qa` is empty after that successful
  zero-diagram run. This is expected: no `.mmd` input is generated, so no
  Mermaid/SVG render artifact is expected.
- Strict default contract checked separately: it passed lint, then failed with
  `expected 5 Mermaid diagrams, found 0` (exit 1), preserving the required
  final-mode exact-five gate until Task 3 supplies diagrams.

### Residual concern

Strict five-diagram rendering remains intentionally deferred until Task 3 adds
exactly five Mermaid diagrams; the current zero-diagram pre-body state has no
render inputs or artifacts by design.

## P1 follow-up evidence (2026-07-12)

### Scope of correction

The repository `.gitignore` excludes all `.superpowers/`, not only
`.superpowers/sdd/`. The gate now passes `#.superpowers/**` to
`markdownlint-cli2` and excludes every Markdown path whose root-relative first
component is `.superpowers` from Python structural discovery. Tracked
documentation remains included in both checks. The strict five-diagram
default, zero-only `--allow-incomplete` mode, syntax-aware fence handling,
canonical phrase and local-link checks, and `mmdc` rendering are unchanged.

### Fresh regression evidence

- **Red fixture before the correction**: created the ignored temporary file
  `.superpowers/other/ignored-unclosed.md` with an unclosed fenced block. The
  pre-fix gate reached structural discovery and failed with
  `unbalanced fenced block: .superpowers/other/ignored-unclosed.md` (exit 1).
- **`bash -n scripts/validate-docs.sh`**: pass, exit 0.
- **Fresh ignored-artifact QA**: recreated the same temporary ignored artifact
  and ran
  `./scripts/validate-docs.sh --allow-incomplete
  --render-dir /tmp/data-guidelines-task1-p1-green`. It passed, with
  `Finding: **/*.md !.superpowers/**`, `Linting: 8 file(s)`,
  `Summary: 0 error(s)`, and
  `validated 8 Markdown files and extracted 0 diagrams`.
- **Zero-diagram artifact check**: the supplied render directory contained no
  files after the successful run; no Mermaid source or SVG was generated.
- **Fixture cleanup**: removed `.superpowers/other/ignored-unclosed.md` and
  its temporary directory after testing; the fixture was not committed.

### Residual concern

Strict final mode still intentionally requires exactly five Mermaid diagrams;
zero-diagram pre-body mode is the verified passing state until Task 3 adds and
renders those diagrams.
