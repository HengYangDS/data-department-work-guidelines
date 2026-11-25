## Why

The owner decided on 2026-11-25 that this repository's CI runs only on ARM macOS, symmetric across the remotes, and that
GitHub and GitLab use the same runner label. Today the GitHub workflow runs on four hosted platforms (two of them x64)
and GitLab on its Linux, macOS and Windows guests.

## What Changes

- Run the GitHub job only on the hosted `macos-latest` runner, which GitHub documents as ARM64.
- Run the GitLab jobs only on the project-locked ARM macOS guest: the review job tagged `macos-latest` and `review`, the
  protected job `macos-latest` and `protected`.
- Retire the Linux and Windows jobs, the Linux container image, and the Mise download from the package registry that
  only the Linux job used, with the installer digest it checked.
- State the same in the publication and verification specifications, the checks-and-CI page and the contributing guide.
- Cut 10.1.0.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `publication`: "Hosted documentation verification begins from a Git checkout" and "Per-Forge runner isolation protects
  source verification" name ARM macOS and the shared label; "GitLab Runner image admission matches the source pin" and
  "GitLab bootstraps Mise from its own package registry" are retired.
- `verification`: the scenario "Windows verification events share a finite executor" says that no Windows job exists.

## Impact

`.config/ci/verification.toml`, `.config/ci/runners.toml`, the generated `.github/workflows/ci.yml` and `.gitlab-ci.yml`,
`.config/mise/install.sha256` (removed), `docs/governance/checks-and-ci.md`, `CONTRIBUTING.md`, the two specifications
(through the deltas), `VERSION` and `CHANGELOG.md`. Outside the repository: the repository's two GitLab macOS runners gain the tags
`macos-latest` and `review` or `protected` before the proposal is pushed, and lose their old tags after `main` is
published; the Linux and Windows runner registrations stay until the owner decides on them.
