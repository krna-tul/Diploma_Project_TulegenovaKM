import { html } from '../components/html-template.js';
import { renderHeading, escapeHtml, renderButton } from '../components/html.js';
import { demoMentors } from '../../domain/demo/catalog.js';
export function renderPlanPage(viewContext) {
  const { state } = viewContext;
  return html`
    ${renderHeading('MY PROGRAM / INDIVIDUAL PLAN', 'Your development plan', 'Agree meaningful goals with your mentor and turn them into achievable activities.')}
    <div class="blue grid3 plan-summary">
      <div>
        <small>MENTOR</small>
        <h3>
          ${demoMentors[state.request.mentor]?.name || 'Not selected'}
          <small>(illustrative)</small>
        </h3>
      </div>
      <div>
        <small>PROGRAM PERIOD</small>
        <p>October — December 2026</p>
      </div>
      <div>
        <small>PLAN VERSION</small>
        <p>Version ${state.plan.version} · ${escapeHtml(state.plan.status)}</p>
      </div>
    </div>
    <div class="section-heading">
      <h2>Goals, activities and milestones</h2>
      ${renderButton('Add activity', 'add-activity', true)}
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ACTIVITY</th>
            <th>TARGET DATE</th>
            <th>EXPECTED RESULT</th>
          </tr>
        </thead>
        <tbody>
          ${state.plan.items.map((activity, index) => `<tr><td>0${index + 1} &nbsp;&nbsp; <span data-no-translate>${escapeHtml(activity.task)}</span><span class="helper" data-no-translate>&emsp;&emsp; ${escapeHtml(activity.note)}</span></td><td>${escapeHtml(activity.date)}</td><td class="helper" data-no-translate>${escapeHtml(activity.result)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="row bottom-actions">
      <p class="helper">Plans are approved by the School Director.</p>
      <div class="actions">
        ${renderButton('Save draft', 'plan-draft', true)}${renderButton('Submit for approval', 'plan-submit')}
      </div>
    </div>
    ${state.plan.comment ? `<p class="notification">School feedback: <span data-no-translate>${escapeHtml(state.plan.comment)}</span></p>` : ''}
    <p class="demo-note">
      Illustrative plan workflow.
      <a href="workflow.html">Open the complete appointment and mutual-consent scenario</a>
      .
    </p>
    ${state.plan.history.length ? `<details><summary>Version history (${state.plan.history.length})</summary>${state.plan.history.map((h) => `<p>Version ${h.version} · ${escapeHtml(h.status)} · ${h.items.length} activities</p>`).join('')}</details>` : ''}
  `;
}
