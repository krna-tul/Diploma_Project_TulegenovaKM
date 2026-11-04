# Target Platform Architecture

## Components

The web client calls a modular monolith over REST/JSON. Modules: identity and roles; profiles, skills and events; requests and appointments; plans and meetings; Development Visit; evaluation and archive; academic office and XLSX import with preview; reference lists and settings; internal notifications; aggregated reports and audit. PostgreSQL stores the related entities. Private attachments are stored separately with access checks; university SSO, HR, email and e-signature are connected after approval by IT. Internal notifications and RU/KZ/EN are part of the target MVP.

The current prototype does not call this API: it demonstrates the process in a single browser. The diagrams show the target architecture, not a backend that already runs.

## Data and invariants

A User has roles within a School; MentorProfile references User and Skill through a link table. Request stores the professional request and the preferred mentor. Pair links the mentor, the mentee, the School, the period, the decisions and the appointment order details. PlanVersion belongs to a Pair; PlanItem and Meeting belong to the version or the pair. Visit stores the preparation, Observation stores facts and a timestamp, and Reflection stores the discussion. Evaluation belongs to the start, midpoint or final stage. Event is linked to Skill; Enrollment is unique per event and participant.

A third pair is checked inside a transaction that locks the mentor and counts active appointments; an exception requires a justification and two confirmations. A mentor cannot be their own mentee. Two consents and an appointment order are required before the programme starts. Plan consents are tied to a version, so an edit does not keep the old approval. Updates use version/If-Match; a lost update returns 409. Every state change is written to the audit log in the same transaction.

## Access

Only the approved mentor profile and the public showcase are visible across the university. Detailed observation and discussion notes are available to the pair. The School receives administrative order details and the plan under approval with the minimum necessary information; personal notes are not included in the plan. Management analytics are built from a separate projection without private text. Exceptional access is logged with a reason and the scope of disclosure; the administrator role alone does not grant it.

## Draft API contract

| Method and path | Purpose | Access |
| --- | --- | --- |
| GET /api/skills, /api/events, /api/mentors | Catalogue | Signed-in lecturers |
| POST /api/mentor-applications | Candidate profile | Author |
| POST /api/requests | Individual request | Author or authorised School |
| POST /api/pairs/{id}/consents | Consent to the pair | The relevant participant |
| POST /api/pairs/{id}/presentation | Nomination | Director of the same School |
| POST /api/pairs/{id}/appointment | Appointment order details | Vice-rector / registrar |
| POST /api/pairs/{id}/plans | Plan version | Pair participants |
| POST /api/plans/{id}/consents | Version consent | Participants |
| POST /api/plans/{id}/approval | Approval | Director |
| POST /api/pairs/{id}/meetings, /visits, /evaluations | Pair work | Participants |
| POST /api/pairs/{id}/change-requests | Replacement / early completion | Participants and School |
| GET /api/reports/summary | Aggregated report | School within its scope |

Errors: 400/422 validation, 401 not signed in, 403/404 resource not available, 409 version or status conflict. A cookie session requires CSRF protection for writes; HTTPS is mandatory. A role identifier sent by the client never defines permissions.

Diagrams: sources in docs/diagrams/source and readable SVG files in docs/diagrams/exports. The use case diagram is written in PlantUML; the others in Mermaid. The SVG files are standalone readable views of the same structure; the sources remain editable.

## Addendum to the specification: academic office, administration and archive

The academic office receives an administrative projection of statuses, completeness and deadlines within its permitted scope. Private text from requests, observations and discussions is not included. The technical administrator manages configuration, accounts and technical diagnostics but does not read confidential content on the strength of a technical role alone. A server-side object check is mandatory for every request and every attachment download.

ImportBatch stores the XLSX preview, row errors and duplicate emails; writing is allowed only after the checked set is confirmed. ConfigurationVersion stores periods, limits and templates without code changes. FinalPackage links the mandatory F-08–10 forms, the self-assessment and the mentor's feedback to the pair. ArchiveSnapshot keeps the package and its history; ordinary changes to a completed programme are forbidden, and permitted service operations require a reason and an audit entry. NotificationOutbox is written in the same transaction as the process change, and a unique event key prevents duplicate notifications.

| Method and path | Purpose | Access |
| --- | --- | --- |
| POST /api/plans/{id}/return | Return with a reason, new version and consent reset | Director of the same School |
| POST /api/meetings/{id}/confirmation | One-time confirmation | The other participant of the pair |
| GET /api/umo/programmes | Statuses and completeness without private text | Academic office within its scope |
| POST /api/imports/preview, /api/imports/{id}/commit | Check and confirm XLSX | Authorised staff member |
| POST /api/pairs/{id}/completion | Check the F-08–10 package and complete | Authorised process participant |
| GET /api/pairs/{id}/archive | Archive with object permissions | Permitted scope |
| PATCH /api/configuration | Settings version and audit | Technical administrator |

This is a design contract, not implemented endpoints. Coverage by the current prototype and the future MVP: [specification matrix](../tz-traceability.md).
