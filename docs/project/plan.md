# Project Plan and Risks

Developer: Karina Tulegenova — analysis, architecture, frontend and backend, testing and documentation. Supervisor: Yersultan Tulebayev — review of scope, architecture and the evaluation plan; individual meetings are arranged separately. AITU representatives confirm the business process, forms and IT access. The pilot participants are chosen when the pilot is organised.

The diploma is an individual project. Changes are made in separate branches, checked in a Pull Request and merged into main after review. The [YouTrack DIP project](https://karinatulegenova.youtrack.cloud/issues/DIP) holds the project tasks. The [backlog](backlog.json) and the [import guide](youtrack.md) contain 21 work items; the tasks are linked to repository materials. Historical deadlines and commits are not changed retroactively.

## Stages, September 2026 – May 2027

| Period | Result | Dependency and status |
| --- | --- | --- |
| September – October 2026 | Requirements, literature, comparisons, early prototype and the first pre-defence on 24 October | Preparing the first pre-defence materials |
| November 2026 | Agreed architecture, roles and data model | Client confirmation of requirements and templates |
| December 2026 – February 2027 | Backend, permissions, appointments, plans, meetings, visits, final forms and archive | Approved contracts and database schema |
| March 2027 | Integration testing, academic office, import, localisation and audit | Core modules working; external integrations depend on IT |
| April 2027 | Pilot, comparison with the manual process and analysis of results | Consenting users and a test environment |
| May 2027 | Fixes, diploma, guides and defence | Pilot results and the supervisor's review |

## Milestones

**22 October 2026:** GitHub and YouTrack organised, due dates filled, task dependencies and links to results.
**23 October:** final preparation of the materials and the talk (DIP-11).
**24 October:** first pre-defence.

Read access is public at the request of the supervisors; the existing `YersultanTulebayev` access is confirmed through the GitHub API. An independent review of PR No. 3 is still pending; a self-review does not replace it.

## Priorities before 24 October

OCT-02/03/04/05: confirmation of relevance, full texts, a single bibliography and evidence-based comparisons by 19 October. OCT-06/10: architecture review and comments by 21 October. OCT-08/11: demonstration, checks, PR and a fixed submission version by 23 October. OCT-09: a real YouTrack project and links from tasks to results. Statuses and acceptance criteria are kept in the backlog; real dependencies are set as YouTrack links and listed in the [task map](youtrack.md). DIP-4, DIP-5 and DIP-8 are completed as confirmed by the project author.

## Risks

| Risk | Impact | Mitigation | Owner |
| --- | --- | --- | --- |
| No approved appendices | Wrong forms | Obtain the templates and check the fields | Karina / School |
| Users unavailable | No confirmation of relevance | Schedule discussions early; do not replace them with assumptions | Karina |
| Observation leak | Loss of trust | Separate private notes from reports; object permissions | Karina |
| Scope too broad | Implementation delay | Modular monolith; integrations after the MVP | Karina |
| Unknown calendar | Wrong plan deadline | University calendar before production | School |
| Localisation and SSO not verified | Rollout errors | Agree contracts before the backend | Karina / IT |

## Feedback and review

The [feedback log](supervisor-feedback.md) records the supervisor's feedback and the changes made. The three recommendations are reflected in the presentation; DIP-10 is done. The [submission](submission.md) document contains the demonstration order and the stage materials.
