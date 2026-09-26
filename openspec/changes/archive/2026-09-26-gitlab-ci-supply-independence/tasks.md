# Tasks

## 1. Pin GitLab-owned tool supply

- [x] 1.1 Confirm the same-project generic package file's SHA-256 equals the
      committed Linux ARM64 asset record; verify its versioned registry identity
      without storing a host, project ID, token, or binary in Git.
- [x] 1.2 Add a GitLab package request path to the existing installer, with
      standard CI inputs, header-only token, no redirect or fallback, and the
      unchanged digest and binary checks; verify focused positive and negative
      tests.

## 2. Bind CI to its own provider

- [x] 2.1 Switch the GitLab job to the package path while leaving GitHub and
      local offline supply unchanged; verify CI topology tests reject a GitHub
      download from the GitLab job and the documented commands match behavior.

## 3. Prepare the patch edition

- [x] 3.1 Set matching v4.1.1 edition and Keep a Changelog patch entry; verify
      strict SemVer, tag-base, and release-identity tests pass without altering
      the signed v4.1.0 tag.

## 4. Verify source before native closeout

- [x] 4.1 Run locked installation, full repository verification, strict
      official OpenSpec, online dependency audit, and `git diff --cached --check`;
      verify no generated package or credential is staged.
- [x] 4.2 Review exact staged paths, absence of cross-Forge fallback, and
      `ethos plan --changed --json` attribution to this Change. Subsequent
      commit, proof, archive, acceptance, publication, tag, and release effects
      are observed through their native receipts, not pre-checked task boxes.
