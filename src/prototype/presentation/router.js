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
import {
  renderMeetingsPage,
  renderInterimPage,
  renderChangesPage,
  renderConfidentialPage,
} from './pages/meetings.js';
import { renderObservationFormPage } from './pages/observation-form.js';
import { renderFinalPage } from './pages/final-stage.js';
import { renderAppointmentPage, renderWorkloadPage } from './pages/appointment.js';
import {
  renderReferencesPage,
  renderImportPage,
  renderArchivePage,
  renderAnalyticsPage,
  renderAuditPage,
} from './pages/umo-tools.js';
import {
  renderStatusPage,
  renderNotificationsPage,
  renderProfilePage,
  renderSupportPage,
  renderTechPage,
  renderTechLogsPage,
} from './pages/account.js';
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
  status: renderStatusPage,
  meetings: renderMeetingsPage,
  observation: renderObservationFormPage,
  interim: renderInterimPage,
  changes: renderChangesPage,
  confidential: renderConfidentialPage,
  final: renderFinalPage,
  appointment: renderAppointmentPage,
  workload: renderWorkloadPage,
  references: renderReferencesPage,
  import: renderImportPage,
  archive: renderArchivePage,
  analytics: renderAnalyticsPage,
  audit: renderAuditPage,
  notifications: renderNotificationsPage,
  profile: renderProfilePage,
  support: renderSupportPage,
  tech: renderTechPage,
  'tech-logs': renderTechLogsPage,
};
export const publicRoutes = new Set(['landing', 'signin', 'events', 'about']);
export const routeRoles = {
  'mentor-form': 'mentor',
  review: 'school',
  requests: 'school',
  umo: 'umo',
  settings: 'umo',
  request: 'mentee',
  appointment: 'school',
  observation: 'mentor',
  references: 'umo',
  import: 'umo',
  archive: 'umo',
  analytics: 'umo',
  audit: 'umo',
  tech: 'tech',
  'tech-logs': 'tech',
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
      status: 'Program status',
      meetings: 'Meeting journal',
      observation: 'Lesson observation form',
      interim: 'Interim feedback',
      changes: 'Program changes',
      confidential: 'Confidential request',
      final: 'Final review',
      appointment: 'Mentor appointment',
      workload: 'Mentor workload',
      references: 'Reference lists',
      import: 'Import staff list',
      archive: 'Program archive',
      analytics: 'Program analytics',
      audit: 'Audit log',
      support: 'Technical support',
      tech: 'System status',
      'tech-logs': 'Technical logs',
    }[route] || route[0].toUpperCase() + route.slice(1);
  document.title = translate(title) + ' · AITU';
}
