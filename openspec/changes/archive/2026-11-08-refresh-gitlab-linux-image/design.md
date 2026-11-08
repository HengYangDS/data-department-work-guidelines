## Context

See [proposal.md](proposal.md). `.config/ci/verification.toml` names GitLab's Linux image, and
ETHOS's common model generates `.gitlab-ci.yml` from it. The Linux runners admit only listed
images, so the move depends on their owner admitting the current digest beside the pinned one,
which the owner approved on 8 November 2026. The proposal's GitLab Linux review job shows the
admission in effect.

## Goals / Non-Goals

**Goals:**

- Run GitLab's Linux jobs in the current `node:26-trixie` image, pinned by its index digest.

**Non-Goals:**

- Changing any other runner, image, gate or parameter.

## Decisions

- Pin the tag's current multi-platform index digest, read from the registry, as
  `move-gitlab-linux-image` did; the runner resolves the Linux ARM64 image from it.
- Keep `6d2c7d5d…` admitted on the runners until this Change lands; the runners' owner retires it
  afterwards.

## Risks / Trade-offs

- [The new base changes a step of the Linux job] → The proposal's GitLab Linux review job and the
  landed head's protected Linux job qualify it; reverting the digest restores the previous image.
