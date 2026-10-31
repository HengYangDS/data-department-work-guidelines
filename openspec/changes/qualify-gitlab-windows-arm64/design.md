## Context

See [proposal.md](proposal.md). `docs/governance/README.md` records GitLab's Windows ARM64 limit in
its supply table and under "Qualify Each Platform". `rebind-ethos-alpha-21` withdrew the acceptance
under DR-0005, and its task 2.2 waited for an environment where ETHOS runs on those runners.

## Goals / Non-Goals

**Goals:** state the platform as qualified, on the evidence of the jobs themselves, and make the
Windows ARM64 jobs part of the hosted acceptance again.

**Non-Goals:** changing any runner declaration, job, Mise release or image, or the Windows guests,
which their owner keeps.

## Decisions

- Qualify on the jobs' own results: review job 62984 of pipeline 13543 ran the complete verifier
  on `56ab6d0e` and passed, and this Change's proposal must pass the Windows ARM64 review job again.
- Keep DR-0005 as it is; it already says that a withdrawn task returns through a new Change.

## Risks / Trade-offs

- [The Windows ARM64 jobs fail again later] → They are part of the acceptance from now on, so a
  failure stops the landing of that Change, and its evidence goes to the ETHOS owner.
