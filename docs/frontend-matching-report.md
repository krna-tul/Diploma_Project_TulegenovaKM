# Frontend Implementation and Logistic Regression-Based Matching

AITU Faculty Mentoring · Progress report · 22 October 2026

## Project objective

I am developing a web platform to support faculty mentoring at Astana IT University. The platform brings together professional development requests, mentor discovery, development plans, lesson observations, feedback, and programme monitoring.

At this stage, I focused on two connected tasks: implementing the frontend according to the eleven interface designs and integrating the logistic regression matching example from `aitu-mentoring`. The resulting prototype allows me to demonstrate both the intended user experience and the recommendation process in a browser.

## Data selection

I was not provided with confidential university data for model training or demonstration. I therefore used the publicly available **UniSkill dataset** as an alternative source for the experimental matching component.

UniSkill links university course content to professional skills from the European Skills, Competences, Qualifications and Occupations (ESCO) taxonomy. Its records include course titles, course sentences, skill labels, descriptions, and relevance annotations. The dataset is published on Hugging Face under the Apache-2.0 licence.

Using this dataset allows me to demonstrate a reproducible machine learning workflow without accessing confidential information about university staff. It also provides labelled examples for evaluating course–skill relevance.

The source data and interface examples have different purposes. UniSkill supplies the annotated course–skill pairs used in the experiment. The mentor profiles, programme records, and events shown in the interface are illustrative examples. Their purpose is to demonstrate how the matching component could be incorporated into the mentoring platform.

## Data preparation and experimental setup

The existing experiment contains 1,098 manually annotated source records. After removing two duplicates, 1,096 records remain. A further 3,212 synthetic records from the original training file were excluded. Missing descriptions in six records were replaced with empty strings.

The annotated records were divided into three subsets:

| Subset | Records |
| --- | ---: |
| Training | 649 |
| Validation | 231 |
| Test | 216 |

The experiment uses a grouped split with a random seed of 42. Records sharing a course title or course sentence are placed in the same group to prevent those texts from appearing across training, validation, and test subsets. This is a new split of the combined annotated records, rather than the original split distributed with the dataset.

The TF-IDF vectorizer is fitted only on the training subset. The validation subset is used to select the classification threshold, while the test subset is reserved for evaluating the final classifier.

For this frontend update, I integrated the existing trained model and its saved experimental results. I did not retrain the model during the interface integration.

## Matching method

The matching component uses **logistic regression** to estimate whether a course is relevant to a selected skill.

Course titles, course content, and skill descriptions are represented using TF-IDF. Five numerical features describe each course–skill pair:

1. Cosine similarity between course content and the skill representation.
2. Cosine similarity between the course title and the skill representation.
3. The minimum of these two cosine similarities.
4. Jaccard similarity between words in the course content and the skill label.
5. Jaccard similarity between words in the course title and the skill label.

The TF-IDF skill representation includes both the skill label and its description. The five features are standardised using StandardScaler before being passed to logistic regression.

The model uses `C = 1`, balanced class weights, and a maximum of 1,000 training iterations. Its decision threshold is **0.55**, selected using validation Macro-F1. A score at or above this threshold is treated as a positive course–skill match.

For browser execution, the fitted coefficients, intercept, scaling parameters, threshold, and precomputed TF-IDF vectors are exported to JSON. JavaScript applies the same feature calculations and logistic regression equation. This makes the recommendation example runnable without a separate Python service.

## Integration into mentor discovery

I connected the model to the **My request** and **Mentor catalogue** screens.

The user selects a skill from the UniSkill catalogue and requests recommendations. The application calculates relevance scores for courses associated with the demonstration mentor profiles. Each mentor is then ranked using the highest-scoring course linked to that profile.

The interface supports the following steps:

1. Search for and select a development skill.
2. Generate recommendations and inspect the ranked mentor cards.
3. Open **View course evidence** to see the supporting course, five feature values, model score, and decision threshold.
4. Choose a preferred mentor and save the request.
5. Change the demonstration course assignments and recalculate recommendations.

The initial course assignments are distributed across three example profiles using the course index modulo three. These links make the demonstration interactive; they do not represent verified teaching records. The user’s written goals are saved as context, while the model uses the selected catalogue skill as its input.

This integration demonstrates a possible connection between course expertise and mentor discovery. Selecting a preferred mentor records a preference; it does not confirm an appointment.

## Experimental results

The saved experiment reports the following results on 216 held-out course–skill pairs:

