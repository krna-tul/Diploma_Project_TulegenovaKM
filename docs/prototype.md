# Using the Prototype

The prototype demonstrates the scenarios in a single browser. Records are saved in localStorage; a shared server, user accounts and permission checks are not implemented yet. Profiles and programmes are illustrative. The new frontend uses open course–skill pairs from UniSkill for recommendations; confidential university data was not provided.

## Running

Node.js 22 or later is required. From the repository root run `npm start`, then open http://localhost:4173. No dependency installation or build is needed. Alternative: `node src/scripts/serve.mjs`. The default port is 4173; for another port use `PORT=4174 npm start`. The server is available on the local machine only.

## New screens and matching (22 October 2026)

The home page opens the frontend built from the 11 PNG mockups. To check the recommendations:

1. Click Create mentee form.
2. Expand Find recommendations by skill, then search for and select a UniSkill skill.
3. Click Find recommended mentors.
4. Open View course evidence: features, course, probability and the 0.55 threshold.
5. Use View mentor profile to choose a preferred mentor and save the request.
6. If needed, change the assignments through Manage demo course assignments.

To see the School and academic office reviews, open Demo workspaces at the bottom of the page or switch the role through the avatar. Forms, the plan and the visit are saved locally. The CSV export contains an administrative summary and does not include private notes.

[Report on the data, model, results and limitations](frontend-matching-report.md).

## Illustrated design (November 2026)

The interface follows the Figma frame "Landing · Illustrated": a blue palette, two illustrations whose sky dissolves into the page gradient, a glass header and sidebar, and the glass icon set.

- Styles live in `src/prototype/styles/theme.css`, loaded last by `ui.css`, so every screen is restyled without changing its markup.
- Illustrations are in `assets/illustrations/` (exported from Figma with the cooling filter applied); icons are in `assets/icons/` (34 PNG files, 112 px, exported from the Figma component set "Icons · AITU").
- The event cards on the landing page and the events page are a card slider ported from the "First day" card slider guide; see [Code Architecture](code-architecture.md#card-slider).

To check the slider: on the landing page use the ← and → buttons (the counter shows the first visible card, for example "1 / 4"), hover over a card to see the blue state, and press Details to open the full description. The dialog closes with ×, a click on the backdrop or Esc. On a phone the slider shows one card and can be swiped.

## Original full scenario

The scenario below is available at `/workflow.html`. It keeps the original domain model and a separate localStorage state. The new forms and the old scenario are not synchronised.

1. On the home page, browse the skills, search and choose a direction. The showcase displays related events; the selected skill is carried over into the request.
2. Submit a mentor profile with the top button. In the director role open "Applications" and check the criteria; in the academic department role confirm the training. The profile appears in the catalogue.
3. Submit a request as the mentee. A preferred candidate is optional.
4. In the director role, choose a mentor in "Applications" and propose a pair.
5. In "Pairs and plans", switch to the mentor and the mentee and confirm each consent. The director checks for a conflict of interest and nominates the pair. If the mentor would exceed two pairs, an agreed exception is recorded.
6. The registrar enters the vice-rector's order number, the appointment date and the end of the period.
7. Open the plan. The participants set the goal, format and frequency and add a task with support, a deadline, the expected result and the way progress is recorded. Both sides consent to the version, and the director approves it or returns it with a mandatory comment that resets the consents.
8. The participants record meetings; the other participant confirms the record. The author cannot confirm their own meeting. The participants record task completion and the start, midpoint and final evaluations. Editing the plan content requires new consents and approval; approved versions are available in the history.
9. For a Development Visit, fill in the preparation; the mentor adds facts with timestamps and criteria from the observation map. The joint discussion includes self-reflection, strengths, a question, a recommendation, a change to the next class and a way to measure it.
10. After the final self-assessment and feedback, the director completes the programme. If needed, a participant submits a request for replacement or early completion, and the School records the decision.

Event registration is in the event card. A repeated registration with the same demo name is blocked; the number of places is checked.

## Coverage and limitations

| Function | Prototype implementation |
| --- | --- |
| Two forms and the skills catalogue | Submission, validation, filters, navigation from the card |
| Candidate review | Experience check, School decision and training; return with a reason |
| Matching | In the old scenario the School chooses; in the new frontend, logistic regression recommendations on UniSkill |
| Consent and appointment | Two consents, nomination, limit, conflict of interest, order details |
| Plan | Goals, tasks, deadlines, support, results, consents and version approval |
| Meetings and visits | Saving results, confirmation by the other participant and the three stages of the map |
| Evaluation and requests | Start, midpoint and final; replacement decision; final completion |
| Analytics | Process counters without observation texts |
| Server-side access | Not implemented; the role is switched for demonstration |
| Calendar | Monday–Friday; holidays and the AITU calendar are not connected |
| Localisation | English, Russian and Kazakh in the new frontend; Russian in the original scenario |
| Attachments, notifications, export | Next stage |
| Events | Illustrative catalogue and registration; the organiser's editor is the next stage |

An approved individual plan of a participant does not replace the official Individual Work Plan of a lecturer. Entering an order number does not create a legally binding document.

## Storage

The localhost and 127.0.0.1 addresses have separate browser storage; use the same address and port to continue. To return to a clean data set, delete the data of this local site only in the browser settings. User records are not saved in Git.

## Figma design

[PNG screens of the interface](Figma/) are in the Figma folder. The [README gallery](../README.md#application-prototype) contains six exported screens of the target interface. The local prototype demonstrates user interactions.
