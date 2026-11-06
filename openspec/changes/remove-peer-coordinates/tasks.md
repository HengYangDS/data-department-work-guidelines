## 1. Peer-free shared content

- [x] 1.1 Remove the History rows and their link definitions from `CHANGELOG.md`; done when the file names no Forge URL and ETHOS's Changelog check passes. 38 rows and 76 definitions are gone; the only URLs left are Keep a Changelog and SemVer. ETHOS 0.2.0-beta.4's Changelog check reports no error, with 8.0.0 as the release target.
- [x] 1.2 Remove both `forge_repository` lines from `.ethos/release.toml`; done when `ethos status` is ready and the publication topology loads both peers without a gap. Under 0.2.0-beta.4 the topology is ready for `gitlab` and `github`, and each peer's web repository resolves from the clone's Git configuration.
- [x] 1.3 Rewrite the Changelog and release rules in `docs/governance/README.md` and `CONTRIBUTING.md`; done when the documentation and prose checks pass. The Markdown, prose and documentation checks pass.
- [x] 1.4 Record the change under Removed in the Changelog; done when the repository check passes. The ETHOS format, projection, Markdown, prose, OpenSpec, configuration and documentation checks pass.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux, macOS and Windows ARM64 review jobs for that exact commit.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe the protected jobs on the landed head, and retire the proposal refs and the lane.
