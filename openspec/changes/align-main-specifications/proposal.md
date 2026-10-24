## Why

`native-document-quality` closed on its delivered scope under DR-0005. Its
merged deltas moved shared checks to installed ETHOS, but requirements that
stayed in the main specifications still name retired checks, files, jobs and
commands. Two department scenarios also disagree with the current guidance,
and two Purpose sections name responsibilities whose requirements have left.
Members and Agents read the main specifications as the current contract, so
these false statements mislead current work.

## What Changes

- Align the work-practice meeting-decision scenario with the guidance changed
  on 2026-10-21: a decision record names its authorized owner, actual date and
  basis, and each action has an owner, deadline and completion criterion.
- Restore the work-practice local-metric scenario to its meaning before the
  specification-only rewrite of 2026-10-06: the use, quality and cost
  boundaries describe the condition and are not a separate duty.
- Correct quality scenarios that name retired checks: the repository Vale
  rule-test suite, the repository Markdownlint policy, the temporary link input
  list and the installer's extraction stage.
- Correct verification statements about the default profile gates,
  product-owned code evidence and proof prerequisites. Replace the two
  requirements that describe the retired repository verifier with one
  requirement that keeps their still-true scenarios.
- Correct tool-supply and publication statements that name the retired CI
  validator, old job names, archive installers, Lychee supply, the repository
  test command and the charter version match; each corrected statement claims
  only what the installed common model, the projection check or the remaining
  repository tools enforce today.
- Say "an active Change" where repository governance assumed one.
- Rewrite the Purpose sections of quality and repository governance so that
  they cover only their remaining requirements.

No duty is added and no remaining obligation is weakened. There are no
breaking changes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `work-practice`: two scenarios follow the current communication and
  evolution guidance.
- `quality`: scenarios and Purpose describe the checks that actually run.
- `verification`: profile, evidence and prerequisite statements describe the
  current proof; the retired verifier requirements leave.
- `tool-supply`: CI, supply and test statements describe the current
  projection, installers and runners.
- `publication`: runner, release and history statements describe the current
  enforcement and inputs.
- `repository-governance`: one scenario no longer assumes an active Change, and
  Purpose covers only the remaining requirements.

## Impact

Only OpenSpec main specifications change, through the deltas and two direct
Purpose edits that the official archive does not apply. Guidance topics,
tools, tests, CI and ETHOS configuration are unchanged.

Out of scope: the 18 tasks that DR-0005 withdrew and the requirements that wait
on them, such as the task-route reviews of tasks 3.5 and 2.40 and the
publication and hosted qualification, and any change to department duties
beyond aligning the two scenarios with the current guidance.
