# Employee Birthday & Work Anniversary App

Employee Birthday and Work Anniversary date maintenance application with a celebration wishing page for portal integration.

## Business challenge

HR teams need a central application to maintain employee birthday and work anniversary dates, and provide a public-facing wishing page that can be embedded into the company portal to celebrate employees.

## Business Architecture (RBA)

### End-to-End Process
Recruit to Retire

### Process Hierarchy
```
Recruit to Retire
└── Manage Workforce (generic)
    └── Manage employee information and reporting (BPS-385)
        └── Manage workforce data
└── Reward to Retain (generic)
    └── Reward and recognize talent (BPS-390)
        └── Develop and manage reward, recognition and motivation programs
```

### Summary
Employee date maintenance maps to BPS-385 (Manage employee information and reporting); the wishing/celebration portal aligns with BPS-390 (Reward and recognize talent) — both within Recruit to Retire.

## Fit Gap Analysis

| Requirement | Standard asset(s) found | API ORD ID | MCP Server ORD ID | Gap? | Notes |
|---|---|---|---|---|---|
| Store/manage employee birthday & anniversary | SAP SuccessFactors Employee Central (Employee Administration SC1251) | `sap.sf:apiResource:ECPersonalInformation:v1` | — | Yes | No out-of-box custom date maintenance UI; custom BTP app needed |
| View today's / upcoming celebrations | SAP SuccessFactors Employee Central | `sap.sf:apiResource:ECEmploymentInformation:v1` | — | Yes | Portal-embeddable wishing page not available OOTB |
| Recognition / wishing for milestones | SAP SuccessFactors Compensation (Recognition Management SC1305) | — | — | Yes | SuccessFactors recognition is compensation-focused; lightweight portal widget needed |
| Portal embeddable widget | — | — | — | Yes | Requires custom React component embeddable in any portal via iframe/URL |

### Key findings
- No MCP servers found for SuccessFactors APIs in this landscape; APIs are available but direct BTP Extension is the right path.
- SAP SuccessFactors covers employee data storage but lacks a custom celebration/wishing UI.
- A BTP Extension (CAP + React) best fills the gap: data management backend + embeddable portal wishing page.
- Employee data (name, department, photo) can be seeded manually or synced from SuccessFactors later.
- The wishing page will be a standalone React page embeddable via iframe for portal integration.

## Recommendations

### BTP Extension: Employee Celebrations App

#### Executive Summary
CAP backend + React UI on BTP for birthday/anniversary management and portal wishing page.

#### Recommended Solution
Build a SAP BTP Extension using CAP (Node.js) as the backend and React with SAP UI5 Web Components as the frontend. The solution has two main screens: (1) an Admin UI to add/edit/delete employee records with birthday and hire date; (2) a public Wishing Page showing today's and upcoming birthdays/anniversaries with celebration cards — embeddable in any company portal via iframe.

#### Recommended solution category
BTP Extension

#### Intent fit
88%
