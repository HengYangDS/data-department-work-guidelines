## 1. Windows ARM64

- [ ] 1.1 State in `docs/governance/README.md`, in the supply table and under "Qualify Each Platform", that GitLab's Windows ARM64 runners run the locked release's complete verifier and qualify the platform; done when the prose, Markdown lint and link gates pass.
- [ ] 1.2 Record the change under Changed in the Changelog; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux, macOS and Windows ARM64 review jobs for that exact commit.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe all of GitLab's protected jobs on the landed head, and retire the proposal refs and the lane.
