## Context

See [proposal.md](proposal.md). The pages are the guidelines; the two capability specifications state what the pages
must say, and each scenario is checked against the pages. The single definition of fidelity, clarity and elegance is
owned outside this repository, by the owner's shared rules; the communication topic quotes it and every other page
links to that topic.

## Goals / Non-Goals

**Goals:**

- Every duty has one statement, one force and one place; other places link to it.
- No sentence changes a duty beyond what the owner's answers of 2026-11-22 or the text itself supports.

**Non-Goals:**

- Rewriting the pages for style beyond the definition. Wording changes only where a duty, a reference or the
  definition requires it.
- The films that quote the pages. Their owner follows the tagged edition.

## Decisions

- **One definition, quoted.** The communication topic quotes the English text of the definition word for word; the
  charter, the README and the writing requirement link to that section. Paraphrase is refused because each paraphrase
  became a reading of its own.
- **One stop rule.** The charter's Purpose states it with the union of the member-facing conditions: subject or
  target, authority or decision owner, critical facts, and consequences, irreversible or not (the owner's answer to
  Q4). Pause and stop mean the same act, which stops only the affected action. The conditions that name the Agent stay
  on the collaboration page, under its narrower subject.
- **Force follows the requirement.** Each bare imperative takes the modal word of the accepted requirement that states
  the same act: SHALL gives must, SHALL NOT must not, SHOULD should, MAY may, and a scenario's THEN without a modal word
  reads as SHALL (the owner's answer to Q8). Content no requirement states takes should, should not or may, and must or must not where it restates one of the four
  boundaries; pointers and illustrative cases stay unmarked (the owner's answers of 13:00). The charter now defines
  should not, and must and must not allow no departure.
- **Two admissions.** Asset admission is the eight conditions of a durable asset; use admission is the decision that a
  specified use may proceed. The authorized decision is required for high-risk use admission only, as the normative
  text says; the worked case keeps its own wording as an example.
- **Risk words become levels.** The four qualifiers mean L1 or L2 work (the owner's answer to Q7); low-risk and high-risk already mean L0 and L2, and the charter's table names L0 low risk.
- **Definitions where a term had none.** Critical management chains (Q9) are defined at their first use; the agreed
  lifecycle state links to the delivery states.

## Risks / Trade-offs

- [L1 work gains duties the four words did not clearly give it] → the release is v9.0.0, and the Changelog names the
  duties that moved.
- [Many sentences gain a modal word, which can make the prose heavy] → each modal word comes with the subject the sentence implies: you, or the Agent where the paragraph is about the
  Agent; nothing else in the sentence changes.
- [A requirement covers a sentence only loosely] → the part the requirement states takes its strength, and the rest takes the force the owner set for content no
  requirement states.

## Migration Plan

Edit the pages and specifications in one lane; prove, propose and land it; then cut v9.0.0 in a Change of its own.
Readers of v8 meet the same duties except where the Changelog says otherwise. To roll back, revert the landed commits.