| Metric | Result |
| --- | ---: |
| Accuracy | 72.69% |
| Precision — positive class | 70.49% |
| Recall — positive class | 51.19% |
| F1 — positive class | 0.5931 |
| Macro-F1 | 0.6938 |
| True negatives | 114 |
| False positives | 18 |
| False negatives | 41 |
| True positives | 43 |

The classifier correctly identifies 157 of 216 test pairs. Precision is higher than recall, meaning that the model misses a substantial proportion of relevant pairs. Because its features measure lexical overlap, it can also assign a high score to texts that share words without expressing a sufficiently strong semantic relationship.

These results evaluate **course–skill relevance on UniSkill**. They do not establish the accuracy of matching real mentors and mentees at AITU. Evaluating that use case will require appropriate university data and a separate assessment of recommendation quality.

## Frontend implementation

I implemented the eleven supplied interface designs:

- Landing page and sign-in screen.
- Mentee overview and mentor catalogue.
- Mentee request and mentor application forms.
- Individual development plan and Development Visit.
- School review and programme administration overview.
- Events catalogue.

The frontend follows the visual direction of the designs: white backgrounds, navy text, red action buttons, light-blue panels, serif headings, AITU branding, and workspace navigation. Responsive layouts adapt the screens to smaller displays.

The interactive features include form drafts, mentor and event filters, preferred mentor selection, development plan activities, version tracking, submission for School review, and return for revision with a required comment. The Development Visit screen supports preparation, observation, and reflection. An administrative CSV export includes programme summaries without private visit notes.

The new interface stores demonstration data in the browser. The sign-in screen opens a demo workspace without storing or sending a password. The interface supports English, Kazakh, and Russian. The EN / KZ / RU switcher updates navigation, headings, labels, statuses, and messages without discarding unsaved form input. The selected language persists in the browser. User-entered content and original UniSkill course and skill texts remain in their source language.

I also retained the original workflow demonstration, which covers appointments, mutual consent, workload limits, and other domain rules. It remains available at `/workflow.html`. The new interface and this original workflow currently use separate local states; connecting them through a shared backend is part of the next development stage.

## Verification

The updated project passes **17 automated tests**: fourteen existing domain tests and three matching checks.

The matching verification compares JavaScript calculations against thirty saved Python examples. All five features, predicted probabilities, and threshold decisions agree within a tolerance of `1e-12`. This confirms consistency of the exported inference implementation on those examples.

Browser checks covered all eleven main screens at a desktop width of 1440 pixels. The checks included generating recommendations, inspecting course evidence, choosing a preferred mentor, and restoring saved drafts after reloading the page.

Additional checks confirmed that:

- A plan cannot be returned for revision without a comment.
- Mentor form values and course assignments persist after reloading.
- Recommendation results remain available after reloading.
- The observation and reflection stages save successfully.
- The downloaded administrative CSV excludes private observation text.
- The demo sign-in does not store the entered password.
- Six key screens display without horizontal page overflow at a width of 390 pixels.

No unhandled JavaScript errors or HTTP responses with status codes of 400 or higher were observed during these browser checks. The source CSV checksum also matches the supplied provenance manifest.

## Current scope and next steps

The current result is a functioning local prototype that combines the proposed interface with a real logistic regression inference example using open data.

The main remaining tasks are to connect the frontend to a shared backend, implement institutional authentication and access controls, and unify the interface with the complete mentoring workflow. Demonstration profiles and course assignments will need to be replaced with verified information when suitable data becomes available.

For the recommendation component, I will need to evaluate whether course-based evidence is useful for mentor selection, define an appropriate measure of recommendation quality, and assess the approach with university stakeholders. The current UniSkill results provide an experimental baseline for course–skill matching, while evaluation in the AITU mentoring context remains future work.

## References

Musazade, N. (2026). *UniSkill_dataset* [Data set]. Hugging Face. https://huggingface.co/datasets/nurlanm/UniSkill_dataset

Musazade, N., Mezei, J., & Zhang, M. (2026). UniSkill: A dataset for matching university curricula to professional competencies. In *Proceedings of the Fifteenth Language Resources and Evaluation Conference* (pp. 456–469). ELRA Language Resource Association. https://doi.org/10.63317/2n39qzvk2eqe

The implementation and experimental figures described in this report are based on the `aitu-mentoring` training notebook, exported model, source manifest, saved test results, and Python inference fixtures. These materials are included in the project for reproducibility.
