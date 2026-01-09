# Complex Task Orchestration

A sophisticated multi-phase workflow for complex development tasks that emphasizes deep domain understanding, architectural thinking, and comprehensive problem-space exploration before solution implementation.

## Philosophy

This orchestrator treats software development as problem-solving in a specific domain. Before writing code, we must deeply understand:
- **The problem space**: What are we really trying to solve?
- **The domain**: What are the core concepts, rules, and behaviors?
- **The boundaries**: What's in scope, what's out, and why?
- **The constraints**: Technical, business, and organizational limitations
- **The evolution**: How will this system grow and change over time?

## Phase Overview

### Phase 1: Research & Domain Analysis (Opus 4.5)

**Purpose**: Understand the problem deeply before proposing solutions

**Activities**:
- Map the problem domain and identify core concepts
- Discover and document business rules and invariants
- Identify stakeholders and their needs
- Understand existing systems and integration points
- Verify assumptions through independent investigation
- Explore multiple architectural approaches with trade-offs
- Document constraints (technical, business, regulatory)
- Identify risks and unknowns

**Output**: `./research/` directory containing:
- `domain-model.md` - Core concepts, entities, and relationships
- `business-rules.md` - Invariants, validations, and policies
- `approach-comparison.md` - Multiple viable solutions with analysis
- `constraints-and-risks.md` - Limitations and potential issues
- `integration-points.md` - External systems and boundaries

### Phase 2: Strategic Planning (Opus 4.5)

**Purpose**: Create a comprehensive implementation roadmap

**Activities**:
- Design the solution architecture based on research
- Define clear boundaries and responsibilities
- Break work into cohesive, independent units
- Identify dependencies and ordering constraints
- Plan for testing at multiple levels
- Consider deployment and operational concerns
- Define success criteria for each component

**Output**: `./plan.md` containing:
- Architecture overview and key decisions
- Phased implementation with clear checkpoints
- Component responsibilities and interactions
- Data model and state management strategy
- Testing strategy (unit, integration, e2e)
- Deployment and operational considerations
- Acceptance criteria and validation approach

### Phase 3: Implementation (Sonnet 4.5)

**Purpose**: Execute the plan with high-quality, maintainable code

**Activities**:
- Implement following the strategic plan
- Respect domain boundaries and encapsulation
- Write expressive code that reveals intent
- Implement business rules explicitly
- Handle failure scenarios gracefully
- Create comprehensive tests
- Document complex domain logic
- Mark tasks complete incrementally

**Output**:
- Working, tested implementation
- Tests covering happy paths and edge cases
- Clear commit history tracking progress

### Phase 4: Architectural Review & Correction (Opus 4.5)

**Purpose**: Validate implementation against domain requirements

**Activities**:
- Verify domain rules are enforced correctly
- Check boundary integrity and encapsulation
- Review failure handling and edge cases
- Validate testability and maintainability
- Identify technical debt or shortcuts taken
- Ensure implementation matches strategic plan
- Check for unintended coupling

**Output**:
- `./corrective-plan.md` (if issues found)
- Specific fixes for architectural or domain violations

---

## Crafting Effective Task Descriptions

### The Problem Statement Framework

A well-crafted task description should answer:

#### 1. Domain Context
**What domain are we working in?**
- What is the business area or problem space?
- Who are the users/stakeholders?
- What are the core domain concepts?

Example:
```
Domain: Healthcare appointment scheduling
Stakeholders: Patients, doctors, clinic administrators
Core concepts: Appointments, availability, waitlists, cancellations
```

#### 2. The Core Problem
**What problem are we solving and why?**
- What pain point or opportunity drives this?
- What's broken or missing currently?
- What business value does this deliver?

Example:
```
Problem: Patients frequently miss appointments, causing revenue loss and
wasted provider time. No-show rate is 20%. Need a confirmation and reminder
system that reduces no-shows while respecting patient preferences.

Business value: Reduce no-shows from 20% to <5%, recovering ~$500K annually
```

#### 3. User Journeys & Use Cases
**Who does what, when, and why?**
- Describe the key scenarios step-by-step
- Include both happy paths and alternative flows
- Consider edge cases and failure scenarios

