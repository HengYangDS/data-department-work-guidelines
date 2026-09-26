# Tasks

## 1. Lock the offline supply contract

- [x] 1.1 Add failing tests for an empty npm cache, incomplete cache, altered
      lychee archive, source mismatch, unsafe archive member, and prohibited
      network fallback; verify each failure is observed before implementation.
- [x] 1.2 Add a source-pinned bundle identity and source validation for
      `VERSION`, lockfile digest, lychee manifest digest, asset name, and
      SHA-256; verify malformed and divergent identities fail focused tests.
- [x] 1.3 Build one universal bundle from an isolated npm cache, all five pinned
      lychee archives, and their tagged license texts. Exclude logs, symlinks,
      host paths, and credentials; verify package license files, builder
      inventory, and bundle digest against its source record.

## 2. Install and verify without a remote

- [x] 2.1 Implement the explicit local bundle installer with whole-archive
      verification before extraction, safe-member checks, actual
      `npm ci --offline --ignore-scripts`, and reuse of the pinned lychee
      `--asset` installer; verify focused positive and negative tests.
- [ ] 2.2 From an empty application cache and no `node_modules/` or lychee
      cache, run the final release bundle's actual offline install and full
      `npm run verify` with outbound access disabled on macOS; verify no
      registry or Forge request is made. Do not use `npm ci --dry-run` as
      acceptance.
- [ ] 2.3 Add a post-publication GitLab package acquisition and offline job;
      run the same release bundle's complete offline install and full verifier
      on GitHub-hosted macOS, Linux x86/ARM, Windows, and the declared GitLab
      Linux ARM64 runner. Verify each job at the exact source SHA and disclose
      any unavailable host rather than counting YAML as execution.

## 3. Make the reader and release route accurate

- [x] 3.1 Update contributor and governance guidance with one short
      acquisition-versus-offline-execution route, explicit Node/npm, Git, and
      ETHOS prerequisites, integrity command, and failure boundary; verify all
      current examples against installed CLIs and repository checks.
- [x] 3.2 Prepare the compatible minor edition in `VERSION`, charter, and Keep a
      Changelog without fabricating a tag or Forge Release; verify SemVer,
      changelog, spelling, links, formatting, and full source checks.
- [ ] 3.3 Review the native ETHOS ordering for source acceptance, active Change,
      release asset publication, and archive; execute only the sequence admitted
      by current `status`, `plan`, `prove`, and release decisions, and verify no
      task is checked before its own evidence exists.
- [ ] 3.4 Prepare a corrective patch edition for source changes after the
      signed minor-version tag without moving that tag. Bind its new bundle,
      charter edition, changelog, and contributor route to the same version;
      verify release identity and full source checks before acceptance.

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
