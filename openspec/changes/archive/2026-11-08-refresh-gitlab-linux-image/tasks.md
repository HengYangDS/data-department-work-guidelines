## 1. Image

- [x] 1.1 Pin GitLab's Linux image to `node:26-trixie@sha256:438603bbb5cda404b9416f0b5c8026f61501ab911760d861ec28c36b5d675725` in `.config/ci/verification.toml` and generate both pipelines again; done when `ethos lane project --check --json` reports no drift. The regenerated `.gitlab-ci.yml` names the digest in both Linux jobs, and the check reports the projections conforming.
- [x] 1.2 Record the move under Changed in the Changelog; done when the repository check passes. The Changelog's Unreleased section records the move under Changed; the format check and the `markdown-lint`, `prose`, `openspec`, `config-quality` and `docs-registry` gates pass.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux, macOS and Windows ARM64 review jobs.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected jobs on the landed head, and retire the proposal refs and the lane.
