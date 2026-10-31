## 1. Image

- [ ] 1.1 Pin GitLab's Linux image to `node:26-trixie@sha256:6d2c7d5d074bf72f81ddc252b4fbb5d625bc028eeda49cb4b8c2ff8eda1ee617` in `.config/ci/verification.toml` and generate both pipelines again; done when `ethos lane project --check --json` reports no drift.
- [ ] 1.2 Record the move under Changed in the Changelog; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs and GitLab's Linux and macOS review jobs for that exact commit. GitLab's Windows ARM64 review job stays outside the acceptance, as `rebind-ethos-alpha-21` recorded under DR-0005.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected Linux and macOS jobs on the landed head, and retire the proposal refs and the lane.
