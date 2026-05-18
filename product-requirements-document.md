# Product Requirements Document (PRD)

**Title:** Employee Birthday & Work Anniversary App  
**Date:** 2026-05-13  
**Solution Category:** BTP Extension

## Product Purpose & Value Proposition

**Elevator Pitch:**  
HR teams and employees lack a simple, central place to track and celebrate birthdays and work anniversaries. This app provides an admin interface to manage these dates and a celebration wishing page embeddable in any company portal.

**Expected Value:**  
- Improves employee engagement and sense of recognition  
- Eliminates manual tracking via spreadsheets  
- Provides a portal-ready wishing widget accessible to all employees

**Product Objectives:**
1. Enable HR admins to add/edit/delete employee birthday and work anniversary records
2. Display today's and upcoming celebrations on a public wishing page
3. Provide an embeddable wishing page (iframe-ready) for portal integration

## Requirements

### Must-Have Requirements

**R1: Employee Record Management**
- **User Story:** As an HR Admin, I need to create, update, and delete employee records including name, birthday, and hire date so that the celebrations calendar stays accurate.
- **Acceptance Criteria:**
  - Given I am an authenticated HR Admin, when I submit a new employee record with name, birthday, and hire date, then the record is saved and visible in the list.
  - Given I select an existing record, I can edit or delete it.
- **Priority Rank:** 1

**R2: Today's Celebrations View**
- **User Story:** As an employee, I need to see who has a birthday or work anniversary today so that I can send a personalized wish.
- **Acceptance Criteria:**
  - Given today's date, the wishing page shows all employees with a birthday or anniversary today with their name, photo (if available), and milestone (e.g., "5 Years").
- **Priority Rank:** 2

**R3: Upcoming Celebrations (next 7 days)**
- **User Story:** As an employee, I need to see upcoming birthdays and anniversaries in the next 7 days so that I can prepare greetings in advance.
- **Acceptance Criteria:**
  - The wishing page shows a scrollable list of upcoming events grouped by date.
- **Priority Rank:** 3

**R4: Portal Embeddable Wishing Page**
- **User Story:** As a portal administrator, I need to embed the wishing page into our company portal so employees can see celebrations without switching apps.
- **Acceptance Criteria:**
  - The wishing page is accessible via a standalone URL and can be embedded in any portal via an iframe.
- **Priority Rank:** 4

**R5: Wish / Greet Action**
- **User Story:** As an employee, I need to send a quick celebration wish from the wishing page so that the employee feels recognized.
- **Acceptance Criteria:**
  - A "Send Wish" button on each celebration card allows submitting a message; the wish count is shown on the card.
- **Priority Rank:** 5

## Solution Architecture

**Architecture Overview:**  
CAP (Node.js) backend deployed on SAP BTP Cloud Foundry, providing OData/REST services. React frontend with SAP UI5 Web Components, split into two views: Admin Management UI (authenticated) and Public Wishing Page (unauthenticated/portal embeddable).

**Key Components:**
- **CAP Backend**: Employee entity (name, birthday, hireDate, department, photoUrl), Wishes entity; serves OData API; auto-computes upcoming events
- **Admin UI (React)**: CRUD for employee records; protected by BTP authentication
- **Wishing Page (React)**: Read-only public page showing today's + upcoming celebrations; iframe-embeddable

**Deployment:**
- SAP BTP Cloud Foundry (Node.js runtime)
- SAP HANA Cloud or SQLite for local development

### Automation & Agent Behaviour

**Automation Level:** Rule-based

**Actions performed automatically:**
- Compute today's and next-7-day birthday/anniversary matches on page load

**Guardrails:**
- Wishing page is read-only (no employee data edits from public page)
- Admin UI requires authenticated BTP user
