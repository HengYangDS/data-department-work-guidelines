# Design: DDWG post-archive proof repair

## Context

The official OpenSpec archive correctly moved the dual-Forge runner Change into
a dated archive carrier. That transition also left two adjacent headings in the
canonical `repository-governance` specification without required blank lines.
The repository proof uses markdownlint and Prettier, so the exact archive-result
HEAD is currently gapped even though the archived Change's pre-archive proof
passed.

## Goals / Non-Goals

**Goals:**

- Restore only the canonical Markdown layout needed for the repository's
  existing documentation proof.
- Preserve the archived runner Change, its historical digest, and its external
  evidence boundary unchanged.
- Record a separate active lifecycle carrier for the post-archive correction.

**Non-Goals:**

- Reinterpreting the previous proof as evidence for the repaired HEAD.
- Changing runner binding behavior, remote runner state, credentials, or Forge
  publications.

## Decisions

### Use a separate active Change

The correction is governed by a new active Change because the archived runner
carrier represents a completed historical transition. Its scope covers only the
canonical specification, this Change's evidence, and this Change's carrier.

**Alternative rejected:** edit the archived carrier. That would mutate
historical proof evidence and blur the boundary between archive result and a
later exact-HEAD proof.

### Repair layout without changing runner semantics

The implementation inserts the Markdown blank lines required by the existing
repository formatter and linter. It adds a narrowly worded governance
requirement only to make the post-archive repair boundary explicit.

**Alternative rejected:** relax Markdown checks. The checks are the existing
proof contract and a lint exemption would hide rather than repair the defect.

## Risks / Trade-offs

- **A later write overlaps a foreign lane's canonical specification work** →
  keep this repair limited to the owned lane and re-observe coordination before
  every controlled transition.
- **Local proof is misrepresented as hosted evidence** → retain explicit
  Forge-execution exclusions in the proposal, claim, and Chronicle.
- **A new active Change expands into runner deployment** → stop at archive and
  local proof; external deployment remains separately evidenced.
