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
- Extend the existing native-tool installation and offline bundle owners to
  supply both Vale and lychee through one manifest. Remove the replaced entry,
  configurations, packages, and adapters.
- Remove retired tools from every current consumer, direct and transitive
  dependency, command, test interface, and guidance. No alternate parser,
  fallback, or optional retired checker remains after the replacement.
- Review the seven work topics with the installed English editorial skills;
  retain every actor, obligation, condition, permission, and evidence limit.
- Release the changed contributor and offline-supply contract as a major
  edition only after local, installed ETHOS, and both Forge platform acceptance.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: native English and Markdown quality have one executable owner per
  concern, one source-bound supply path, and real negative tests.

## Impact

The existing document and native-supply tools, their tests, native configuration,
npm dependencies, CI, contributor guidance, version identity, and offline bundle
change. Normative content receives only semantically reviewed English edits.
Published tags, old release assets, and archived Changes remain immutable.
OpenSpec and ETHOS retain change, admission, proof, and publication authority.
Formal shared ETHOS distribution and cross-adopter proof remain separate open
dependencies; this Change neither implements nor claims those product fixes.