Example:
```
Primary scenario:
1. System sends confirmation SMS 24hrs before appointment
2. Patient confirms by replying "YES" or clicking link
3. If no response within 4hrs, system calls patient
4. If still no response, appointment flagged for review

Alternative flows:
- Patient wants to reschedule → system offers next 3 available slots
- Patient cancels → slot released to waitlist immediately
- SMS fails → system tries email, then phone call

Edge cases:
- Appointment <24hrs away when scheduled
- Patient phone number invalid
- Multiple appointments same day
```

#### 4. Business Rules & Invariants
**What must always be true?**
- Domain constraints that cannot be violated
- Business policies and regulations
- Data validation requirements

Example:
```
Invariants:
- Cannot schedule overlapping appointments for same provider
- Cancellation must happen ≥2hrs before appointment (policy)
- Patient under 18 requires guardian consent (regulatory)
- Waitlist processed in FIFO order within priority tier

Validation rules:
- Phone number must be valid and reachable
- Appointment duration must be 15/30/45/60 min slots
- Cannot book more than 90 days in advance
```

#### 5. Data & Entities
**What are the key domain objects and their relationships?**
- Core entities and their attributes
- Relationships and cardinality
- Lifecycle and state transitions

Example:
```
Entities:
- Appointment (id, patient, provider, datetime, duration, status)
  States: Scheduled → Confirmed → Completed
                   → Cancelled
                   → NoShow

- Reminder (id, appointment, method, sentAt, respondedAt, status)
  States: Pending → Sent → Confirmed
                  → Failed
                  → Ignored

Relationships:
- Appointment belongs to one Patient
- Appointment belongs to one Provider
- Appointment has many Reminders (SMS, email, call)
- Patient has many Appointments
```

#### 6. Integration Boundaries
**What external systems or services are involved?**
- APIs and third-party services
- Data sources and sinks
- Events and messaging

Example:
```
External dependencies:
- Twilio API - SMS sending (may fail, rate-limited)
- SendGrid API - Email delivery
- EHR system - Patient demographics (read-only)
- Calendar service - Provider availability (eventual consistency)

Integration patterns:
- Outbound events: AppointmentConfirmed, AppointmentCancelled
- Inbound events: ProviderAvailabilityChanged
- API calls: Synchronous for SMS/email, async for EHR updates
```

#### 7. Failure Scenarios & Edge Cases
**What can go wrong and how should we handle it?**
- Technical failures (network, services down)
- Business exceptions (overbooking, conflicts)
- Data quality issues (invalid inputs)

Example:
```
Failure scenarios:
- SMS service down → fallback to email within 5min
- Patient responds after appointment time → log and ignore
- Provider emergency causes mass cancellations → batch notification
- Phone number changed → try alternate contact methods

Edge cases:
- Timezone differences (patient traveling)
- Appointment reschedules multiple times
- Patient has same name as another patient
- Provider has back-to-back appointments with no break
```

#### 8. Non-Functional Requirements
**How should the system behave beyond basic functionality?**
- Performance expectations
- Scalability needs
- Security and privacy requirements
- Operational considerations

Example:
```
Performance:
- Reminder batch processing: <5min for 1000 appointments
- SMS delivery: within 30sec of trigger
- API response time: <200ms p95

Scalability:
- Support 50 clinic locations, ~5000 appointments/day
- Peak load: 500 reminders/min during batch send

Security:
- Patient data encrypted at rest and in transit
- HIPAA compliance required
- Audit log of all reminder communications
- PII handling follows data retention policy (7 years)

Operations:
- Monitor SMS delivery rates and failures
- Alert if no-show rate increases >10%
- Dashboard for admin to review flagged appointments
```

#### 9. Evolution & Maintenance
**How will this system change over time?**
- Expected future enhancements
- Extensibility points
- Technical debt to avoid

Example:
```
Future considerations:
- Support for video visit reminders
- Multi-language support (Spanish initially)
- Integration with patient mobile app
- AI-driven optimal reminder timing

Extensibility needs:
- Pluggable reminder channels (SMS, email, push, voice)
- Configurable reminder templates per clinic
- Custom business rules per provider/specialty

Avoid:
- Hardcoding provider schedules (use calendar service)
- Coupling reminder logic to specific SMS provider
- Monolithic confirmation/reminder/cancellation handling
```

---

## Example Task Descriptions

### Example 1: E-Commerce Order Processing (Rich)

