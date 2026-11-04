# Prototype Verification Results

Date: 10 October 2026. Version: local branch feature/mentorship-predefense. The checks apply to the prototype; the target server requirements are verified after the backend is implemented.

## Automated checks

Command: `node --test src/tests/*.test.mjs`. Result: 14 tests, 14 passed, 0 failed.

Covered: a request without a preferred mentor, the candidate's experience and training, consent from both sides, the mandatory nomination before appointment, the workload limit with an exception, working days and a given holiday, task deadlines, re-consent after a plan change, the final evaluation, meeting dates, the three visit stages and timestamps, unique registration and event capacity, pair replacement with preserved history, and no private text in the summary.

The syntax of app.js, domain.js and serve.mjs is checked with `node --check`. The local HTTP server returns 200 for the home page and static files.

## Browser checks

In Chrome at http://localhost:4173 the following were completed:

- Submitting a professional request without a preferred candidate.
- The director proposing a pair and receiving consent from the mentor and the mentee.
- Nomination and registration of the appointment order.
- Creating a plan goal and task, consent from both sides and approval by the director.
- Viewing the Development Visit preparation fields in the mentor role.
- Reloading the page with the request, pair and approved plan preserved.
- Searching for a skill by the word "rubrics" and showing the related event after choosing a direction.
- A visual review of the home page and skill cards on a desktop screen.

## Interface checks

The project author confirmed completing the mobile screen check, a full keyboard pass and the Development Visit scenario. DIP-8 — Done. The visit domain rules are covered by automated tests.

## Re-check on 15 October 2026

Branch feature/october24-readiness. npm run check: syntax check of app.js/domain.js/serve.mjs, local Markdown links and 17 domain tests — passed. New scenarios: a mandatory reason for returning a plan and resetting consents; meeting confirmation by the other participant, with the author, the director and repeat confirmations rejected; invalid calendar dates. These results are not server-side security tests.

In Chrome at http://localhost:4174 the path was repeated: request without a selected mentor → pair proposal → consents → nomination → order → plan goal and task. Checked: the director returning the plan with a reason, the reason being visible, both consents being reset, re-consent and approval. The mentor recorded a meeting and the mentee confirmed it. After reloading, the active pair and the order were preserved. All data is synthetic.

[PR No. 2](https://github.com/krna-tul/Diploma_Project_TulegenovaKM/pull/2): GitHub Actions passed on cfe1eb6. Later changes to the report are checked by a new run. The supervisor's feedback and the changes made are recorded in the [log](supervisor-feedback.md). Completion of DIP-8 is confirmed by the project author.
