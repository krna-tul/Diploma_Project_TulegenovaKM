# Technology Choice

The three main decisions are compared by the requirements for roles, transactions, ease of development by a single author and testability. The choice for the target version is preliminary; the prototype uses HTML/CSS/JavaScript and local storage to demonstrate the scenarios.

| Decision | Alternative | Strength | Cost in this project | Conclusion |
| --- | --- | --- | --- | --- |
| Server | Django | ORM, forms, admin and users in one framework | The API and object permissions need to be designed | Preliminary choice for the monolith |
| Server | FastAPI | Typed validation and OpenAPI | Authorisation, admin and ORM are assembled separately | Suitable when the API is the priority |
| Server | Express | Small core, the same language as the client | Validation, ORM and access control must be chosen separately | Acceptable, with more integration decisions |
| Data | PostgreSQL | Relations, constraints and transactions | A separate service and backups | Choice for concurrent approvals |
| Data | SQLite | Database file, simple local start | Not the target choice for many concurrent writes | For a local bench |
| Data | Browser localStorage | No server installation | No shared database, server permissions or transactions | Demonstration only |
| Client | React | Components and state management | Build step and extra dependencies | Consider after the UX check |
| Client | Vue | Declarative components and gradual adoption | Build step for an extended application | Equal alternative |
| Client | HTML/JS | Runs without a build or dependencies | Manual state management for large forms | Choice for the current prototype |
| Communication | REST/JSON | Clear resources, simple integration tests | API versions and errors are needed | Choice for the target client |
| Communication | Server-rendered HTML forms | Less client state, CSRF in Django | Less flexible interactive plans | Fallback option for the monolith |
| Communication | GraphQL | Flexible queries | An additional access model and complexity | Not justified for the first version |

Architectural decision: a Django + PostgreSQL modular monolith with a REST API, with the client chosen after the prototype check. This reduces the operational complexity of a single diploma project. Microservices and intelligent matching are excluded from the first version. The target server stack is described by the architecture and the comparison of alternatives.

References: [Django overview](https://docs.djangoproject.com/en/5.2/intro/overview/), [FastAPI features](https://fastapi.tiangolo.com/features/), [Express](https://expressjs.com/), [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), [SQLite Python interface](https://docs.python.org/3/library/sqlite3.html), [React](https://react.dev/learn), [Vue](https://vuejs.org/guide/introduction.html). Information checked on 10 October 2026; the comparative assessments are design conclusions, not load test results.
