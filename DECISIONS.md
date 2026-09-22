# GLOBAL DATE DECISION LOG

## Decision 01: use Next.js with TypeScript
We choose Next.js as the application framework because it provides a modern web app shell, route handling, server rendering, and API routes in a single stack. This reduces complexity for a product that needs both rich frontend experiences and server-side business logic.

## Decision 02: use PostgreSQL + Prisma
PostgreSQL is the primary transactional database because it supports relational modeling for users, profiles, matches, messages, subscriptions, and moderation workflows. Prisma accelerates schema evolution and migration management.

## Decision 03: use Redis for realtime and cache
Redis provides a lightweight layer for caching, rate limiting, presence, and interaction state. It reduces pressure on the relational database while supporting realtime features.

## Decision 04: keep AI assistance explainable
AI features must support user control and provide explanations without making sensitive inferences. The system will explain recommendations and preserve autonomy.

## Decision 05: keep verification separate from profile claims
Verification must be explicit and auditable. Professional and wealth claims are treated as separate categories and must not be inferred from a profile alone.

## Decision 06: Privacy-first geography
The app will never expose exact residential addresses. It will rely on country, city, and approximate cluster-based geolocation design.

## Decision 07: feature flags over hard-coded toggles
The product will use feature flags for rollout control of AI, video, wealth verification, and global discovery to reduce deployment risk.
