## Context

See [proposal.md](proposal.md). `.config/ci/verification.toml` names GitLab's Linux image, and
ETHOS's common model generates `.gitlab-ci.yml` from it. The Linux runners admit only listed
images; in `rebind-ethos-alpha-22`'s proposal pipeline 13500 they refused the current digest as a
disallowed image, and their owner has since admitted it beside the reviewed one.

## Goals / Non-Goals

**Goals:**

- Run GitLab's Linux jobs in the current `node:26-trixie` image, pinned by its index digest.

**Non-Goals:**

- Changing any other runner, image, gate or parameter.

## Decisions

- Pin the tag's current multi-platform index digest, read from the registry, as before; the runner
  resolves the Linux ARM64 image from it.
- Keep the reviewed digest admitted on the runners until this Change lands; the runners' owner
  retires it afterwards.

## Risks / Trade-offs

- [The new image changes a step of the Linux job] → The proposal's GitLab Linux review job and the
  landed head's protected Linux job qualify it; reverting the digest restores the reviewed image.
