# distribution

## Purpose

ETHOS SHALL keep the Distribution Adapters family cohesive and separate from adopter-specific
semantics.

## Requirements

### Requirement: Family Boundary

The distribution family SHALL describe one bounded product concern.

#### Scenario: Family remains bounded

- **WHEN** ETHOS validates repository governance
- **THEN** distribution requirements are checked without introducing private
  adopter semantics into the product core