```
Domain: E-commerce order fulfillment

Problem:
Current order processing is manual and error-prone. Orders sit in "pending"
state for hours while staff verify inventory, calculate shipping, and update
external systems. 15% of orders fail due to inventory sync issues. Need
automated order processing that handles the entire workflow reliably.

Business value: Reduce order processing time from 2hrs to <5min, decrease
failures from 15% to <2%, enable 24/7 order processing

Core use case - Happy path:
1. Customer completes checkout → Order created in "Pending" state
2. System reserves inventory across warehouses (closest first)
3. System calculates shipping options based on destination/inventory location
4. Payment processor charges customer
5. Order confirmed → inventory committed, fulfillment ticket created
6. External systems notified (accounting, CRM, shipping provider)

Business rules:
- Inventory reservation expires after 10 minutes if payment fails
- Cannot split order across >2 warehouses (shipping cost optimization)
- High-value orders (>$500) require fraud check before processing
- Backordered items don't block rest of order (partial fulfillment)
- Prime orders must ship from warehouse within 50mi of destination

Entities:
- Order (id, customer, items[], status, totals, timestamps)
  States: Pending → PaymentAuthorized → InventoryReserved → Confirmed → Fulfilled
          ↓
          Failed (payment, inventory, fraud)

- OrderItem (product, quantity, price, warehouse, status)
- InventoryReservation (items[], expiresAt, committedAt)
- PaymentTransaction (amount, status, gatewayRef, attempts)

Integration points:
- Inventory service: Check/reserve/commit stock (may be stale, use version checks)
- Payment gateway: Authorize/capture funds (may timeout, idempotent retries needed)
- Fraud detection API: Risk score (slow, run in parallel with inventory check)
- Warehouse system: Create fulfillment tickets (eventual consistency OK)
- Shipping provider: Rate calculation (cache rates for 1hr)

Failure scenarios:
- Inventory insufficient → offer backorder or cancel
- Payment declined → release inventory, email customer
- Fraud score too high → hold for manual review, don't release inventory
- Warehouse system down → queue tickets, retry with backoff
- Partial inventory → allow split-shipment or cancel items

Non-functional requirements:
- Process 100 orders/min during peak
- Payment processing: <3sec end-to-end
- Inventory reservation timeout: 10min hard limit
- Idempotent: Duplicate requests don't create duplicate orders
- Auditable: Complete history of state transitions
- Resilient: Failures in external systems don't lose orders

Avoid:
- Synchronous calls to all external systems (parallel where possible)
- Tight coupling to specific payment gateway
- Hardcoded shipping rules (externalize business logic)
- Locking entire order for each status change
```

### Example 2: Multi-Tenant SaaS Permission System (Rich)

