# Design

## Context

See the [proposal](proposal.md) for the observed admission gap. The existing
`gitFiles()` inventory includes tracked and unignored candidate paths. Its
`currentMarkdown()` reader selection deliberately omits archived Changes.
Reusing that selection for formatting and lint silently exempts 117 of the
repository's 138 present Markdown files. The separate spacing rule exempts
archives and files without filename extensions. A direct negative probe
confirms both spacing exemptions. All 194 present tracked files have no
repeated blank line, and all
138 Markdown files already pass the locked Prettier and Markdown lint commands.

## Goals / Non-Goals

**Goal:** The existing verifier rejects malformed retained text at the same
source boundary regardless of archive status or filename extension, while
keeping current reader checks and historical authority separate.

**Non-goals:** Rewrite archived decisions or Change history, lint historical
links against today's route, add 87 archival technical names to the current
spelling dictionary, introduce another formatter or configuration file, or
claim team adoption from a source gate.

## Decisions

### Separate source hygiene from current reader scope

Add one `sourceMarkdown(files)` selection for every `.md` path in the existing
Git inventory. Use it for Prettier and Markdown lint. Keep `currentMarkdown()`
as its narrower reader subset for spelling, links, and document metadata. This
preserves the reason those latter checks exclude archives without allowing an
archive to bypass source hygiene. An archived text remains a historical record;
checking its present bytes does not certify that its original lifecycle was
correct.

Alternative rejected: redefine `currentMarkdown()` to include archives and
then scatter special-case exclusions through every reader check. That makes
one name mean two incompatible scopes.

### Check decoded text, not a filename extension list

`checkTextLayout()` already decodes every Git-inventoried, non-symlink,
non-NUL candidate as UTF-8 and checks it for CJK text. Run the existing
`blankLineError()` on that same decoded text. Remove the extension and archive
exceptions. The check still reports the original path and line; it does not
parse Markdown or invent a second formatting policy. Negative tests cover an
archived Markdown path and text without a filename extension; a valid single
blank line and the current reader selection remain accepted.

Alternative rejected: add `.gitignore`, `LICENSE`, or archive paths to an
ever-growing allowlist. A source rule based on filename accidents would be
fragile and would miss the next candidate without a filename extension.

### Treat the tighter gate as a compatible correction

The one-blank-line rule and locked format/lint tools are already declared.
The corrected verifier enforces that existing promise across retained source;
it does not change a team work obligation or public command name. Prepare
`v5.0.5` as a patch if final review confirms that classification. Update
`VERSION`, its charter projection, Changelog, and source-bound offline bundle
identity together. Keep `v5.0.4` and its assets immutable. Qualify the next
bundle by clean offline installation and full checks before exact-HEAD ETHOS
proof and official source-only archive. Then independently publish and verify
both Forge assets and host matrices; neither local proof nor an old CI run
establishes the next release.

## Risks / Trade-offs

- **Historical files become accidental current guidance** → Only source
  formatting and spacing expand; spelling, links, metadata, and navigation
  retain their current reader scope.
- **A new selection silently skips candidates** → Derive it from `gitFiles()`
  and test an archived path directly.
- **The stricter rule causes mass rewrites** → Current source already passes the
  expanded checks; reject an unexpected diff instead of reformatting history.
- **A patch heading is mistaken for delivery** → Keep source proof, signed tag,
  each Forge asset, and each host's full offline graph as separate evidence.

## Migration Plan

Write failing inventory and spacing tests first, then change the existing
selectors and verifier. Run the focused test, all 74-plus repository tests,
full formatter/linter/link check, strict official OpenSpec validation, online
dependency audit, and diff check. Build one source-bound `v5.0.5` offline bundle
from the unchanged locked supply, inspect it, and run a fresh offline install
and complete verifier. Sign the exact source, obtain ETHOS full proof, and
archive through the official transition. Refresh proof for the archive HEAD
before native land and release publication. Verify the exact tag, both remote
refs, Release assets and hashes, GitHub's four-host offline run, and GitLab's
post-asset VM job before retiring the owned Work Lane. A failed peer or host
stays an explicit delivery gap.
