# Proposal

## Why

The documentation tools are current, but the package manager that CI actually
uses is not: Node 26.10.0 bundles npm 11.19.1 while stable npm is 12.1.0.
Host installation and a compatible offline run do not establish CI freshness.

## What Changes

- **BREAKING:** require the declared stable npm before dependency installation
  and contributor commands, using npm's native `devEngines` admission.
- Keep one exact package-manager declaration in `package.json`, without a
  duplicate version field, new toolchain, shell wrapper, or custom parser.
- Qualify explicit online package-manager supply on ephemeral CI hosts;
  maintained native accounts use their existing installation owner.
- Keep local and offline verification free of automatic downloads. Rebuild
  source-bound release supply and verify actual supported host execution.
- Remove the ambient GitHub CLI from public bundle acquisition; use the existing
  Node runtime and exact asset identity, without another installation owner.
- Publish a SemVer major edition because the contributor prerequisite changes;
  the department's normative rules and reader routes remain unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: require the actual declared package manager before installation
  and commands, and separate online acquisition from offline qualification.

## Impact

`package.json` is the native declaration owner. Existing CI workflows,
contributor guidance, offline installation, and their tests consume that
contract. The version, charter edition, Changelog, and offline bundle record
change only for the new major release. ETHOS lifecycle and proof remain with
the installed product. No unrelated tool, private schema, credential, model,
mobile surface, or alternative installation owner is introduced.