```
Domain: SaaS access control and authorization

Problem:
Current permission system is binary (admin/user). Customers need fine-grained
control: team-based access, resource-level permissions, custom roles per org.
Support tickets for "can't access X" consume 30% of support time.

Business value: Reduce permission-related support tickets by 80%, enable
enterprise sales requiring role-based access control (RBAC), improve security
posture

Core concepts:
- Organization: Top-level tenant boundary
- User: Person with credentials, belongs to one or more orgs
- Team: Group of users within an org
- Role: Named set of permissions (built-in + custom)
- Resource: Any entity that can be protected (projects, documents, APIs)
- Permission: Specific action on resource type (read, write, delete, share)

Key use cases:

1. Organization admin defines custom role:
   - Admin creates role "Project Viewer"
   - Grants permissions: read:project, read:document, comment:document
   - Assigns role to "External Consultants" team
   - All team members immediately have new permissions

2. User attempts resource access:
   - User requests GET /api/projects/123
   - System checks: user's roles in project's org
   - Evaluates permissions: needs "read:project"
   - Checks resource ownership: is project in accessible team?
   - Returns 200 with data OR 403 forbidden

3. Team-based resource isolation:
   - Teams can be hierarchical (Engineering > Frontend > React Team)
   - Resources inherit team restrictions from parent
   - Users in child teams can access parent team resources (configurable)
   - Cross-team sharing requires explicit grant

Business rules:
- User must have at least one role in org (default: "Member")
- Cannot remove last admin from organization
- Role changes take effect immediately (no caching stale permissions)
- Deleted user's resources transfer to org owner
- Custom roles limited to 25 per organization (prevent abuse)
- Permissions follow principle of least privilege (deny by default)
- Cannot grant permission you don't have yourself
- Audit log required for all permission changes (compliance)

Entities:
- Organization (id, name, subscriptionTier, settings)
- User (id, email, globalId)
- OrganizationMembership (userId, orgId, roles[], teams[], joinedAt)
- Role (id, orgId, name, permissions[], builtin)
  Built-in: Owner, Admin, Member, Viewer
- Team (id, orgId, name, parentTeamId, memberIds[])
- Resource (id, orgId, ownerId, ownerTeamId, type, permissions)
- PermissionGrant (userId/teamId, resourceId, permissions[], grantedBy, expiresAt)

Integration points:
- Auth provider: User authentication (SSO for enterprise tier)
- API gateway: Permission checks on every request (must be <10ms)
- Audit service: Log all permission changes (async, cannot fail request)
- Billing system: Enforce tier limits (e.g., custom roles enterprise-only)
- Webhooks: Notify external systems of permission changes

Failure scenarios:
- Permission check during auth provider outage → fail open? fail closed?
  Decision: Fail closed (deny access), cache recent checks for 5min
- Circular team hierarchy created → prevent at write time with validation
- Role assigned with permissions user shouldn't have → validate transitively
- Mass permission change affects 10k users → process async with progress tracking
- User deleted mid-request → treat as "no permissions" for in-flight requests

Non-functional requirements:
- Permission check latency: <10ms p99 (on critical path)
- Support 10k users per org, 1000 teams, 100k resources
- Audit log retention: 7 years for compliance
- Real-time permission changes (no eventual consistency delay)
- API: 1000 requests/sec per org
- Multi-region deployment (permissions synced globally <100ms)

Security:
- Permissions never transmitted to client (server-side only)
- JWT tokens include role hashes, validated on every request
- Admin actions require re-authentication
- Sensitive permission changes require MFA
- Rate limit permission checks to prevent enumeration attacks

Extensibility:
- Custom permission types per organization
- Attribute-based access control (ABAC) for enterprise tier
- Temporary permission grants (expires_at)
- Delegation (user A acts on behalf of user B)
- External identity providers (SAML, OAuth)

Avoid:
- Denormalizing permissions everywhere (single source of truth)
- Caching permissions too aggressively (stale security risk)
- Hardcoding role names/permissions in application code
- Mixing authentication (who you are) with authorization (what you can do)
- N+1 permission checks (batch load permissions)
```

### Example 3: Real-Time Game Leaderboard (Rich)

