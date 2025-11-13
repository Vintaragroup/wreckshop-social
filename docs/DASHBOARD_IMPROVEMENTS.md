# Landing Dashboard Improvements

This document tracks the tasks to move the landing dashboard from placeholders to live, actionable snapshot data for artists and managers.

## Goals

- Show real platform health (connected, last sync, expiring tokens)
- Surface recent audience activity immediately
- Keep the page fast with skeletons and resilient fallbacks
- Respect roles: artist vs manager (deeper wiring later)

## Phase 1 (implemented here)

- Create a dashboard snapshot hook that composes:
  - Integrations status: `/api/integrations/status/:artistId` (Prisma)
  - Instagram fallback: `/api/integrations/instagram/:userId` (Mongo)
  - Recent contacts: `/api/audience/contacts` (top 5)
- Update `Dashboard` to render:
  - Instagram + Spotify cards from live status (connected + last sync)
  - Placeholders for other platforms until wired
  - A new "Recent Contacts" card using live data

Files:
- `src/lib/dashboard/snapshot.ts` (new hook)
- `src/components/dashboard.tsx` (wired to the hook)

## Phase 2 (next up)

- Engagement timeseries (7-day): add `/api/manager/artists/:artistId/analytics/engagement?window=7d` returning daily buckets for emails, SMS, streams, tickets. Replace chart placeholders.
- Upcoming items: merge top 3-5 from `/api/campaigns`, `/api/releases`, `/api/events` (future only). Show type badge and scheduled time.
- Alerts: show token-expiring warnings from Instagram `needsRefresh`; add not-connected warnings for required platforms.
- Manager snapshot: pull `/api/dashboard/manager` for totals by status and top artist and surface a compact summary.

## API mapping

- Platform Health
  - Preferred: `GET /api/integrations/status/:artistId` → { spotify, instagram }
  - Fallback (Instagram): `GET /api/integrations/instagram/:userId` → connection with `connectedAt`, `lastSync`, `needsRefresh`
- Recent Contacts
  - `GET /api/audience/contacts` → list of contacts (limit client-side to 5)
- Future endpoints
  - `GET /api/manager/artists/:artistId/analytics/engagement?window=7d`
  - `GET /api/campaigns` / `GET /api/releases` / `GET /api/events` (future items)

## UX states

- Loading: skeletons/spinners per card
- Empty: friendly messages with calls-to-action (e.g., Connect Instagram / Create Campaign)
- Error: soft inline message; do not block the rest of the dashboard

## Acceptance criteria

- Dashboard renders when authenticated without errors
- Instagram/Spotify cards reflect real connected status and last sync when available
- Recent Contacts shows up to 5 items with consent badges
- No regressions in tests/build; Docker hot reload continues to work

## Notes

- For local Docker dev, the frontend uses relative `/api` and the backend routes already require authentication. No additional docker changes are needed.
- The Instagram 404 "No active Instagram connection found" is treated as a normal disconnected state in the UI.
