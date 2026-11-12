## 1. Image

- [x] 1.1 Pin GitLab's Linux image to
      `node:26-trixie@sha256:e18c3ccdf7d71619990b0e85639f506e2028a95410999cab24cc373cbd10e0ac` in
      `.config/ci/verification.toml` and generate both pipelines again; done when
      `ethos lane project --check --json` reports both projections conforming.
      `lane project --check` reports both projections conforming after the native apply, which
      changed only the two image lines of `.gitlab-ci.yml`.
- [x] 1.2 Update the Changelog bullet for the image under Changed; done when the repository check
      passes. The bullet now names Node 26.13.1, and the format, project, Markdown lint, prose and
      registry checks pass.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs
  and GitLab's Linux, macOS and Windows review jobs on that head.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected
  jobs on the landed head, and retire the proposal refs and the lane.
