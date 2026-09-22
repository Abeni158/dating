# GLOBAL DATE DATABASE DESIGN

## Primary entities
- users
- profiles
- photos and videos
- locations and geographic clusters
- preferences and filters
- likes, passes, and matches
- messages and reactions
- subscriptions and payment records
- boosts
- verifications
- reports and blocks
- notifications
- devices
- admin users
- feature flags

## Initial schema snapshot
The repository includes a Prisma schema with the core user, profile, like, pass, match, message, notification, subscription plan, and feature flag models. This is the baseline for the first implementation phase and will expand as the platform grows.

## Requirements
- enforce foreign key constraints
- add indexes for discovery and messaging queries
- use soft deletes for moderation-sensitive records
- record audit metadata around administrative changes
- store verification docs in restricted storage access paths