```
Domain: Competitive gaming and player progression

Problem:
Current leaderboard updates every 5 minutes via batch job. Players complain
about delayed rankings, especially during live tournaments. Need real-time
updates that handle 100k concurrent players across multiple game modes and
regions without falling behind.

Business value: Increase player engagement (real-time creates urgency), enable
live-streamed tournaments with accurate standings, reduce infrastructure costs
via efficient updates

Core gameplay concepts:
- Match: Single game instance with 2-10 players
- Score: Points earned in match (based on kills, objectives, time)
- Rating: Persistent skill measure (ELO-style, updated per match)
- Rank: Position in leaderboard (per game mode, per season, per region)
- Season: Time-bounded competitive period (3 months)
- Division: Skill tier (Bronze, Silver, Gold, Platinum, Diamond, Master)

Key use cases:

1. Match completion updates rankings:
   - Match ends → server sends results (10 players, scores, match metadata)
   - System calculates rating changes based on performance + opponent ratings
   - Updates player ratings atomically
   - Recalculates affected rank positions (typically top 1000 only)
   - Broadcasts rank changes to connected clients via WebSocket
   - Updates division if player crosses threshold
   - Timeline: <500ms from match end to leaderboard update

2. Player views leaderboard:
   - Requests current rankings (global, friends, or region)
   - Optionally filters by game mode, season, division
   - Shows rank, player name, rating, wins/losses, recent trend
   - Updates live as other players' matches complete
   - Highlights player's own position and nearby rivals

3. Live tournament leaderboard:
   - Tournament-specific leaderboard during event (2-8 hours)
   - Only counts matches played in tournament time window
   - Real-time updates to public stream overlay
   - Final standings determine prizes

Business rules:
- Rating changes based on expected vs actual performance (ELO algorithm)
- New players start with provisional rating (10 calibration matches)
- Inactivity >30 days triggers rating decay (-10 points/day)
- Top 500 rankings recalculated immediately, rest batched every 30sec
- Cannot lose division from losing single match (demotion protection)
- Cheaters permanently removed from leaderboards, matches voided retroactively
- Tied ratings broken by: most wins, then highest peak rating, then timestamp

Entities:
- Player (id, displayName, region, currentRating, peakRating, division)
- Match (id, gameMode, region, startedAt, completedAt, players[], results[])
- MatchResult (playerId, score, ratingBefore, ratingAfter, rank)
- LeaderboardEntry (gameMode, season, rank, playerId, rating, wins, losses)
- Season (id, startDate, endDate, isActive)
- Division (name, minRating, maxRating, color)

Data patterns:
- Leaderboard is derived state (computed from ratings)
- Ratings are append-only (audit trail of all changes)
- Ranks are eventually consistent (optimize for top 1000, batch the rest)
- Historical snapshots taken daily for "peak rank achieved" features

Integration points:
- Game servers: Send match results via message queue (Kafka/RabbitMQ)
  - May send duplicates (idempotent processing required)
  - Late arrivals possible (timestamp-based ordering)
- WebSocket gateway: Broadcast rank updates to connected clients
  - Subscribe to specific ranges (top 100, friends, nearby ranks)
- Anti-cheat system: Flags suspicious matches (process async, void retroactively)
- Analytics: Stream rating changes for data science (modeling player skill)
- Leaderboard API: Public HTTP API for third-party apps (rate-limited)

Failure scenarios:
- Match results arrive out of order → use match completion timestamp for ordering
- Duplicate match result received → idempotent check on match ID
- Rating calculation fails → log error, don't lose match, retry async
- WebSocket broadcast fails → clients poll fallback every 5sec
- Database write latency spike → queue updates, process FIFO, backpressure on game servers
- Player rating corrupted → recalculate from match history (expensive)

Ranking algorithm complexity:
- Naive: Full sort every update O(N log N) - too slow for 1M+ players
- Optimized: Only rerank affected range (rating ±100 of changed players)
- Top 500: Maintain sorted set in Redis, update in O(log N)
- Bulk: Update rest in background job every 30sec
- Consideration: Rank is soft-real-time (eventual consistency acceptable)

Non-functional requirements:
- Throughput: 1000 match results/sec (peak concurrent matches)
- Latency: Top 500 ranks updated <500ms after match
- Real-time: WebSocket updates <1sec for subscribed clients
- Scale: 10M players, 1M active per season, 100k concurrent connections
- Data retention: All matches stored indefinitely (historical analysis)
- Availability: 99.9% uptime (brief outages acceptable, not during tournaments)

Performance optimizations:
- Pre-compute rank ranges (e.g., "Top 1%") to avoid full scans
- Cache leaderboard snapshots at percentiles (update every 30sec)
- Shard by region (most players care about regional ranks)
- Denormalize friend rankings (small dataset, fast lookups)
- Use materialized views for common queries (global top 100)

Edge cases:
- Player changes region mid-season → separate rankings per region, no transfer
- Mass rating reset (new season) → lock leaderboard during migration (5min maintenance)
- Player name change → update denormalized leaderboard entries (eventual)
- Rapid consecutive matches → queue rating updates, process sequentially per player
- Tournament matches + ranked matches same time → separate rating pools

Avoid:
- Real-time rank for all 10M players (unnecessary, expensive)
- Synchronous rank calculation blocking match completion
- Storing rank in player record (derived state, causes consistency issues)
- Client-side rank calculation (security risk, untrusted)
- Hardcoding ELO constants (make configurable per game mode)
```

---

## Anti-Patterns to Avoid

### Vague Problem Statements
❌ "Build a user system"
✅ "Build a multi-tenant user management system where organizations can invite members, assign roles, and control access to organization resources"

### Solution-First Thinking
❌ "Use Redis for caching and PostgreSQL for storage"
✅ "We need fast lookups for user sessions (access pattern: read-heavy, ~10k ops/sec) and durable storage for user profiles (access pattern: write-once, read-occasionally). Evaluate Redis vs Memcached for sessions, PostgreSQL vs DynamoDB for profiles."

