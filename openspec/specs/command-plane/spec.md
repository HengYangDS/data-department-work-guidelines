# command-plane

## Purpose

ETHOS SHALL keep the Public Command Plane family cohesive and separate from adopter-specific
semantics.

## Requirements

### Requirement: Family Boundary
The command-plane family SHALL describe one bounded product concern.

#### Scenario: Family remains bounded
- **WHEN** ETHOS validates repository governance
- **THEN** command-plane requirements are checked without introducing private
  adopter semantics into the product core
