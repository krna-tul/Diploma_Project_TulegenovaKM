<div align="center">

# AITU Faculty Mentoring

**A platform for faculty professional development**

[Figma Prototype](https://www.figma.com/design/sy5nfmGGIJu1W4KQk1Tm6d/?node-id=8-2) · [YouTrack](https://karinatulegenova.youtrack.cloud/issues/DIP) · [Documentation](#documentation) · [Getting Started](#getting-started)

</div>

![Mentee dashboard — Figma design](docs/assets/prototype/03-overview.png)

A diploma project developing a web platform for managing faculty mentoring in higher education. The platform connects professional support requests, mentor selection, pair approval, individual development plans, meetings, and outcome evaluation.

**Author:** Karina Maratovna Tulegenova · Software Engineering · SE-2419  
**Supervisor:** Yersultan Bakhytovich Tulebayev  
**Responsibilities:** requirements analysis, architecture, frontend and backend development, and system verification.

## Problem and Users

AITU's mentoring process involves several related documents and approval stages. The project brings these activities into a connected workflow so participants can follow their progress.

The client meeting on **8 October 2026** with representatives of the Educational and Methodological Office addressed roles and confidentiality, support requests and assignments, development plans and feedback, and monitoring and reporting. The client's technical specification defines the project requirements. [Meeting findings and requirements](docs/research/user-research.md).

The platform serves mentors, mentees, School representatives and directors, the academic department, order registrars, event organisers, and the Educational and Methodological Office. Detailed observations and reflections remain confidential within the mentoring pair.

## Project Scope

- Separate mentor candidate applications and mentee support requests.
- A searchable skills catalogue and professional development events.
- School review of candidates and confirmation of introductory training.
- Mentor selection, consent from both participants, director endorsement, and registration of the Vice-Rector's order.
- Shared individual development plans with revisions, tasks, deadlines, support, and expected outcomes.
- Meetings, Development Visits, and interim and final evaluations.
- Replacement requests and programme-level summaries.

The expected outcome is a multi-user platform with role-based access and an evaluation of usability against the existing document-based process.

## Application Prototype

Explore the interface through **AITU Faculty Mentoring — Prototype**, on the **Refined · AITU Editorial** page in Figma.

| Home | Mentor Catalogue |
| --- | --- |
| [![Home](docs/assets/prototype/01-landing.png)](docs/assets/prototype/01-landing.png) | [![Mentor Catalogue](docs/assets/prototype/04-mentors.png)](docs/assets/prototype/04-mentors.png) |
| Discover the programme, skills, and support opportunities | Find a mentor and explore their professional profile |

| Individual Development Plan | Development Visit |
| --- | --- |
| [![Individual Development Plan](docs/assets/prototype/06-plan.png)](docs/assets/prototype/06-plan.png) | [![Development Visit](docs/assets/prototype/07-visit.png)](docs/assets/prototype/07-visit.png) |
| Development goals, activities, deadlines, and progress | Visit preparation, observations, and feedback |

<details>
<summary><strong>Educational and Methodological Office Dashboard</strong></summary>

![Programme overview for the Educational and Methodological Office](docs/assets/prototype/09-umo.png)

Programme activity and document completion overview, with confidentiality requirements for private mentoring records.

</details>

[Explore All Figma Screens](https://www.figma.com/design/sy5nfmGGIJu1W4KQk1Tm6d/?node-id=4-2) · [Local Prototype Walkthrough](docs/prototype.md)

## Client Input and Supervisor Feedback

| Source | Contribution | Details |
| --- | --- | --- |
| Client meeting · 8 October 2026 | Four groups of needs linked to the client's requirements | [Evidence of Relevance](docs/research/user-research.md) |
| Supervisor feedback | Full publication titles, a consolidated literature review, project management and risks, and a feedback and improvements slide | [Supervisor Feedback and Improvements](docs/project/supervisor-feedback.md) |

## Technology

The target architecture is a **Django modular monolith**, **PostgreSQL**, and **REST/JSON**, supporting the mentoring workflow and role-based access.

The local interactive prototype uses **HTML, CSS, and JavaScript**, with browser localStorage for demonstration data. **Node.js** provides the local HTTP server and automated domain tests. See the [technology comparison](docs/research/technology-comparison.md) for the alternatives and selection rationale.

## Getting Started

Use **Node.js 22 or later**. From the repository root, start the local prototype:

```sh
npm start
```

Open http://localhost:4173. You can also run `node scripts/serve.mjs` directly. To use another port:

```sh
PORT=4174 npm start
```

A configuration example is provided in `config/.env.example`. Supply environment variables through your shell. Stop the server with **Ctrl+C**.

Run the checks:

```sh
npm run check
```

This checks JavaScript syntax, local documentation links, and domain scenarios. To run the domain tests separately:

```sh
node --test tests/*.test.mjs
```

Follow the [prototype walkthrough](docs/prototype.md) for the demonstration scenarios.

## Repository Structure

```text
src/prototype/       User interface and workflow model
scripts/             Local server and documentation checks
config/              Configuration example
tests/               Automated domain tests
docs/                Requirements and project documentation
diagrams/source/     Editable Mermaid and PlantUML diagrams
diagrams/exports/    Readable SVG diagrams
```

## Documentation

| Topic | Resource |
| --- | --- |
| Project proposal and scope | [Project Proposal](docs/proposal.md) |
| Client specification coverage | [Requirements Traceability](docs/tz-traceability.md) |
| Source materials | [Source Register](docs/source-register.md) |
| Requirements and acceptance criteria | [Requirements Specification](docs/requirements.md) |
| Literature | [Critical Literature Review](docs/research/literature-review.md) |
| Existing systems | [System Comparison](docs/research/system-comparison.md) |
| Technology decisions | [Technology Comparison](docs/research/technology-comparison.md) |
| User research | [Client Meeting Findings](docs/research/user-research.md) |
| Architecture | [Components, Data, and API](docs/architecture/architecture.md) |
| Diagrams | [SVG Exports](diagrams/exports/) and [Editable Sources](diagrams/source/) |
| User experience | [Interactive Prototype](src/prototype/index.html) and [Walkthrough](docs/prototype.md) |
| Verification and evaluation | [Evaluation Plan](docs/verification.md) and [Verification Results](docs/project/validation.md) |
| Project management and risks | [Project Plan](docs/project/plan.md) and [YouTrack Tasks](docs/project/youtrack.md) |
| Supervisor feedback | [Feedback and Improvements](docs/project/supervisor-feedback.md) |
| First pre-defence | [24 October Checklist](docs/project/readiness.md) |

[Track Project Tasks in YouTrack](https://karinatulegenova.youtrack.cloud/issues/DIP)
