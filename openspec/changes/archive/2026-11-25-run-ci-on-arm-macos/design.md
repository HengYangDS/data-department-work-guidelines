## Context

See proposal.md. The shipped CI template takes a list of tags for each trust level, and another governed repository already runs only on the macOS guest, so the change needs nothing from ETHOS.

## Goals / Non-Goals

**Goals:**

- One platform, ARM macOS, on both Forges, selected by one label.
- The specifications, the page and the contributing guide say what the CI does.

**Non-Goals:**

- Unregistering the Linux and Windows runners or deleting the package registry's Mise files: remote deletions that wait
  for the owner.
- Narrowing the Mise lock's platforms: it also serves contributors' local installs, and the CI declaration alone owns
  where CI runs.

## Decisions

- **One label.** GitHub's hosted ARM macOS labels are `macos-latest` (macOS 26 today), `macos-26` and `macos-15`; there
  is no hosted macOS 27, while the guest runs macOS 27. `macos-latest` on both Forges means each Forge's latest ARM
  macOS; GitLab adds `review` or `protected`, because its runners are split by trust. The owner chose this on
  2026-11-25 10:39 over self-hosted GitHub runners, which GitHub's hardening guide advises against for public
  repositories.
- **Evidence of the platform.** Each job's log names its image (`macos-26-arm64` on GitHub) or `arch=arm64 os=darwin`
  (GitLab); no extra step checks the platform.
- **Tag order.** The runners carry both the old and the new tags while the change moves from proposal to `main`, so no
  job waits for a runner; the old tags go after `main` is published.
- **Specifications.** Scenarios keep their titles and are reworded; the two requirements that only described the Linux
  job are retired with their reason and migration.
- **Edition.** A change of the publication contract, not a correction: a minor edition, 10.1.0.

## Risks / Trade-offs

- GitHub's `macos-latest` moves to a newer macOS when GitHub decides; the job log records which.
- One platform means a fault specific to Linux or Windows tooling goes unseen in CI; the guidelines are Markdown and ETHOS
  qualifies its own release on all platforms.
