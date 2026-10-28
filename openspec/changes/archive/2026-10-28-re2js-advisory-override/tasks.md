## 1. Supply

- [x] 1.1 Override markdownlint's re2js with 2.8.8 in `package.json` and re-resolve `package-lock.json` with the locked npm; done when the lock holds one development `re2js` 2.8.8 with its registry integrity, no other lock entry changes, and the native dependency audit reports no unapproved finding. (The audit reports 54 identities and no finding.)
- [x] 1.2 Record the override under Security in the Changelog; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and wait for its `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest for that exact commit.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, and retire the proposal ref and the lane. The 0.2.0-alpha.18 rebind lane then merges the landed `dev`.
