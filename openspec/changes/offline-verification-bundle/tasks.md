# Tasks

## 1. Lock the offline supply contract

- [ ] 1.1 Add failing tests for an empty npm cache, incomplete cache, altered
      lychee archive, source mismatch, unsafe archive member, and prohibited
      network fallback; verify each failure is observed before implementation.
- [ ] 1.2 Add a source-pinned bundle identity and source validation for
      `VERSION`, lockfile digest, lychee manifest digest, asset name, and
      SHA-256; verify malformed and divergent identities fail focused tests.
- [ ] 1.3 Build one universal bundle from an isolated npm cache and all five
      pinned lychee archives, excluding logs, symlinks, host paths, and
      credentials; verify the builder's inventory and bundle digest against its
      source record.

## 2. Install and verify without a remote

- [ ] 2.1 Implement the explicit local bundle installer with whole-archive
      verification before extraction, safe-member checks, actual
      `npm ci --offline --ignore-scripts`, and reuse of the pinned lychee
      `--asset` installer; verify focused positive and negative tests.
- [ ] 2.2 From an empty application cache and no `node_modules/` or lychee
      cache, run the actual offline install and full `npm run verify` with
      outbound access disabled on macOS; verify no registry or Forge request is
      made. Do not use `npm ci --dry-run` as acceptance.
- [ ] 2.3 Run the same release bundle's complete offline install and full
      verifier on GitHub-hosted Linux and Windows, and on the declared GitLab
      Linux ARM64 runner; verify each job at the exact source SHA and disclose
      any unavailable host rather than counting YAML as execution.

## 3. Make the reader and release route accurate

- [ ] 3.1 Update contributor and governance guidance with one short
      acquisition-versus-offline-execution route, explicit Node/npm, Git, and
      ETHOS prerequisites, integrity command, and failure boundary; verify all
      current examples against installed CLIs and repository checks.
- [ ] 3.2 Prepare the compatible minor edition in `VERSION`, charter, and Keep a
      Changelog without fabricating a tag or Forge Release; verify SemVer,
      changelog, spelling, links, formatting, and full source checks.
- [ ] 3.3 Review the native ETHOS ordering for source acceptance, active Change,
      release asset publication, and archive; execute only the sequence admitted
      by current `status`, `plan`, `prove`, and release decisions, and verify no
      task is checked before its own evidence exists.

## 4. Publish and close the exact release

- [ ] 4.1 Commit signed source, obtain exact-HEAD full proof, and close it
      through the governed candidate and accepted roots; verify commit
      signature, clean worktree directories, and local `dev`/`main` identity.
- [ ] 4.2 Create the admitted signed version tag and publish the same source and
      bundle to GitLab and GitHub; verify both remote refs, both hosted CI
      results, both Forge Release objects, and read-back SHA-256 of both bundle
      assets.
- [ ] 4.3 Complete the official Change and archive through ETHOS only after
      declared tasks are evidenced; refresh proof and publication observations
      for the archive commit, retire the merged Work Lane, and verify no
      disposable worktree or release staging copy remains.
