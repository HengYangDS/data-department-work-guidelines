# adapters

## Purpose

ETHOS SHALL keep the Provider Adapters family cohesive and separate from adopter-specific
semantics.

## Requirements

### Requirement: Family Boundary
The adapters family SHALL describe one bounded product concern.

#### Scenario: Family remains bounded
- **WHEN** ETHOS validates repository governance
- **THEN** adapters requirements are checked without introducing private
  adopter semantics into the product core
