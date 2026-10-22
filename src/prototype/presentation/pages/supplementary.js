import { html } from '../components/html-template.js';
import {
  renderHeading,
  renderLink,
  renderTextarea,
  arrowIcon,
  renderButton,
  escapeHtml,
} from '../components/html.js';
import { renderProgramTable } from './administration.js';
import { demoMentors } from '../../domain/demo/catalog.js';
export function renderSupplementaryPage(viewContext, routeName) {
  const { state } = viewContext;
  if (routeName === 'demo')
    return html`
      ${renderHeading('INTERACTIVE PROTOTYPE', 'Explore the workspaces', 'Choose a demo role. Data is stored only in this browser.')}
      <div class="grid3">
        ${[
          ['Mentee', 'overview'],
          ['Mentor', 'mentor-form'],
          ['School review', 'review'],
          ['Program administrator', 'umo'],
          ['Matching model', 'model'],
        ]
          .map(([label, routeNameValue]) => renderLink(label, routeNameValue, true))
          .join('')}
      </div>
      <p class="helper">Role switching is for demonstrations and is not authentication.</p>
      <p><a href="workflow.html">Complete appointment, consent and program workflow →</a></p>
    `;
  if (routeName === 'feedback')
    return html`
      ${renderHeading('REFLECTION / FEEDBACK', 'Keep learning together', 'Record your reflection on the mentoring experience.')}
      <form class="panel" data-form="feedback">
        ${renderTextarea('feedback', 'Your reflection', state.feedback || '')}
        <button type="submit">Save feedback${arrowIcon}</button>
      </form>
    `;
  if (['programs', 'reports', 'archive'].includes(routeName))
    return html`
      ${renderHeading('PROGRAM ADMINISTRATION', routeName === 'archive' ? 'Program archive' : 'Programs and reports', 'Illustrative records for this prototype.')}
      ${routeName === 'archive' ? '<p>No completed records in the local demonstration.</p>' : renderProgramTable(viewContext)}
      <div class="actions">${renderButton('Export report', 'export')}</div>
    `;
  if (routeName === 'requests')
    return html`
      ${renderHeading('SCHOOL WORKSPACE', 'Requests & assignments', 'Review the local demonstration request.')}
      <div class="panel">
        <h2>Alina K.</h2>
        <p><span data-no-translate>${escapeHtml(state.request.area)}</span></p>
        <span class="badge">${escapeHtml(state.request.status)}</span>
        <p>Preferred mentor: ${demoMentors[state.request.mentor]?.name || 'Not selected'}</p>
        <a href="workflow.html">Continue the full appointment and consent scenario →</a>
      </div>
    `;
  if (routeName === 'changes')
    return html`
      ${renderHeading('PROGRAM CHANGES', 'Request a change', 'Record a reason for the School to review.')}
      <form class="panel" data-form="change">
        ${renderTextarea('change', 'Reason for change', state.change || '')}
        <button type="submit">Save change request${arrowIcon}</button>
      </form>
    `;
  if (routeName === 'settings')
    return html`
      ${renderHeading('PROGRAM SETTINGS', 'Demo settings', 'Manage course assignments and inspect the local audit log.')}
      <p><a href="#courses">Mentor course assignments →</a></p>
      <div class="panel">
        ${state.audit.map((first) => `<p>${escapeHtml(first.at)} · ${escapeHtml(first.action)}</p>`).join('') || 'No actions recorded yet.'}
      </div>
    `;
  return html`
    ${renderHeading('AITU FACULTY MENTORING', routeName === 'about' ? 'A shared commitment to better teaching.' : 'Support, privacy and guidelines', 'Voluntary mentoring for professional growth.')}
    <div class="panel">
      <h2>A space for development</h2>
      <p>
        Share your goals, explore mentors, agree a plan and learn through practice and reflection.
      </p>
      <p>
        This local prototype uses illustrative profiles and public course–skill data. Drafts remain
        in your browser. It does not provide institutional authentication, shared storage or
        production access controls.
      </p>
      ${renderLink('Explore the workspaces', 'demo')}
      <a href="#model">About the open-data model</a>
    </div>
  `;
}
