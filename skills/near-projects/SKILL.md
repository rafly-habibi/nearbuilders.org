---
name: near-projects
version: 1.0.0
description: Create, discover, and manage projects and ideas on NEAR Builders. Pitch projects for funding, browse hackathon projects, upvote ideas, and match talent with opportunities. Activates when the user talks about NEAR projects, ideas, hackathons, funding, or pitching.
activation:
  keywords:
    - project
    - projects
    - idea
    - ideas
    - hackathon
    - pitch
    - funding
    - upvote
    - NEAR project
    - builder project
    - nearbuilders
    - project board
    - project ideas
    - bounty
    - open project
  patterns:
    - "(?i)(?:pitch|submit|create|post|share|propose) (?:a |my |the )?(?:project|idea)"
    - "(?i)(?:find|browse|discover|search|list) (?:projects?|ideas?) (?:on )?(?:near|nearbuilders)"
    - "(?i)(?:hackathon|bounty|funding|grant) (?:projects?|ideas?|opportunit)"
    - "(?i)what (?:are people |is being )?building (?:on )?near"
    - "(?i)nearbuilders\\.org/projects"
  tags:
    - near
    - projects
    - hackathon
    - funding
    - community
  max_context_tokens: 4000
---

# NEAR Projects

You help users create, discover, and manage projects and ideas on the NEAR Builders platform at nearbuilders.org. NEAR Builders is a project dashboard where builders pitch their work for funding and NEAR Legion members request projects they want built. It's also a database of past hackathon projects — a living source of potential projects and teams worth continuing.

## Core concepts

1. **Two kinds: projects and ideas.** A `project` is something actively being built. An `idea` is something someone wants built. Both live on the same board and can transition between types.
2. **Projects are the connective tissue.** They link builders to apps, repositories, and domains. A project can have linked on-chain apps and a GitHub repository.
3. **Community-ranked, not admin-curated.** Projects gain visibility through community engagement, not editorial selection. The best ideas surface organically.
4. **Hackathon memory.** Every past hackathon project is captured here, not lost to event pages that disappear. Good combos of people persist, not just good projects.

## API reference

The NEAR Builders API is at `https://api.nearbuilders.org` (or `http://localhost:3001` for local development). All project endpoints are under `/v1/projects`.

### List projects and ideas

```
GET /v1/projects
```

Query parameters:
- `kind` (string, optional) — `"project"` or `"idea"`, filter by type
- `visibility` (string, optional) — `"private"`, `"unlisted"`, or `"public"`
- `status` (string, optional) — `"active"`, `"paused"`, or `"archived"`
- `ownerId` (string, optional) — filter by owner user ID
- `organizationId` (string, optional) — filter by organization
- `limit` (integer, 1-100, optional) — page size
- `cursor` (string, optional) — pagination cursor

Response:
```json
{
  "data": [
    {
      "id": "proj_abc123",
      "ownerId": "user_xyz",
      "organizationId": null,
      "kind": "project",
      "slug": "near-pay-protocol",
      "title": "NEAR Pay Protocol",
      "description": "A cross-chain payment protocol built on NEAR Intents",
      "content": "# Overview\n\nFull markdown description...",
      "status": "active",
      "visibility": "public",
      "repository": "https://github.com/example/near-pay",
      "domain": null,
      "createdAt": "2025-02-10T08:00:00Z",
      "updatedAt": "2025-05-01T12:00:00Z"
    }
  ],
  "meta": {
    "total": 87,
    "hasMore": true,
    "nextCursor": "eyJpZCI6InByb2pfYWJjMTIzIn0="
  }
}
```

### Get a single project

```
GET /v1/projects/{id}
```

Returns the project detail including linked on-chain apps (gateway + account pairs).

### Create a project or idea (requires auth)

```
POST /v1/projects
```

Body:
```json
{
  "kind": "project",
  "title": "NEAR Pay Protocol",
  "slug": "near-pay-protocol",
  "description": "A cross-chain payment protocol built on NEAR Intents",
  "content": "# Overview\n\nFull markdown description with project details...",
  "visibility": "public",
  "repository": "https://github.com/example/near-pay"
}
```

Required fields: `kind`, `title`, `slug` (lowercase, hyphens only, e.g. `my-project-name`).
Optional fields: `description` (max 1000 chars), `content` (max 50000 chars, markdown), `visibility` (defaults to public), `repository` (URL), `organizationId`, `domain`.

### Update a project (requires auth, owner only)

```
PATCH /v1/projects/{id}
```

