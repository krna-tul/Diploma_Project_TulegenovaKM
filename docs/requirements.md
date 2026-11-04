# Mentoring Platform Requirements

Must — required in the first server version; Should — the next priority function. The criteria apply to the target platform; coverage by the local prototype is listed separately in docs/prototype.md.

## Functional requirements

| ID | Priority and source | Requirement | Acceptance criterion |
| --- | --- | --- | --- |
| FR01 | Must USER REG | A separate mentor form with experience, qualifications, evidence, expertise, formats, availability and consent | Less than 3 years of experience blocks submission; the School separately checks the other criteria and the training before the profile is published |
| FR02 | Must USER REG | A mentee form with the request, goal, skills, format, period and preferred candidate | A request without a selected mentor is accepted; the School can propose an available candidate |
| FR03 | Must USER | A home showcase of skills and events with two application buttons at the top | A skill can be chosen without searching by name, related events are visible and an application can be started with that skill |
| FR04 | Must REG | Consent from both sides and the School | Appointment is unavailable without two consents; a refusal or return contains a reason and is kept in the history |
| FR05 | Must REG | Workload and conflict of interest check | A third active pair is blocked without a justification, the mentor's consent and the director's decision; a pair with a conflict is not appointed |
| FR06 | Must REG | Appointment document | After consent the director nominates the pair, and an authorised staff member records the number, date and author of the vice-rector's order; only then does the period start |
| FR07 | Must REG | Joint individual plan | Contains goals, tasks, deadlines, support, expected results and progress records; preparation time is 10 working days from the appointment; both sides consent to the version and the director approves it |
| FR08 | Must REG | Plan change | Editing an approved plan creates a new version, cancels the earlier consents and requires re-approval; the history is available |
| FR09 | Must REG | Meetings and progress | Participants record the date, format and outcome of a meeting in the plan; a hint recommends meeting at least once every two weeks |
| FR10 | Must DV | Development Visit | Preparation contains the goal, course, date, place, topic, type and context; observations contain timestamps and facts; the discussion contains self-reflection, plus/question/recommendation, changes and a way to measure them |
| FR11 | Must REG | Evaluation at the start, midpoint and end | Initial expectations, midpoint feedback, final self-assessment and the mentor's feedback are linked to the pair; completion requires the final evaluation |
| FR12 | Must REG | Replacement and early completion | Any participant can submit a request; the School records the decision and the reason; the archive is kept; the request is not marked as a failure |
| FR13 | Must REG | Aggregated analytics | Management sees request topics, work formats and results without private notes or difficulties; small groups are suppressed by an agreed threshold |
| FR14 | Should USER | Publishing and registering for events | The organiser sets skills, date, format and capacity; a repeated registration does not create a duplicate, and exceeding capacity is blocked |
| FR15 | Should REG | Recording mentoring work | 15 hours per mentee per trimester are shown, with an option to record an internal exception; the export does not replace the HR plan |

## Non-functional requirements

| ID | Acceptance criterion for the target version |
| --- | --- |
| NFR01 Access | The server checks the role, the School and participation in the pair on every request; ID substitution tests return 403/404; the role switcher in the prototype is not authorisation |
| NFR02 Confidentiality | Detailed observations are available only to the pair; the management report does not include them; exceptional access records a reason, scope, consent or exception category and an audit entry |
| NFR03 Durability | Daily backup; recovery is tested on a test database; target RPO 24 h and RTO 4 h are to be agreed |
| NFR04 Performance | According to the specification, core operations within 2 s and search or filtering within 3 s; the load and the interpretation of the threshold are to be agreed. Proposed test bench: 100 users, 1,000 profiles, p95; not yet approved by the client |
| NFR05 Interface accessibility | All main scenarios work from the keyboard; field labels, visible focus, errors as text; widths of 360–1440 px without horizontal page scrolling |
| NFR06 Audit | For state transitions the user, time, entity, version, old and new status are recorded; the audit excludes the text of personal notes |
| NFR07 Validation | The server checks dates, required fields and statuses independently of the client; invalid transitions return 409; concurrent changes do not lose updates |
| NFR08 Localisation | Interface, statuses and system messages in RU/KZ/EN; user content is not translated automatically. Check language switching and Kazakh characters; the new frontend supports all three languages |

## Roles and visibility

A lecturer can be a mentor and a mentee in different pairs. The School reviews candidates, proposes pairs and receives the minimum reporting information for its own School. The director agrees exceptions and approves the plan. The vice-rector or registrar records the order. The Department of Academic Affairs runs the training. The organiser manages events. The administrator manages reference lists and accounts but does not get automatic access to private notes.

## States

Profile: draft → School review → training confirmed → published; a return is possible. Pair: request → matching → consent from both sides → director's nomination → order → plan → work → final evaluation → completed. A refusal and a replacement request are possible at each stage. Plan: draft → two consents → approved; a change → a new version and new consents.

## Additions from the technical specification

| ID | Priority and source | Requirement | Acceptance criterion for the target version |
| --- | --- | --- | --- |
| FR16 | Must TZ FR-SCH-05 | Plan return with a comment | An empty reason is forbidden; participants see the version and the comment; the old consents are reset |
| FR17 | Must TZ FR-MEN-08/FR-MTR-06 | Meeting confirmation by the other participant | The author does not confirm their own record; the other participant confirms once; the date and author of the confirmation are saved |
| FR18 | Must TZ §18–19,28 | Final forms and archive | Completion requires the F-08 checklist, the F-09 self-assessment and the F-10 feedback; the archive closes ordinary changes, keeps versions, and access and corrections are logged |
| FR19 | Must TZ FR-UMO-01–09 | Academic office workspace | Filters by School, status and period, completeness and workload; export of permitted fields with an audit entry; private consultations are excluded |
| FR20 | Must TZ FR-TECH-01–05 | Technical administration | The technical administrator sees integration errors and technical logs; access to consultation content is forbidden without a separate reason |
| FR21 | Must TZ §21 | XLSX pre-check | Before confirmation, gaps, invalid corporate emails and duplicates are shown; cancelling does not change the database; a permitted import is logged |
| FR22 | Must TZ §23 | Reference lists and templates | An authorised administrator changes deadlines, limits, Schools, categories and templates without changing code; the history keeps the previous values |
| FR23 | Must TZ §17,22 | Confidential requests | An ordinary management or technical role does not see the text; access is limited to assigned handlers, and views and exports are audited |
| FR24 | Must TZ §16 | Internal notifications | A participant sees the appointment, a return, approaching deadlines and the final stage; reprocessing an event does not create a duplicate |
| FR25 | Should TZ §6,27 | Second-stage integrations | SSO, HR, email and e-signature are connected after IT grants access; until then test data and external signing are clearly marked |

FR16 and FR17 are demonstrated locally. FR18–25 describe the later server implementation. Completion in the current prototype checks only two final texts, not the full F-08–F-10 package: this is not acceptance of the target MVP.
