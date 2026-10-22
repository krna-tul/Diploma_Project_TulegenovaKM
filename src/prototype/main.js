import { html } from './presentation/components/html-template.js';
import { createInitialState } from './domain/demo/initial-state.js';
import { demoMentors } from './domain/demo/catalog.js';
import { getProgramSummaries } from './domain/demo/programs.js';
import { rankMentors, getCourseOwner } from './domain/matching/rank-mentors.js';
import { createJsonStorageRepository } from './infrastructure/json-storage-repository.js';
import { createModelRepository } from './infrastructure/model-repository.js';
import { downloadCsv } from './infrastructure/browser-download.js';
import { createStateStore } from './application/state-store.js';
import { createMentoringService } from './application/mentoring-service.js';
import { t as translate, localize, startLocalization } from './i18n.js';
import { renderHeader, renderSidebar, renderFooter } from './presentation/pages/layout.js';
import { updateMentorCards } from './presentation/pages/mentor-directory.js';
import { updateCourseList } from './presentation/pages/courses.js';
import { updateSkillDescription, updateEventFilters } from './presentation/pages/filters.js';
import { createActionHandlers, createFormHandlers } from './presentation/controllers/actions.js';
import { bindInterfaceEvents } from './presentation/controllers/events.js';
import {
  createPhotoObserver,
  createNotifications,
  openDialog,
  closeDialog,
} from './presentation/browser-effects.js';
import {
  currentRoute,
  navigate,
  renderRoute,
  routeRoles,
  publicRoutes,
  updateDocumentTitle,
} from './presentation/router.js';
import { queryElement } from './presentation/dom.js';
const repository = createJsonStorageRepository({
  storage: window.localStorage,
  key: 'aitu-reference-ui-v1',
  createDefault: createInitialState,
  isValid: (saved) => Array.isArray(saved.plan?.items),
});
const store = createStateStore(repository);
const service = createMentoringService({
  store,
});
const modelRepository = createModelRepository(window.fetch.bind(window));
const session = {
  model: null,
  modelError: '',
  role: 'mentee',
  visitTab: 'preparation',
  ranked: service.getState().request.skill !== undefined,
};
const photoObserver = createPhotoObserver();
const notify = createNotifications(localize);
function getContext() {
  const state = service.getState();
  return {
    ...session,
    state,
    t: translate,
    page: currentRoute,
    getRankedMentors: () =>
      rankMentors({
        mentors: demoMentors,
        model: session.model,
        skillId: state.request.skill,
        assignments: state.assignments,
        sortByRelevance: session.ranked,
      }),
    getCourseOwner: (course) => getCourseOwner(course, state.assignments),
    getProgramSummaries: () => getProgramSummaries(state),
  };
}
const refreshMentors = () => updateMentorCards(getContext());
const refreshCourses = () => updateCourseList(getContext());
const refreshEvents = () => updateEventFilters(getContext());
const refreshSkillDescription = () => updateSkillDescription(getContext());
function render() {
  photoObserver.disconnect();
  const route = currentRoute();
  if (routeRoles[route]) session.role = routeRoles[route];
  const context = getContext();
  const publicPage = publicRoutes.has(route);
  const body = renderRoute(context);
  queryElement('#app').innerHTML =
    renderHeader(context, publicPage) +
    (publicPage
      ? html`
          <main class="public-main">${body}</main>
        `
      : html`
          <div class="layout workspace">
            ${renderSidebar(context)}
            <main>
              <div class="content">${body}</div>
              ${renderFooter(context)}
            </main>
          </div>
        `);
  document.querySelectorAll('.photo').forEach((photo) => photoObserver.observe(photo));
  if (route === 'mentors') refreshMentors();
  if (route === 'courses') refreshCourses();
  if (route === 'request') refreshSkillDescription();
  localize();
  updateDocumentTitle(translate);
}
const dependencies = {
  service,
  session,
  getContext,
  render,
  notify,
  openDialog,
  closeDialog,
  navigate,
  downloadCsv,
  refreshCourses,
};
const actions = createActionHandlers(dependencies);
const forms = createFormHandlers(dependencies);
bindInterfaceEvents({
  ...dependencies,
  actions,
  forms,
  refreshMentors,
  refreshEvents,
  refreshSkillDescription,
});
queryElement('#close-dialog').onclick = closeDialog;
window.addEventListener('hashchange', () => {
  render();
  window.scrollTo(0, 0);
});
document.addEventListener('languagechange', () => updateDocumentTitle(translate));
render();
startLocalization();
modelRepository
  .load()
  .then((model) => {
    session.model = model;
    if (['mentors', 'courses'].includes(currentRoute())) render();
    if (currentRoute() === 'request') {
      const form = queryElement('[data-form=request]');
      const draft = form ? new FormData(form) : null;
      render();
      if (draft)
        for (const [name, value] of draft) {
          const input = queryElement(`[name="${name}"]`);
          if (input) input.value = value;
        }
      refreshSkillDescription();
    }
  })
  .catch((error) => {
    console.error(error);
    session.modelError = 'The matching model could not be loaded. Reload to try again.';
    if (['request', 'courses'].includes(currentRoute())) render();
  });
