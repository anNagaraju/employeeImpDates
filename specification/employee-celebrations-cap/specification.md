# Specification: employee-celebrations-cap

> **Guidelines**: Read [guidelines.md](../guidelines.md) and [guidelines-cap.md](../guidelines-cap.md) before executing ANY tasks below. Follow all constraints described there throughout execution.

## Basic Setup

- [x] Read the project input (`product-requirements-document.md`, `intent.md`)
- [x] Invoke the `cap-development` skill from `assets/employee-celebrations-cap/` to set up the CAP project structure
- [x] Install dependencies (`npm install`), validate the project starts (`cds watch`) and responds

## Data Model

- [x] Define `Employee` entity in `db/schema.cds`:
  - `ID` (UUID, key)
  - `name` (String, not null)
  - `email` (String)
  - `department` (String)
  - `birthday` (Date) — month/day used for yearly recurrence
  - `hireDate` (Date) — used to compute work anniversary
  - `photoUrl` (String) — optional profile photo URL
- [x] Define `Wish` entity in `db/schema.cds`:
  - `ID` (UUID, key)
  - `employee` (Association to Employee)
  - `senderName` (String)
  - `message` (String)
  - `createdAt` (DateTime, managed)
  - `celebrationType` (String) — "birthday" or "anniversary"

## Service Layer

- [x] Define `AdminService` in `srv/admin-service.cds` exposing full CRUD on `Employees` and `Wishes` (requires authentication)
- [x] Define `PublicService` in `srv/public-service.cds` exposing read-only `Employees` (name, department, photoUrl, birthday, hireDate) and writable `Wishes` (no auth required — public wishing page)
- [x] Add `@readonly` on Employee projection in PublicService
- [x] Add CORS-friendly annotations to PublicService for iframe embedding

## Custom Logic (CAP Handlers)

- [x] Implement `srv/public-service.js`:
  - `TodayCelebrations()` — returns employees with a birthday or anniversary TODAY
  - `UpcomingCelebrations()` — returns employees with celebrations in the next 7 days
  - Date matching handles leap year birthdays (Feb 29 → Mar 1 in non-leap years)
  - `wishCount` virtual field on results

## Sample Data

- [x] Add `db/data/` CSV files with 8 sample employees covering multiple departments, today's birthday/anniversary, upcoming events in next 7 days

## Frontend — Admin UI

- [x] React app in `assets/employee-celebrations-cap/ui/` using SAP UI5 Web Components
- [x] Admin UI pages: Employee List table with Name/Email/Department/Birthday/HireDate, Add/Edit form dialog, Delete confirmation dialog
- [x] Admin UI connects to `AdminService` OData endpoint

## Frontend — Public Wishing Page

- [x] Wishing Page at `/wishing` — Today's Celebrations + Upcoming (next 7 days)
- [x] Celebration cards with avatar, name, department, celebration type badge, wish count
- [x] Send Wish form on each card — submits name + message
- [x] Page embeddable via iframe — includes "Embed this page" section with iframe snippet
- [x] Auto-refresh every 5 minutes

## Navigation & Routing

- [x] Landing page at `/` with links to Admin and Wishing pages
- [x] React Router: `/admin` → Admin UI, `/wishing` → Wishing Page

## Testing

- [x] Unit tests for `TodayCelebrations` — date matching logic verified
- [x] Unit tests for `UpcomingCelebrations` — 7-day window logic and sorting verified
- [x] Test for wish submission — wish saved with correct employee association
- [x] All 7 tests pass

## Validation

- [x] `cds compile srv/` — no errors
- [x] `cds watch` — service starts on port 4004
- [x] `GET /public/TodayCelebrations()` returns employees with today's birthday/anniversary ✓
- [x] `GET /public/UpcomingCelebrations()` returns next 7 days correctly ✓
- [x] Admin UI serves at `/admin`
- [x] Wishing Page serves at `/wishing`
- [x] Production build succeeds (`npm run build`) ✓
