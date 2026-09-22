# GLOBAL DATE API CATALOG

## Core endpoints
### Authentication
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh
- POST /api/auth/reset-password

### Users and profiles
- GET /api/users/:id
- PATCH /api/users/:id
- POST /api/profiles
- PATCH /api/profiles/:id
- POST /api/profiles/photos

### Discovery and matching
- GET /api/discovery
- POST /api/discovery/like
- POST /api/discovery/pass
- POST /api/discovery/super-like
- GET /api/matches

### Chat
- GET /api/chat/:matchId/messages
- POST /api/chat/:matchId/messages
- POST /api/chat/:matchId/report

### Subscriptions and boosts
- GET /api/subscriptions/plans
- POST /api/subscriptions/checkout
- POST /api/boosts/activate

### Verification and trust
- POST /api/verification/identity
- POST /api/verification/professional
- POST /api/verification/wealth
- GET /api/reports

### Admin
- GET /api/admin/analytics
- PATCH /api/admin/feature-flags/:key
- GET /api/admin/moderation

## Documentation standards
OpenAPI should be used to document each endpoint, request schema, responses, and permission requirements.
