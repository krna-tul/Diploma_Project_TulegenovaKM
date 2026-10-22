import { renderLandingPage } from './pages/landing.js';
import { renderEventsPage } from './pages/events.js';
import { renderSignInPage } from './pages/sign-in.js';
import { renderOverviewPage } from './pages/overview.js';
import { renderRequestPage } from './pages/request.js';
import { renderMentorFormPage } from './pages/mentor-form.js';
import { renderMentorDirectoryPage } from './pages/mentor-directory.js';
import { renderPlanPage } from './pages/plan.js';
import { renderVisitPage } from './pages/visit.js';
import { renderReviewPage } from './pages/review.js';
import { renderAdministrationPage } from './pages/administration.js';
import { renderCoursesPage } from './pages/courses.js';
import { renderModelPage } from './pages/model.js';
import { renderSupplementaryPage } from './pages/supplementary.js';
export const routes = {
  landing: renderLandingPage,
  events: renderEventsPage,
  signin: renderSignInPage,
  overview: renderOverviewPage,
  request: renderRequestPage,
  'mentor-form': renderMentorFormPage,
  mentors: renderMentorDirectoryPage,
  plan: renderPlanPage,
  visit: renderVisitPage,
  review: renderReviewPage,
  umo: renderAdministrationPage,
  courses: renderCoursesPage,
  model: renderModelPage,
};
export const publicRoutes = new Set(['landing', 'signin', 'events', 'about']);
export const routeRoles = {
  'mentor-form': 'mentor',
  review: 'school',
  requests: 'school',
  umo: 'umo',
  settings: 'umo',
  request: 'mentee',
};
export function currentRoute() {
  return location.hash.slice(1) || 'landing';
}
export function navigate(route) {
  location.hash = route;
}
export function renderRoute(context) {
  return (
    routes[currentRoute()] || ((context) => renderSupplementaryPage(context, currentRoute()))
  )(context);
}
export function updateDocumentTitle(translate) {
  const route = currentRoute();
  const title =
    {
      landing: 'Faculty Mentoring',
      request: 'Mentee form',
      'mentor-form': 'Mentor form',
      mentors: 'Mentor catalogue',
      umo: 'UMO overview',
      review: 'School review',
      plan: 'Development plan',
      visit: 'Development Visit',
    }[route] || route[0].toUpperCase() + route.slice(1);
  document.title = translate(title) + ' · AITU';
}
