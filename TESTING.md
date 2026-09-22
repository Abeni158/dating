# GLOBAL DATE TESTING STRATEGY

## Test layers
### Unit tests
- matching logic
- preference filtering
- subscription limit checks
- boost logic
- verification state transitions
- permission checks

### Integration tests
- signup and login
- discovery and match engine
- chat flows
- payment and plan activation
- verification workflows

### End-to-end tests
- profile creation and photo upload
- discovery and like-match flow
- subscription purchase flow
- international discovery filters
- report and block flow

## Tools
- Vitest for unit tests
- Playwright for E2E tests
- Prisma test database or ephemeral DB for integration tests

## Definition of done for features
A feature is only ready once it has unit or integration coverage, passes lint and types, and has a review for security and accessibility.
