# Design

## Context

The accepted v4.0.1 edition has seven English normative topics and no root
`guidelines.md`. The comparison baseline is the last accepted unified edition at
`b72b5e813ead5f5d5203ac7672eb72c8f32ecd1e:guidelines.md` (1,240 lines).
The former criterion-system Work Lane is retired. Its unaccepted patch and files
are preserved temporarily outside the repository; they are inputs for a review,
not an alternative current source. The user explicitly rejects its Apache
proposal, duplicate rule and playbook trees, tracked evidence store, fixed
management cadence, and retrospective lifecycle certification.

## Goals / Non-Goals

**Goals:** Make every surviving distinct duty reachable from one current topic;
make the selected MIT grant explicit and mechanically consistent; remove the
need to retain the unaccepted preservation package after reconciliation.

**Non-goals:** Line-count parity, restoring every example or template, claiming
actual team adoption from source checks, changing ETHOS lifecycle, or creating
another history archive.

## Decisions

### Reconcile obligations, not paragraphs

The audit below is a source-to-owner map. “Retained” means the current owner
expresses the action and boundary; “strengthen” marks a specific lost testable
meaning to restore. A rejected item is removed by an explicit user decision,
not by editorial convenience. Review the post-edit prose against its listed
counterexample before calling the map complete. The selected owner is the only
normative edit location; this Change is an audit record, not a second rule text.

| Former locus                                                                  | Current owner                                              | Disposition and testable boundary                                                                                                     |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| §0 purpose and threefold value                                                | `docs/charter.md`, `docs/deliver.md`, `docs/evolve.md`     | Retained across purpose, evidence, and learning; no separate task-card tree.                                                          |
| §0 scenario cards                                                             | `docs/README.md` and each linked topic                     | Combined into task routes; a reader reaches the action and stop condition without all topics.                                         |
| §1 applicability and risk L0–L2                                               | `docs/charter.md`                                          | Retained, including human and Agent parity and local-policy conflict.                                                                 |
| §2.1 philosophy and sunk cost                                                 | `docs/charter.md`                                          | Retained as a judgment constraint, not decorative taxonomy.                                                                           |
| §2.2 truth, weak signals, minimal governance                                  | `docs/charter.md`, `docs/evolve.md`                        | Strengthen the test that every new entity has an irreplaceable obligation; weak-signal pattern already retained.                      |
| §2.2 responsibility and capability growth                                     | `docs/charter.md`, `docs/human-agent.md`, `docs/evolve.md` | Retained; delegation does not transfer responsibility.                                                                                |
| §§2.3–2.7 hard boundaries, two authorities, six meanings, six task boundaries | `docs/charter.md`, `docs/decide.md`                        | Retained; action authority never proves facts and evidence never grants action.                                                       |
| §3.0 trust chain and six-step loop                                            | `docs/deliver.md`, `docs/decide.md`, `docs/evolve.md`      | Combined rather than copied; strengthen where records and learning prevent repetition.                                                |
| §§3.1–3.2 framing and model                                                   | `docs/decide.md`                                           | Retained; unknowns and alternatives determine analysis depth.                                                                         |
| §3.3 comparable decision                                                      | `docs/decide.md`                                           | Retained, including status quo, reversibility, owner, and revisit trigger.                                                            |
| §3.4 execution critical path                                                  | `docs/deliver.md`                                          | Retained, including dependencies, resources, checkpoints, rollback, and scope change.                                                 |
| §3.5 evidence contrasts                                                       | `docs/deliver.md`                                          | Strengthen: rehearsal is not execution; digest equality is not semantic correctness; merge, publication, and effect differ.           |
| §3.6 reusable prevention triggers                                             | `docs/evolve.md`                                           | Retained; choose the lightest maintained mechanism.                                                                                   |
| §4 failure analysis and repair                                                | `docs/decide.md`, `docs/evolve.md`                         | Strengthen hypothesis ranking, durable solution criteria, and reflection on failed judgments; retain containment, repair, prevention. |
| §5 data meaning, time, adoption, production                                   | `docs/data.md`                                             | Retained, including six questions, historical point of view, accountable owners, and human high-risk acceptance.                      |
| §6 oral communication and meetings                                            | `docs/communicate.md`                                      | Strengthen change since the last report; retain purpose, concise answer, decision and action.                                         |
| §7 writing and fidelity, clarity, elegance                                    | `docs/communicate.md`                                      | Retained without eleven compulsory headings; accuracy, clarity, restraint, and navigability govern prose.                             |
| §8 Agent delegation and truth                                                 | `docs/human-agent.md`                                      | Strengthen command evidence retention, actual-change versus reported-scope check, pollution stop, and subtask boundaries.             |
| §9 states and completion                                                      | `docs/deliver.md`                                          | Retained; add explicit lifecycle-node agreement to completion rather than equating verification with publication.                     |
| §10 review and hard risks                                                     | `docs/evolve.md`                                           | Strengthen hidden uncertainty, Agent output as authority, and repeated manual rescue as risks that cannot be offset by effort.        |
| §§11.1–11.3 autonomy and growth                                               | `docs/evolve.md`                                           | Strengthen anti-micromanagement and management-system correction before blaming members.                                              |
| §11.4 weekly/monthly/quarterly cadence                                        | None                                                       | Deliberately rejected by the user; natural work checkpoints remain.                                                                   |
| §§11.5–11.8 metrics, evolution, roles, emergencies                            | `docs/evolve.md`                                           | Strengthen member disclosure and maintainer effective time; retain metric gaming and emergency expiry.                                |
| §12 templates and §13 final check                                             | Relevant topic pages                                       | Keep useful fields in prose at their task owner; do not maintain duplicate forms.                                                     |
| Draft-only §7.4 reader navigation                                             | `docs/README.md`, `README.md`, `AGENTS.md`                 | Retain task-first entry and descriptive routes; do not duplicate the topic inventory.                                                 |
| Draft Apache license and Python QA layer                                      | `LICENSE`, existing Node verifier                          | Replace Apache with owner-approved MIT; do not restore parallel QA tooling.                                                           |

