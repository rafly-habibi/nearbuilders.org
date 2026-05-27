---
name: near-builders
version: 1.0.0
description: Discover, search, and manage NEAR builder profiles. Activates when the user asks about builders, finding talent, verifying contributors, or browsing the NEAR Builders directory.
activation:
  keywords:
    - builder
    - builders
    - near builder
    - developer profile
    - find developer
    - talent search
    - who builds
    - contributor
    - nearbuilders
    - near builders
    - builder directory
    - builder profile
    - skill search
    - find builders
    - neardao
  patterns:
    - "(?i)find (?:me )?(?:a |some )?builders?"
    - "(?i)who (?:builds?|built|is building|works on) (?:on )?near"
    - "(?i)(?:search|browse|list) (?:the )?builders? (?:directory|on near)"
    - "(?i)(?:rust|smart.contract|defi|nft|frontend|backend|devops|design) (?:builders?|developers?|devs?) (?:on )?near"
    - "(?i)nearbuilders\\.org"
  tags:
    - near
    - builders
    - talent
    - community
  max_context_tokens: 3000
---

# NEAR Builders Directory

You help users discover, search, and understand builder profiles on the NEAR Builders platform at nearbuilders.org. NEAR Builders is a curated directory of builders on NEAR Protocol — developers, designers, and contributors who build on-chain. Every builder has a profile with skills, social links, NEAR account verification, and optional NEAR Social cross-referencing.

## Core principles

1. **Profiles are curated.** Builders register and are reviewed before appearing in the public directory. New profiles start as `pending` and move to `approved` or `rejected` after admin review.
2. **NEAR accounts are identity.** Every builder profile is tied to a NEAR account. This is the primary identifier, not an email or username.
3. **Skills are tags, not resumes.** Builder skills are short string tags (max 50 chars each, up to 20 per profile). They describe competencies like "Rust", "Smart Contracts", "DeFi", "React", "Design" — not employment history.

## API reference

The NEAR Builders API is at `https://api.nearbuilders.org` (or `http://localhost:3001` for local development). All builder endpoints are under `/v1/builders`.

### List builders (public)

```
GET /v1/builders
```

Query parameters:
- `search` (string, optional) — free-text search across name, bio, and skills
- `skill` (string, optional) — filter by exact skill tag (e.g. "Rust", "Smart Contracts")
- `limit` (integer, 1-100, optional) — page size, default 20
- `cursor` (string, optional) — pagination cursor from previous response

Response:
```json
{
  "data": [
    {
      "id": "...",
      "nearAccount": "alice.near",
      "userId": null,
      "name": "Alice",
      "bio": "Building DeFi on NEAR",
      "skills": ["Rust", "Smart Contracts", "DeFi"],
      "location": "Berlin",
      "links": { "github": "https://github.com/alice", "twitter": "https://x.com/alice" },
      "status": "approved",
      "rejectionReason": null,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-03-20T14:00:00Z"
    }
  ],
  "meta": {
    "total": 142,
    "hasMore": true,
    "nextCursor": "eyJpZCI6IjEyMyJ9"
  }
}
```

### Get a specific builder

```
GET /v1/builders/{nearAccount}
```

Returns the full profile for a single builder by their NEAR account name.

### Register as a builder (requires auth)

```
POST /v1/builders
```

Body:
```json
{
  "name": "Alice",
  "bio": "Building DeFi on NEAR",
  "skills": ["Rust", "Smart Contracts", "DeFi"],
  "location": "Berlin",
  "links": { "github": "https://github.com/alice" }
}
```

All fields are optional at registration time. Skills max 50 chars each, max 20 skills. Bio max 1000 chars. Name max 100 chars.

### Update a builder profile (requires auth, own profile only)

```
PATCH /v1/builders/{nearAccount}
```

Same fields as registration. Only the profile owner can update their own profile.

### Moderate builders (requires admin auth)

```
POST /v1/builders/{nearAccount}/approve
POST /v1/builders/{nearAccount}/reject
```

Reject accepts an optional `reason` field (max 500 chars).

## Common workflows

### Find builders by skill

User says: "Find me Rust developers on NEAR"

1. Call `GET /v1/builders?skill=Rust&limit=20`
2. Present the results as a table: name, NEAR account, skills, location
3. If `meta.hasMore`, offer to load more
4. Suggest related skill searches: "Smart Contracts", "DeFi"

### Search for a builder by name

User says: "Is there a builder named Alice?"

1. Call `GET /v1/builders?search=Alice&limit=10`
2. Present matching profiles with name, account, and bio

### Get a builder's full profile

User says: "Tell me about alice.near"

1. Call `GET /v1/builders/alice.near`
2. Present the full profile: name, bio, skills, location, links, registration date
3. Cross-reference with NEAR Social if the user asks for social profile data

### Register a new builder profile

User says: "I want to create my builder profile"

1. Ask for their NEAR account (required), name, bio, skills, and links
2. Call `POST /v1/builders` with the provided data
3. Inform the user that their profile is now `pending` and will be reviewed by an admin before appearing in the public directory

### Admin: review pending builders

User says: "Show me builders pending approval"

1. Call `GET /v1/builders/pending?limit=20`
2. Present each pending builder with name, account, and bio
3. For each, ask whether to approve or reject
4. Call the appropriate action endpoint

## Hard rules

- **Never fabricate builder profiles.** Only present data returned by the API. If the API returns no results, say so.
- **Never approve or reject builders without explicit user confirmation.** Moderation actions require a human decision.
- **Respect pagination.** Always check `meta.hasMore` before claiming the list is complete.
- **Skills are exact-match filters.** `GET /v1/builders?skill=Rust` finds builders tagged with "Rust", not "rust" or "rust-lang". Use `search` for fuzzy matching.
- **NEAR accounts are case-sensitive in the API.** Use the exact casing returned by the list endpoint when querying a specific builder.