# Contributor Roster Design

## Goal

Add automatic contributor recognition to the wiki without turning it into a full social system:

- Every wiki entry can show recent contributors and cumulative contributors for that entry.
- The home page can show site-wide recent contributions and all-time contributors.
- Contribution data is stored in the existing Cloudflare D1 backend.
- Sync data comes from Git history, with GitHub identity enrichment when possible.

## Implemented Approach

Use a backend-backed sync pipeline:

1. `scripts/sync-contributors.mjs` scans Git history for `src/content` changes.
2. The script groups locale files into logical wiki entries.
3. It derives a safe contributor identity:
   - GitHub noreply email becomes GitHub login, profile URL, and avatar URL.
   - Other authors use a hashed email identity and display name.
   - Raw email addresses are not sent to the frontend.
4. The script posts normalized events to `POST /api/admin/contributors/sync`.
5. The Worker stores contributors, identities, and contribution events in D1.
6. Frontend components fetch public JSON from:
   - `GET /api/contributors/summary`
   - `GET /api/contributors/entry?collection=artists&entryId=vwp/kaf`

This keeps the UI current without requiring a full site rebuild for every contribution sync.

## Database Shape

Backend migration `0006_contributors.sql` adds:

- `contributors`: public display identity and aggregate stats.
- `contributor_identities`: stable provider keys for GitHub and hashed Git authors.
- `contribution_events`: one event per commit/file/contributor.
- `contribution_sync_runs`: lightweight audit trail for sync attempts.

Events are idempotent by `commit_sha + path + contributor_id`, so repeated syncs are safe.

## UI Placement

### Entry Pages

Artist entry pages render `ContributorRoster` under the wiki info box.

The panel shows:

- Total contributors and contributions for the entry.
- Top contributors for the entry.
- Recent commit activity for the entry.

### Home Page

The home page renders `ContributorRoster` after the artist database section.

The panel shows:

- Site-wide totals.
- Top contributors across content.
- Recent contribution activity.

The style stays compact: dark surface, mono labels, avatar chips, and dense rows that match the existing wiki interface.

## Sync Usage

Required environment:

- `CONTRIBUTORS_API_BASE` or `PUBLIC_AI_OBSERVER_API_BASE`
- `CONTRIBUTOR_SYNC_TOKEN`

Command:

```bash
pnpm contributors:sync
```

The backend also supports admin-session access for manual sync tools, while CI should use the bearer token.

## Privacy

- Raw commit author emails are not rendered.
- Non-GitHub authors are keyed by SHA-256 email hash.
- GitHub avatars and profiles are only used when the Git history exposes a GitHub noreply identity.

## Future Extensions

- Add the same entry panel to project and log pages.
- Add admin sync status display.
- Add manual contributor alias merge tools.
- Add GitHub Actions workflow to run the sync after content changes.
