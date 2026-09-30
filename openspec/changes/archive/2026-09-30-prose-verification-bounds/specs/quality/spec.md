# Quality Delta

## ADDED Requirements

### Requirement: Public-command integration has a bounded native execution budget

Tests of the complete public prose and repository commands SHALL retain actual
current-source execution, defect rejection, corrected-source success, and
unchanged-source assertions. Their child deadline SHALL use the same finite
120-second budget as the existing runtime command owner, not a shorter implicit
performance requirement. A subprocess error SHALL be reported before an exit
status assertion; a timeout SHALL NOT be mistaken for a rejected source defect.

#### Scenario: A supported host completes a full current-source check

- **WHEN** a real public-command test needs more than 30 seconds but completes
  within the native 120-second budget
- **THEN** it may finish its actual selected rules without being canceled early
- **AND** the expected source defect and unchanged bytes are still asserted.

#### Scenario: A public-command child exceeds the admitted budget

- **WHEN** the child reaches its finite timeout or has an execution error
- **THEN** the test fails with that actual error before comparing its exit code
- **AND** it does not skip, retry, or count the timeout as defect rejection.
