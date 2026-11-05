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

## Visual theme

`styles/theme.css` is imported last by `ui.css` and restyles every screen without changing its markup: the blue palette, glass header and sidebar, pill buttons, rounded fields with icons, cards and the dialog. The older styles still read `--red` and `--blue`; the theme maps `--red` to the primary blue. Illustrations (`assets/illustrations/*.webp`) are exported from Figma with the cooling filter applied; the landing page fades their sky into the page gradient with CSS masks. Glass icons (`assets/icons/*.png`, 112 px) come from the Figma component set "Icons · AITU" and are rendered with `renderIcon(name)` from `components/html.js`. Because `main` is a flex column, landing sections set `width: 100%` and `min-width: 0`; without this the slider track widens the page on phones.

## Animated illustrations

The landing illustrations are layered scenes rendered by `presentation/components/illustrated-scenes.js`: a base image with the free-floating clouds painted out (`*-base.webp`), separate cloud sprites with transparency, and, for the campus, a flag sprite split into 14 vertical strips. The sprite positions are percentages of the original image, so the layers line up at any width; each scene keeps the original aspect ratio and is a size container, so cloud drift is expressed in `cqw`.

In the hero, the large cloud bank to the left of the city is a separate layer (`hero-skyline-bank.webp`) with a soft lower edge that blends into the static white ground; it only ever moves left of its painted position, so the gap at the image edge is never revealed, and it drifts slowly and shifts with scroll independently of the city. Clouds drift back and forth with CSS keyframes, each with its own distance, duration and phase. The flag strips share one wave animation with a phase delay that grows along the flag and an amplitude that grows from the pole to the free edge. `presentation/components/scene-motion.js` listens to scroll and sets `--reveal` on the campus scene (0 when it enters the viewport, 1 once it is a quarter in); the campus zooms from 114 % to 100 % and its clouds slide into place. The hero has no scroll-linked motion. Text appears once instead of following the scroll: the hero copy plays a staggered rise-in on load, and elements marked `data-reveal` (the final call to action) get `is-visible` from an `IntersectionObserver`. Twinkling sparkles in the hero and final sections are pre-rendered PNG images positioned by `createSparkles()` with a fixed seed; they animate only `opacity` and `transform`.

To keep scrolling smooth, gradient masks sit only on the static base images, never on containers with moving layers, no animation uses CSS filters, and the scroll handler writes a variable only when its value changes. The calculation lives in `scene-progress.js` and is covered by `src/tests/slider.test.mjs`. Under `prefers-reduced-motion` all scene transforms and animations are switched off.

The sprites were cut from the Figma exports with a near-white mask, and the sky under them was filled by inpainting. `hero-skyline.webp` and `campus.webp` remain the unmodified exports and the source for regenerating the layers; `campus.webp` is still used on the sign-in screen.

## Card slider

The event cards on the landing and events pages port the "First day" card slider guide to plain JavaScript and CSS:

| Module | Responsibility |
| --- | --- |
| `domain/demo/catalog.js` | Event data. `card` holds the card content, `details` holds the text of the Details dialog |
| `presentation/components/slider-math.js` | Pure functions: visible card count, index clamping and counter, Details text parsing |
| `presentation/components/card-slider.js` | DOM controller: arrows, swipe, keyboard arrows, focus, resize, refresh after filtering |
| `presentation/components/line-icons.js` | Outline SVG icons that use `currentColor`, so the hover state can recolour them |
| `presentation/pages/events.js` | Card template: head (badge, title, pale icon), content, bottom (footer note and Details button) |
| `styles/theme.css` | Hairline frame, dot grid, hover state, badge, buttons, navigation and responsive widths |

JavaScript keeps the slide number in `data-index` and sets `--slide-offset`; CSS moves the track. The breakpoints in `SLIDER_BREAKPOINTS` (760 and 1100 px) must match the `--visible` media rules in `theme.css`, otherwise the slider pages by the wrong step. The index is clamped to `total - visible`, so widening the window pulls the track back. Hidden (filtered) cards are skipped, and `refreshCardSliders()` returns the slider to the first card after filtering. A horizontal touch drag of 40 px or more pages the slider, and focusing a card outside the visible range scrolls it into view.

The blue state is pure CSS and is shared by `:hover` and keyboard focus (`:has(:focus-visible)`): the fill sweeps in from the left and leaves to the right, a light-blue bar grows on the left, the card lifts, and titles, text, badge, icons, list markers and the button are recoloured. Animations are disabled under `prefers-reduced-motion`.

Card content fields are optional; a block is drawn only when its field exists: `preview`, `blocks` (icon, title, text), `emphasizedTitle` with `bullets` and an optional `emphasisIcon`, and footer notes `footerText` (users icon), `footerNotice` (shield icon) and `scheduleText` (clock icon). The `details` text is split by blank lines: lines starting with "•" become a list, short lines ending with ":" become subheadings, the rest are paragraphs. The dialog uses the native `<dialog>` with `showModal()`, so the page behind is inert and Esc closes it; the title is linked with `aria-labelledby`, and a click on the backdrop also closes it.

To add a card, add an event with `card` and `details` to `demoEvents`, then add Russian and Kazakh translations for every new string to `locales/ru.js` and `locales/kk.js`. `src/tests/slider.test.mjs` fails if a card string has no translation.

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
