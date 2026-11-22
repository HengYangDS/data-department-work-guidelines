---
subject: data-department-work-guidelines:communicate
role: policy
state: canonical
relations:
  canonical_for: oral communication writing and escalation
---

# Communication

**When to use:** When someone needs to understand a fact, make a decision, take
action, or continue the work.

You should answer the reader's actual need before recounting the entire process.
If decisive facts or authority are missing, you must state the gap and clarify
or escalate before asking anyone to act ([stop rule](charter.md#purpose)). You
must not request action beyond your authority. You should test whether an
independent reader can identify the basis, limits, and request.

Use [update structure](#structure-an-important-update) for a status or
request, [decision-document order](#structure-a-decision-document) for a
proposal, and [escalation](#escalate-risk-in-four-parts) for an unresolved risk.

## Know What the Exchange Must Accomplish

You must state the purpose of the exchange before presenting the detail.

| Purpose     | Desired result                                                                  |
| ----------- | ------------------------------------------------------------------------------- |
| Synchronize | A shared understanding of the same subject and facts.                           |
| Discuss     | A better model, counterexamples, and feasible options.                          |
| Decide      | An authorized choice among options against explicit criteria.                   |
| Escalate    | Help with an authority, resource, or risk gap before work stalls or harm grows. |
| Review      | An explanation of the mechanism and what to keep, change, or discard.           |

### Structure an Important Update

- **Conclusion or present state:** You should lead with the answer. A status
  update names what changed since the previous report, not how much activity
  occurred.
- **Basis and impact:** You must give the decisive facts needed for the
  conclusion, the impact, and current risks or blockers. If there is no
  conclusion, you should state which evidence is missing and when it can be
  obtained.
- **Decision needed:** You should give the recommendation and must give any
  decision needed, from whom and by when.
- **Next action:** You must name its owner and due time, and the condition that
  shows completion.

You should answer a question first, then explain. You must say “I don't know”
when that is true. You must revise a position immediately when new evidence
overturns it; you must not hide the point behind jargon or background.

In a follow-up, you must keep the subject, definitions, and evaluation criteria
unchanged. If a change is necessary, you should identify it and explain why
before answering.

## Make Meetings Produce Decisions, Not Transcripts

Before a meeting, you should name the question, necessary participants, and
inputs; you should not meet for work that can be resolved asynchronously. You
should not invite someone only out of courtesy if they supply no necessary fact,
hold no decision authority, and own no action.

In the meeting, you should align facts and definitions before comparing options.
When the discussion drifts, you must return to the question that needs a
decision. You should locate disagreement in facts, inference, values, resources,
or authority.

Afterward, you should keep the conclusion and basis, must keep the decisions and
actions, and should keep the open points and risks. You must record each
decision with its authorized owner, actual date, and basis; you must give each
action an owner, deadline, and completion criterion. A discussion may improve
the shared model without reaching a decision; you must name that change and the
remaining question. You must not present understanding as approval or activity
as resolution.

You should challenge propositions, evidence, and costs, not personalities or
motives. You should distinguish disagreement about a fact from disagreement
about an inference, and both from a different risk preference despite shared
reasoning.

## Write for Fidelity, Clarity, and Elegance

_Fidelity, clarity, elegance (信、达、雅)_: **fidelity is the root; clarity comes
before elegance.** From Yan Fu's translator's notes (译例言) to _Evolution and
Ethics_ (1898), they apply to all writing meant for a person to read, in Chinese
or English: documents, reports, replies, handoffs, commit messages, and the
human-readable text of interfaces and command output. The first sentence of each
item can be cited alone.

- **Fidelity (信): meaning, facts, conditions and limits, who is responsible, and
  what is uncertain all stay intact.** The words are accurate; nothing is
  exaggerated or omitted, and no guess is written as fact.
- **Clarity (达): the reader understands the text and can judge and act on it.**
  It rests on the writer understanding the subject accurately first. The meaning
  arrives whole, in fluent, natural, idiomatic language, without word-for-word
  rendering of another language, piled jargon, or stock and templated phrasing.
  Clarity is the way fidelity is achieved.
- **Elegance (雅): on top of fidelity and clarity, the writing is fitting and
  beautiful.** Aesthetic judgment, taste and refinement shape the wording, the
  structure, the rhythm and transitions of the prose, and the layout to suit the
  subject and the reader, so that the writing carries and stays with the reader.
  Yan Fu's 尔雅 meant classical, refined diction, which he held also makes clarity
  easier; here it is taken as literary grace, extended to the aesthetics of the
  whole text. Elegance is not ornament, archaism or stacked set phrases;
  restraint, concision, order and consistency are means to it, not its
  definition. It is checked by a reader other than the writer finding the text
  natural and fitting.
- **When they conflict, fidelity prevails over clarity and clarity over
  elegance.** Keep a qualification rather than drop it for smoothness, and never
  change the meaning to make a sentence read better.

In practice:

- You must keep actors, conditions, responsibilities, and limits intact; you
  should give facts their sources; you should keep the [six
  meanings](decide.md#keep-six-meanings-distinct) distinct; and you must not
  hide counterexamples, uncertainty, failure, or limits.
- You should let the title name the subject and purpose; for an analysis,
  proposal, or decision document, the title must name its subject, purpose, and
  status ([Structure a Decision Document](#structure-a-decision-document)). You
  should give the conclusion, the decision request, or the reason no conclusion
  is available on the first screen.
- You should make one main point per paragraph, define important terms at first
  use, leave reasoning and next steps actionable, and choose precise verbs and
  concrete nouns.
- You must remove formulaic filler, repetition, and empty decoration; you must
  keep the tone objective and measured, without slogans or pretended depth.
- You should let structure serve judgment; you should not let a diagram stand in
  for an argument.

These editing practices serve the three aims without exhausting them.

## Structure a Decision Document

Analysis, proposal, and decision documents should follow this order by default:

1. You must give the title's subject, purpose, and status, and then you should
   summarize the conclusion, decisive facts, and requested decision.
2. You should explain the background and problem, then must explain scope,
   non-goals, and constraints.
3. You should present facts, evidence, and unknowns, then the model and
   alternative explanations, followed by options and trade-offs.
4. You should state the recommendation or decision. You should pair each
   material risk with the chosen mitigation, then explain remaining risks,
   limits, and revisit triggers.
5. You must name the action, responsible person, deadline, and acceptance
   condition.

Appendices hold only supporting detail. You may combine or reorder these parts
when the reader's decision needs it; you should keep the conclusion, basis,
limits, and requested action easy to find.

## Review Before Sending

Before sending, you should check the title, first screen, sources,
counterexamples, terminology, [classification
basis](decide.md#use-the-smallest-sufficient-model), and causal chain; a
timeline alone does not prove cause. You should ask whether a reader outside the
work can restate the conclusion, basis, limits, and next action without filling
gaps. You should link to an existing source of truth rather than copying it.

You must revise every sentence that does not help the reader understand, judge,
or act. You must combine repetition and remove filler; you must keep examples,
qualifications, and transitions that carry meaning. You may keep a shorter
version only if it preserves the facts, reasoning, limits, responsibilities, and
expressive quality. No deletion fraction or fixed document shape is a writing
standard.

## Escalate Risk in Four Parts

1. **Risk:** You must state the risk or blocker.
2. **Impact:** You should give the facts, impact, and latest safe decision time.
3. **Containment:** You should state what has been attempted and its result.
4. **Decision:** You should give the options, costs, and recommendation, and
   must name the person who must decide, and by when.

> **Illustrative escalation:** “Do not admit the revised price history for this
> historical simulation yet. The vendor changed earlier values, but we have not
> verified when those values became knowable. Using today's file could make the
> result depend on information unavailable at the simulated decision.
>
> I have kept the file exploratory. I recommend leaving this historical result
> out of the planned release while we obtain the earlier snapshot and correction
> history and recheck availability. The release proceeds without this result;
> it avoids presenting hindsight as point-in-time evidence. The alternative is
> to reschedule this result, which delays it and requires a new deadline.
>
> The authorized decision owner for this use needs to choose between these
> options before the release window. Evidence gathering continues within the
> existing delegation; this use remains pending until the evidence supports it
> and the owner admits it.”

## Replace Vague Assurances with Checkable Statements

In updates, answers, meeting records, and escalations, you should replace vague
assurances with statements that another person can check:

| Instead of                  | Say                                                                |
| --------------------------- | ------------------------------------------------------------------ |
| “Actively progressing”      | Actual changes, current blocker, next milestone, and time.         |
| “Probably fine”             | What passed verification, remaining risk, and confidence.          |
| “As soon as possible”       | Owner, deadline, and escalation if that deadline is missed.        |
| “Everyone basically agrees” | Who agreed, who objects, and who has decision authority.           |
| “It's complicated”          | Which subjects, dependencies, conflicts, or unknowns matter.       |
| “The Agent analyzed it”     | Its facts, the member's verification, and the conclusion's limits. |

If a deadline may be missed, you must name the escalation owner and the
condition for involving them before the delay causes harm.

For a completion report, you must also follow the evidence boundary in
[execution and delivery](deliver.md). If the problem itself is still undefined,
start with [analysis and decisions](decide.md).
