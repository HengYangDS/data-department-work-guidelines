## Context

See [proposal.md](proposal.md). In ETHOS 0.2.0-beta.10 the format gate renders each file with the
shipped policy and, when the repository carries its own, with that one as well; a difference
between the two renderings is refused. A carrier that equals the shipped policy, or holds a subset
of it, therefore cannot change a result.

## Goals / Non-Goals

**Goals:**

- Keep one copy of the Prettier and Taplo settings, the one installed ETHOS ships.
- Show in this lane that every check and the full proof give the same result without the carriers.

**Non-Goals:**

- Changing any formatting setting, guideline, gate or pipeline.
- Removing the Lychee parameters or the Vale spelling increment, which add to the shipped policy.

## Decisions

- Remove both files in one Change, because one proof covers both and they have the same reason.
- Accept the removal only on evidence from this lane: the format check, the configuration gates
  and the full proof must pass at the head without the carriers. If any of them asks for a
  carrier, the lane is abandoned and the finding goes to the paradigm's owner.

## Risks / Trade-offs

- [A later ETHOS release changes a shipped setting and reformats files here] → That is the
  intended behavior of a common base; the bind lane of that release applies the format and shows
  the difference in review.
- [A tool outside ETHOS reads the removed files] → No tracked file but the configuration map names
  them, and the repository runs its formatters only through ETHOS.

## Migration Plan

Remove the two files, update the configuration map and the Changelog, run the checks, prove the
archived head and qualify it on both Forges. To roll back, restore the two files from Git history
in a new Change.