### Ignoring Failure Scenarios
❌ "When user clicks submit, save the form"
✅ "When user clicks submit: validate inputs, check for duplicates, save with optimistic locking (handle concurrent edits), send confirmation email (async, retry on failure), redirect to success page (handle slow saves with loading state)"

### Missing Business Context
❌ "Add a search feature"
✅ "Add product search for customers who know approximately what they want but need help finding specific items. Must handle typos, return results in <100ms, prioritize in-stock items, and suggest alternatives for out-of-stock products. Drives 40% of site conversions."

### Ignoring Non-Functional Requirements
❌ "Create an API endpoint for user data"
✅ "Create user profile API: must support 500 req/sec, return data in <100ms p95, handle concurrent profile updates without data loss, rate limit to 100 req/min per user, require authentication, log access for GDPR compliance"

### Overlooking Edge Cases
❌ "Allow users to cancel subscriptions"
✅ "Allow users to cancel subscriptions: immediate cancellation (lose access now) vs end-of-period (access until paid period ends), handle cancellation during trial differently, refund prorated amount for annual plans, delete payment method or keep on file? What happens to user data? Can they reactivate?"

---

## Questions to Consider

Before submitting a task, ask yourself:

### Domain Understanding
- [ ] What are the core domain concepts?
- [ ] What business rules must never be violated?
- [ ] Who are the stakeholders and what do they need?
- [ ] What language do domain experts use?

### Problem Space
- [ ] What problem am I really solving?
- [ ] Why is this valuable to the business/users?
- [ ] What happens if we don't build this?
- [ ] Are there existing solutions to learn from?

### Boundaries & Scope
- [ ] What's explicitly in scope?
- [ ] What's explicitly out of scope?
- [ ] Where are the integration boundaries?
- [ ] What are the dependencies?

### Data & State
- [ ] What are the core entities?
- [ ] How do entities relate to each other?
- [ ] What state transitions are valid?
- [ ] Where is the source of truth for each entity?

### Behavior & Rules
- [ ] What are the key use cases?
- [ ] What can go wrong in each use case?
- [ ] What business rules govern behavior?
- [ ] What edge cases exist?

### Quality Attributes
- [ ] What are the performance expectations?
- [ ] How much scale is needed (now and future)?
- [ ] What are the security requirements?
- [ ] What are the compliance/regulatory needs?

### Evolution
- [ ] How will this change over time?
- [ ] What extensibility points are needed?
- [ ] What should we avoid coupling to?
- [ ] What technical debt would we regret?

---

## Output Structure

After orchestration completes, you'll find:

```
./research/
├── domain-model.md              # Core concepts and relationships
├── business-rules.md            # Invariants and policies
├── use-cases.md                 # User journeys and scenarios
├── approach-comparison.md       # Multiple solutions analyzed
├── constraints-and-risks.md     # Limitations and concerns
├── integration-analysis.md      # External dependencies
└── recommendations.md           # Chosen approach and rationale

./plan.md                        # Implementation roadmap
./corrective-plan.md             # Issues found during review (if any)

./outputs/
├── research_[timestamp].json    # Research phase output
├── plan_[timestamp].json        # Planning phase output
├── implement_[timestamp].json   # Implementation phase output
├── correct_[timestamp].json     # Correction phase output
└── workflow_summary_[timestamp].json

./src/                           # Implementation (varies by task)
./tests/                         # Test suite
```

---

## Tips for Success

1. **Start with Why**: Explain the business problem before the technical solution
2. **Use Domain Language**: Speak in terms the business understands
3. **Be Specific About Rules**: "Valid email" is vague; specify the regex or validation library
4. **Describe Failure**: What happens when things go wrong matters as much as happy paths
5. **Think in Behaviors**: Not just data structures, but what actions are possible and their rules
6. **Consider Time**: How do entities evolve? What's the lifecycle?
7. **Question Assumptions**: State your assumptions explicitly so research can verify them
8. **Think About Operations**: How is this monitored, debugged, and maintained?
9. **Respect Boundaries**: Clearly define what's in vs out of scope
10. **Optimize for Change**: What's likely to change and how can we accommodate it?

---

The orchestrator will guide you through deep analysis, strategic planning, implementation, and review to deliver a well-architected solution that solves real problems.
