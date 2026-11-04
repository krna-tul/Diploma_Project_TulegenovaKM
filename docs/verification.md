# Verification and Evaluation Plan

## Implementation checks

| Scenario | FR | Method and expected result |
| --- | --- | --- |
| Candidate application with 2 years of experience | 01 | Submission is blocked; 3 years pass the experience check, and the School checks the other criteria |
| Request without a mentor | 02 | The application is saved and waits for matching |
| Third pair without an exception | 05 | Appointment is blocked; it is allowed with a justification and two consents |
| Incomplete pair consent | 04–06 | Nomination and appointment are unavailable |
| Editing an approved plan | 07–08 | A new version; the old consents no longer apply |
| Weekend or holiday within the plan deadline | 07 | 10 working days according to the approved calendar; the prototype handles weekends only |
| Plan return | 16 | Forbidden without a comment; the comment is visible to participants and consents are reset |
| Meeting confirmation | 17 | The author does not confirm the record; the other participant confirms once |
| Development Visit | 10 | Preparation, observation and discussion are saved without losing timestamps |
| Viewing another pair's map | NFR01–02 | The server refuses access, and the text does not reach the report |
| Concurrent appointment | 05 NFR07 | The limit holds after two concurrent transactions |
| Completion without outcomes | 11 | Blocked until the self-assessment and feedback are done |

Prototype tests check domain transitions, workload, the calendar and repeated consents. Manual browser checks cover forms, persistence after reload, the showcase, the keyboard and mobile width. Server tests for access, load and recovery run after the backend exists; the prototype does not prove NFR01–04.

## Evaluation with users

The baseline is the same tasks done with Word forms and a manual register. Participants: 5–8 representatives of lecturers or the School, with consent; the order of the variants is balanced to reduce the learning effect. A synthetic identical case is used. Conditions: the same machine, browser and network, the same instructions, no hints before the first attempt.

Measures: time from starting the request to correct registration; share of scenarios completed without help; number of missed required fields; time to find a status; usability rating 1–5; qualitative comments. Preliminary targets: ≥80% completion without help and a median registration time at least 20% below the baseline. These are hypotheses before the pilot, not achieved results. Separately, measure 0 cases of private notes being disclosed in the administrative report.

The small sample size limits generalisation. Results are described with medians, ranges and observations; no causal claims are made about improved teaching quality, staff retention or student performance. NFR04 indicators are measured with a separate reproducible load scenario.

## Update check, 22 October 2026

17 Node.js tests passed, including 30 control examples of the Python → JavaScript port. The browser check covered 11 screens, the recommendations and their features, saving a draft, returning a plan with a mandatory comment, and six key screens at a width of 390 px. The method, results and limits of the check are in the [report](frontend-matching-report.md). Checks of the local interface do not confirm server-side access rights.

## Update check, 4 November 2026

After the illustrated redesign and the card slider: `npm run check` passes (formatting, 0 missing local documentation links, 34 tests). New tests in `src/tests/slider.test.mjs` cover the 760/1100 px breakpoints, clamping of the slider index, parsing of the Details text, and Russian and Kazakh translations for every event card string. In the browser: the landing page, the slider (arrows, counter, disabled last step, hover state, Details dialog with Esc), the events page with filters, the overview, sign-in and mentor catalogue were checked at 1440 px, and the landing page at 375 px in English and Russian without horizontal scrolling.
