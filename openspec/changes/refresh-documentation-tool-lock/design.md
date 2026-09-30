# Design

## Context

The private npm manifest has seven exact development-tool pins. The npm
registry's stable `latest` tags currently match them; Node's release index,
the lychee release, GitHub Action tags, and the resolved CI image also match
their tracked declarations. An isolated `npm update --package-lock-only`
probe changes compatible transitive packages. The current offline bundle is
bound to the old lock hash and cannot be reused for new source.

## Decision

Use npm as the sole package-graph resolver. Update the lock within the
manifest's exact direct pins and upstream transitive constraints. Inspect the
entire lock diff, install with `npm ci --ignore-scripts`, audit the resulting
graph, and run the repository verifier. Do not force unrelated major versions
through overrides merely to make `npm outdated --all` empty; that command also
reports versions outside an upstream package's admitted range.

Prepare patch edition `v5.2.2` because the public rules and contributor
commands stay compatible. Rebuild one source-bound offline bundle from the
new lock and the unchanged digest-pinned lychee assets. Record the actual
bundle hash, inspect it, and prove a cold offline install before exact-HEAD
ETHOS proof. The release cut, tag, Forge objects, and each host matrix remain
separate observed effects. A checked task is not evidence of publication.

Alternatives rejected: leave an older transitive graph while calling the
supply current; add overrides that bypass upstream compatibility; mutate the
signed `v5.2.1` tag or reuse its asset for changed source; add a private
lifecycle or a second dependency scanner.

## Risks and Recovery

A resolver refresh can alter hoisting without changing direct pins; inspect
both versions and paths and run `npm ci` from the new lock. Offline supply may
miss a new package, so the cold install must consume the frozen bundle without
remote fallback. If a late upstream release appears after the candidate is
frozen, evaluate it as a separate change rather than silently changing the
signed release input. The previous signed release remains available for
recovery and is never rewritten.
