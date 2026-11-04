# YouTrack Project

[AITU Mentoring Management System — DIP tasks](https://karinatulegenova.youtrack.cloud/issues/DIP) · [Kanban](https://karinatulegenova.youtrack.cloud/agiles/204-1/218-1)

On 15 October 2026, 21 real tasks were created. Assignee: Karina Tulegenova — YouTrack `admin`, GitHub `krna-tul`. On 20 October the "Due Date" field was added and filled in all 21 cards; the dates are also repeated in the descriptions. Priorities P0/P1/P2 correspond to Critical/Major/Normal. Project stages: Backlog → Development → Review → Test → On test environment → Done (the YouTrack board uses the Russian names of these stages).

The diploma is an individual project: the only developer is Karina Tulegenova (`krna-tul` / YouTrack `admin`). The supervisor reviews the work rather than acting as a second developer. New changes are made in separate branches and go through a Pull Request with checks before merging into `main`. DIP IDs are mentioned in commits and PRs; a back link to the specific commit or PR is added to the card. History is not rewritten. OCT/MVP/PILOT/FINAL are plan stages.

The deadline for organising GitHub and YouTrack is **22 October 2026**. The pre-defence is on **24 October**; DIP-11, due 23 October, covers preparing the talk and the set of materials and does not move the tool organisation deadline.

A card is closed after the acceptance check and after a link to the result is added. The meeting with the clients on 8 October and the supervisor's feedback are confirmed; DIP-3 and DIP-10 are moved to Done with links to the results. DIP-4, DIP-5 and DIP-8 are also completed as confirmed by the project author.

| Task | Work | Due |
| --- | --- | --- |
| [DIP-2](https://karinatulegenova.youtrack.cloud/issue/DIP-2) | OCT-01 · Reconcile the specification and requirements | 2026-10-16 |
| [DIP-3](https://karinatulegenova.youtrack.cloud/issue/DIP-3) | OCT-02 · Confirm relevance with the client | 2026-10-18 |
| [DIP-4](https://karinatulegenova.youtrack.cloud/issue/DIP-4) | OCT-03 · Check the full text of scientific sources | 2026-10-19 |
| [DIP-1](https://karinatulegenova.youtrack.cloud/issue/DIP-1) | OCT-04 · Align the bibliography with the presentation | 2026-10-19 |
| [DIP-5](https://karinatulegenova.youtrack.cloud/issue/DIP-5) | OCT-05 · Re-check the comparison of existing systems | 2026-10-19 |
| [DIP-6](https://karinatulegenova.youtrack.cloud/issue/DIP-6) | OCT-06 · Agree the architecture and stack | 2026-10-20 |
| [DIP-7](https://karinatulegenova.youtrack.cloud/issue/DIP-7) | OCT-07 · Check plan return and meetings | 2026-10-17 |
| [DIP-8](https://karinatulegenova.youtrack.cloud/issue/DIP-8) | OCT-08 · Check the prototype in the browser | 2026-10-21 |
| [DIP-9](https://karinatulegenova.youtrack.cloud/issue/DIP-9) | OCT-09 · Create YouTrack and link the work | 2026-10-22 |
| [DIP-10](https://karinatulegenova.youtrack.cloud/issue/DIP-10) | OCT-10 · Get a substantive review from the supervisor | 2026-10-21 |
| [DIP-11](https://karinatulegenova.youtrack.cloud/issue/DIP-11) | OCT-11 · Assemble the verified pre-defence version | 2026-10-23 |
| [DIP-12](https://karinatulegenova.youtrack.cloud/issue/DIP-12) | MVP-01 · Refine roles and the data model | 2026-11-30 |
| [DIP-13](https://karinatulegenova.youtrack.cloud/issue/DIP-13) | MVP-02 · Implement the backend and access control | 2026-12-31 |
| [DIP-14](https://karinatulegenova.youtrack.cloud/issue/DIP-14) | MVP-03 · Implement appointments and plan versions | 2027-01-31 |
| [DIP-15](https://karinatulegenova.youtrack.cloud/issue/DIP-15) | MVP-04 · Implement meetings and Development Visit | 2027-02-15 |
| [DIP-16](https://karinatulegenova.youtrack.cloud/issue/DIP-16) | MVP-05 · Implement outcomes and the archive | 2027-02-28 |
| [DIP-17](https://karinatulegenova.youtrack.cloud/issue/DIP-17) | MVP-06 · Implement the academic office, reference lists and XLSX | 2027-03-15 |
| [DIP-18](https://karinatulegenova.youtrack.cloud/issue/DIP-18) | MVP-07 · Add notifications, audit and RU KZ EN | 2027-03-31 |
| [DIP-19](https://karinatulegenova.youtrack.cloud/issue/DIP-19) | MVP-08 · Agree external integrations | 2027-03-31 |
| [DIP-20](https://karinatulegenova.youtrack.cloud/issue/DIP-20) | PILOT-01 · Run the pilot and evaluation | 2027-04-30 |
| [DIP-21](https://karinatulegenova.youtrack.cloud/issue/DIP-21) | FINAL-01 · Prepare the final handover | 2027-05-31 |

The [CSV](youtrack-import.csv) is a backup copy of the plan, not an invitation to import the already created tasks again. No automatic GitHub integration is connected; direct links are used. [Literature PR No. 1](https://github.com/krna-tul/Diploma_Project_TulegenovaKM/pull/1) corresponds to DIP-1 and is already merged into main.

[Preparation PR No. 2](https://github.com/krna-tul/Diploma_Project_TulegenovaKM/pull/2) is linked to DIP-2, DIP-6, DIP-7 and DIP-9. A back link and a report on the 21 created tasks are added to DIP-9; on 20 October DIP-9 was moved back to "Review": the fixes are in [PR No. 3](https://github.com/krna-tul/Diploma_Project_TulegenovaKM/pull/3), and an independent review and merge are pending. The original project creation deadline of 18 October is kept in the history; the deadline for addressing the comments is 22 October.

## Management check, 20 October 2026

Access: the repository is public at the request of the supervisors, and the materials can be read without an invitation. The GitHub API also confirms the existing access of the user `YersultanTulebayev`. An independent review of PR No. 3 has not been received yet; the earlier supervisor feedback does not replace it.

Real "depends on" links are created in YouTrack:

| Task | Predecessors |
| --- | --- |
| DIP-6 | DIP-2, DIP-5 |
| DIP-8 | DIP-7 |
| DIP-11 | DIP-1, DIP-2, DIP-3, DIP-4, DIP-5, DIP-6, DIP-7, DIP-8, DIP-9, DIP-10 |
| DIP-12 | DIP-2, DIP-6, DIP-10 |
| DIP-13 | DIP-12 |
| DIP-14 | DIP-13 |
| DIP-15 | DIP-14 |
| DIP-16 | DIP-15 |
| DIP-17 | DIP-13 |
| DIP-18 | DIP-14, DIP-15, DIP-16, DIP-17 |
| DIP-19 | DIP-12 |
| DIP-20 | DIP-18, DIP-19 |
| DIP-21 | DIP-20 |

DIP-3, DIP-4, DIP-5, DIP-8 and DIP-10 are supplemented with links to saved commits. This confirms the version of the material but does not by itself prove that a meeting took place, that the full text was read or that an independent review was done. All future tasks DIP-12–DIP-21 remain in "Backlog"; none of them has been closed.