Same fields as creation, all optional. Use to change title, description, content, status, visibility, or repository.

### Delete a project (requires auth, owner only)

```
DELETE /v1/projects/{id}
```

Soft-deletes the project. Returns `{ "deleted": true }`.

### Link an on-chain app to a project (requires auth)

```
POST /v1/projects/{projectId}/apps
```

Body:
```json
{
  "accountId": "dev.everything.near",
  "domain": "nearbuilders.org"
}
```

Links a deployed on-chain app (identified by NEAR account + gateway domain) to the project.

### List apps for a project

```
GET /v1/projects/{projectId}/apps
```

### Unlink an app from a project (requires auth)

```
DELETE /v1/projects/{projectId}/apps/{accountId}/{domain}
```

### Find projects for an on-chain app

```
GET /v1/apps/{accountId}/{domain}/projects
```

Returns all projects linked to a specific on-chain app.

## Common workflows

### Pitch a project for funding

User says: "I want to pitch my project on NEAR Builders"

1. Ask for the project title, a short description, and a slug suggestion
2. Ask if this is a `project` (actively being built) or an `idea` (something they want built)
3. Ask for the GitHub repository URL if they have one
4. Ask about visibility: `public` (everyone can see), `unlisted` (only with link), or `private`
5. Call `POST /v1/projects` with the assembled data
6. Suggest they add a longer `content` field with a full pitch in markdown — problem statement, solution, team, milestones
7. If they have a deployed on-chain app, offer to link it with `POST /v1/projects/{id}/apps`

### Browse hackathon projects

User says: "What hackathon projects are on NEAR Builders?"

1. Call `GET /v1/projects?kind=project&status=active&limit=20`
2. Present the results as a table: title, kind, status, repository, created date
3. If any catch the user's eye, fetch the full detail with `GET /v1/projects/{id}`
4. Suggest: "Want to see ideas people want built?" → `GET /v1/projects?kind=idea`

### Find ideas to work on

User says: "What ideas are people looking to get built?"

1. Call `GET /v1/projects?kind=idea&status=active&limit=20`
2. Present as a prioritized list: title, description, created date
3. For ideas that resonate, fetch the full `content` field for the detailed pitch
4. Suggest: "If you want to start building one of these, you can create a project and link back to the idea"

### Find builders for a project

User says: "I need Rust developers for my project"

1. First, get the user's project: `GET /v1/projects?ownerId={theirUserId}`
2. Then search for builders with relevant skills: `GET /v1/builders?skill=Rust&limit=20`
3. Present matching builders alongside the project detail
4. Suggest: "Your project is at nearbuilders.org/projects/{slug}. Share the link with builders you want to connect with."

### Graduate an idea to a project

User says: "This idea is ready to become a project"

1. Fetch the idea: `GET /v1/projects/{id}`
2. Create a new project based on it: `POST /v1/projects` with `kind: "project"` and the idea's title/slug/content
3. Update the original idea: `PATCH /v1/projects/{ideaId}` with `status: "archived"` and a note in `content`
4. Optionally link the idea and project descriptions to reference each other

### Archive a completed or abandoned project

User says: "My project is done, I want to archive it"

1. Confirm the project ID
2. Call `PATCH /v1/projects/{id}` with `status: "archived"`
3. If the project has linked apps that are still live, ask if they should be left linked or unlinked

## Project content conventions

The `content` field supports full markdown (up to 50,000 chars). Encourage users to structure their pitch as:

```markdown
# Problem
What problem does this solve?

# Solution
How does it work? What's the approach?

# Team
Who is building this? Link to builder profiles.

# Milestones
- [ ] Milestone 1: Description (target date)
- [ ] Milestone 2: Description (target date)

# Technical Details
Architecture, NEAR-specific integrations, intended contracts.

# Links
- GitHub: https://github.com/...
- Live demo: https://...
```

## Hard rules

- **Never fabricate projects.** Only present data returned by the API. If no results, say so clearly.
- **Never create a project without explicit user confirmation of title, kind, and visibility.** Always confirm before POST.
- **Never delete a project without double confirmation.** "Are you sure you want to delete {title}?" is required.
- **Slug format is strict.** Must be lowercase, hyphens only, matching `/^[a-z0-9-]+$/`. Generate from the title by lowercasing, replacing spaces and special chars with hyphens, and collapsing multiple hyphens.
- **Respect visibility.** If a project is `private`, do not share its contents outside the owner's session.
- **Content field is markdown.** When presenting project content, render it as readable text, not raw markdown syntax.