### Keep semantic owners small and direct

Edit `charter`, `decide`, `deliver`, `communicate`, `human-agent`, and `evolve`
only where the matrix identifies a gap. `data` needs no word-count padding.
The matrix is not a claim that every old sentence remains; examples and forms
are retained only when their unique decision support is otherwise absent.
An alternative—restore the draft's `rules/` and `playbooks/`—would recreate
competing navigation and a maintenance obligation without a distinct user need.

### Make licensing one grant, not three versions of it

Use the standard OSI MIT text in one root `LICENSE` with the verified
copyright identity. Link to it from README; declare `MIT` in the private npm
manifest. A repository check must keep these surfaces aligned. Do not carry
the unaccepted Apache proposal into the published tree.

v4.1.0 is a minor release: it adds reuse rights and clarifies duties already
present in the former accepted contract, without removing an existing route or
permission. If final review finds an incompatible new demand, reclassify before
tagging rather than silently publishing a minor.

## Risks / Trade-offs

- **English compression can erase a stop condition** → test each strengthened
  sentence against a concrete counterexample and keep the source-to-owner map.
- **A mechanical link or spelling check cannot prove semantic equivalence** →
  treat the map and adversarial review as editorial evidence, not machine proof.
- **A new legal grant is irreversible once published** → use the user's explicit
  MIT decision, standard text, consistent metadata, and one deliberate release.
- **Draft preservation could become a junk archive** → after exact comparison
  and accepted source closeout, remove only this task-owned package; Git's
  existing objects retain accepted history, not a fabricated approval of draft.

## Migration Plan

Create the official Change in this leased Work Lane. Amend only current topic
owners and checked license metadata. Complete the source tasks with focused
counterexamples, full local quality, official OpenSpec, and ETHOS changed-plan
admission. This is a source-only Change: no checkbox claims that a future native
effect has happened. After a signed source commit and exact-HEAD proof, archive
through the official ETHOS transition. Prove that new archive commit, integrate
through candidate and accepted roots, publish each eligible ref, then tag the
final object and verify each Forge Release and hosted job independently.

After semantic reconciliation and source acceptance, remove only the exact
task-owned preservation package. Retire the clean landed Work Lane through
ETHOS. A failed source edit can be reverted through the Work Lane; a published
MIT grant is not represented as revocable by a later revert.
