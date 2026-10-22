# Code Architecture

The local application now separates domain rules, application use cases, browser adapters, and presentation. This refactoring preserves the existing screens, storage keys, model export, and the separate full-workflow demonstration.

## Directory map

```text
src/prototype/
  main.js                         Application composition root
  index.html                      Main application document
  domain/
    demo/                         Demonstration state, plans, visits, and summaries
    matching/                     Logistic regression and mentor ranking
    workflow/                     Complete appointment and consent workflow
      commands/                   Named operations grouped by domain area
  application/
    mentoring-service.js          Use cases and audit events
    state-store.js                Transactional state updates
    export-program-report.js      Explicit administrative CSV projection
    localization/translator.js    Translation without browser dependencies
  infrastructure/
    json-storage-repository.js    Browser-state persistence adapter
    model-repository.js           Model loading and validation
    language-preferences.js       Language preference persistence
    browser-download.js           CSV download adapter
  presentation/
    router.js                     Route and workspace configuration
    controllers/                  Named action and form handlers
    components/                   Reusable HTML and dialog templates
    pages/                        Individual screens and list rendering
    legacy/                       Original full-workflow interface
    localization.js               DOM translation and language controls
    browser-effects.js            Notifications, dialogs, photo display
  locales/                        Russian and Kazakh dictionaries
  styles/                         Base, screen, localisation, workflow styles
  matching/model.json             Existing trained model export
  assets/                         Existing visual assets
  app.js                          Full-workflow entry point
  domain.js                       Compatibility exports for workflow consumers
  i18n.js                         Public localisation exports
src/scripts/
  serve.mjs                       Local-server startup
  lib/static-server.mjs           Static HTTP request handling
src/research/matching/
  train_export.py                 Notebook execution and model export
  data/                           Original experiment and source records
```

## Dependency rules

The domain layer contains rules and calculations. It does not import application services, browser adapters, or presentation code.

The application layer coordinates domain operations through injected dependencies. It does not access the DOM, localStorage, or fetch directly.

Infrastructure implements persistence, loading, and download operations. Presentation renders the interface, reads form values, and invokes application services. `main.js` constructs these dependencies and connects them.

Architecture tests enforce the inward dependency direction and verify that relative JavaScript imports resolve.

## Patterns used

| Pattern | Implementation | Purpose |
| --- | --- | --- |
| Repository / Adapter | JSON storage and model repositories | Keep browser storage and HTTP loading outside use cases |
| Dependency Injection | Composition root, injected store and clock | Allow tests to substitute storage, model loading, and time |
| Application Service | Mentoring service | Provide named operations instead of mutating state inside event listeners |
| Command registry | UI action/form registries and workflow commands | Route actions to focused handlers |
| Transactional state update | State store | Clone state, validate and modify the draft, persist it, then publish it |
| Pure functions | Model inference, ranking, report projection | Run calculations and verification without a browser |

These are lightweight JavaScript modules and functions. No framework or generic base-class hierarchy is needed for the current local prototype.

## State and persistence

The primary storage key remains `aitu-reference-ui-v1`. Language selection still uses `aitu-language`, and the original workflow keeps its existing key. Previously saved drafts therefore remain readable.

Application services update a copy of the current state. If validation or persistence fails, the live state remains unchanged. Returned snapshots are independent copies, so a view cannot accidentally modify stored state.

The simplified interface and the original full workflow still have separate state models. This refactoring does not claim to unify their business processes or implement production authentication.

## Matching

`domain/matching/logistic-regression.js` is the single inference implementation used by both the browser and tests. The duplicated browser/CommonJS files and global `Matching` object have been removed.

`rank-mentors.js` owns the course-assignment and strongest-course ranking policy. Model fetching and schema validation belong to the model repository. The original JSON parameters and saved Python fixtures are unchanged.

## Localisation

Russian and Kazakh translations are stored separately from translation behaviour. A pure translator handles phrases and dynamic messages. The DOM adapter applies translations while preserving entered form values and original UniSkill text. Language storage is handled by a separate adapter.

## Reading and extending the code

To add a screen, create a page module and register it in the router. Reuse the existing HTML helpers and keep domain mutations out of its template.

To add an action, add a named application operation, test its rules, and connect it through an action or form handler. If it needs persistence or an external resource, inject an adapter through the composition root.

To change a matching calculation, edit the domain module and run the Python/JavaScript parity tests. Do not alter the trained model parameters as part of an interface refactor.

The training export script is organised into notebook execution, browser-model construction, fixture construction, and file output. The original scientific notebook and datasets remain unchanged. Retraining was not performed as part of this refactor.

## Verification and formatting

```sh
npm install
npm run check
npm run format
```

`npm run check` checks formatting and runs the automated tests. `npm run format` applies the shared formatting rules. Prettier is a development-only dependency; the application still runs with `npm start` without a frontend build step.

The automated suite covers domain workflows, inference parity, ranking assignments, draft compatibility, failed persistence, plan versions and review, visit validation, report privacy, localisation, and architectural boundaries. Browser checks cover the main screens, language switching, draft persistence, model evidence, and mobile widths.

Code comments have been removed as requested. The architectural explanation is maintained in this document.
