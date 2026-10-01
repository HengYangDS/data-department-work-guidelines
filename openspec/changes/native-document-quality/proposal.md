# Proposal

## Why

Current English checks use a custom textlint adapter and a separate spelling
command. Native Vale already passes the distinguishing prose examples without
that adapter. Moving to it must also replace the old tool supply, retain offline
verification, and preserve the department's obligations. Installing another
linter beside the current stack would leave the duplication intact.

## What Changes

- Replace the two English pipelines with one pinned native Vale command, its
  vocabulary, and native style rules.
- Replace textlint parsing in both DR boundaries and the offline bundle's
  README license reader with the existing native Markdown parser. Reject actual
  disabling comments without rejecting code or meaningful evidence links.
- Close the remaining decision boundary gaps: reject reused stable IDs and
  empty sections, and preserve ordinary prose whose first word is an inherited
  JavaScript object property.
- Replace hand-written shell token parsing with one audited native lexer;
  recognize quoted and compound invocations without evaluating text or reading
  ambient variables, and retain bare paths and interpreter prose.
- Extend the existing native-tool installation and offline bundle owners to
  supply both Vale and lychee through one manifest. Remove the replaced entry,
  configurations, packages, and adapters.
- Correct configuration ownership: separate check policy, native tool supply,
  and release identity. Use native TOML for Prettier, Markdownlint, and lychee;
  remove package-embedded formatting policy and hard-coded link policy, move
  executable rules to their existing implementation owner, and retire every
  previous path without fallback. Preserve formats required by native consumers
  and the dependency-free offline bootstrap.
- Remove retired tools from every current consumer, direct and transitive
  dependency, command, test interface, and guidance. No alternate parser,
  fallback, or optional retired checker remains after the replacement.
- Review the seven work topics with the installed English editorial skills;
  retain every actor, obligation, condition, permission, and evidence limit.
- Restore remaining original duties at their topic owners: stable concepts,
  execution costs and milestones, operational data-governance review,
  visible priorities and open decisions, explicit communication purpose,
  meeting focus, deadline escalation, objective expression, a precise Agent
  deliverable, member judgment, and management responsibility for recurring
  rescue.
- Release the changed contributor and offline-supply contract as a major
  edition only after local, installed ETHOS, and both Forge platform acceptance.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: native English and Markdown quality have one executable owner per
  concern, one source-bound supply path, and real negative tests.
- `guidance-discovery`: preserve the original work-quality contract at its
  current task owners, including concrete duties omitted during compression.

## Impact

The existing document and native-supply tools, their tests, native configuration,
npm dependencies, CI, contributor guidance, version identity, and offline bundle
change. Normative content receives semantically reviewed English edits and
restoration of original duties, not new approval roles or processes.
Published tags, old release assets, and archived Changes remain immutable.
OpenSpec and ETHOS retain change, admission, proof, and publication authority.
Formal shared ETHOS distribution and cross-adopter proof remain separate open
dependencies; this Change neither implements nor claims those product fixes.
