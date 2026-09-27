# Tasks

## 1. Contract and regression

- [x] 1.1 Add positive cases for `[YANKED]`, category reordering, and an
      oldest-release tag link, plus negative cases; verify the old parser fails.
- [x] 1.2 Repair the parser without weakening version, tag, or ancestry
      checks; verify the focused changelog test passes.
- [x] 1.3 Update the Change spec delta, contributor explanation, and
      `Unreleased` note; verify source and Change text agree.

## 2. Local acceptance

- [x] 2.1 Verify locally: `npm run verify` passed 71 tests; official
      `openspec validate --all --strict --json` passed 4 items; ETHOS
      `plan --changed` passed with two gates; `git diff --check` passed.
- [x] 2.2 Signed commit `8f933d7` passed exact-HEAD ETHOS proof
      `bdfd2543`; candidate and accepted `dev` contain the repair.

## 3. Publication acceptance before archive

- [x] 3.1 Classify the compatible verifier fix as patch `v5.0.1`;
      `VERSION`, charter, changelog, signed tag `1a4ddc5`, and source
      `b427731` agree.
- [x] 3.2 Retrieve both Forge assets and verify SHA-256 `2fbeef2b`;
      GitHub offline run `36293623140` passed four platforms and GitLab
      post-publication pipeline `8383` passed on Runner #52.
- [x] 3.3 Verify both remote `dev`, `main`, and `v5.0.1` refs identify
      `b427731`, both Release objects exist, and the offline bundle
      installed and passed 71 tests in a clean local checkout.
