import { html } from '../components/html-template.js';
import { renderHeading, escapeHtml, renderTextarea, arrowIcon } from '../components/html.js';
import { demoMentors } from '../../domain/demo/catalog.js';
export function renderReviewPage(viewContext) {
  const { state } = viewContext;
  return html`
    ${renderHeading('SCHOOL WORKSPACE / REVIEW', 'Support the next step', 'Review requests and plans for your School, with clear decisions and helpful feedback.')}
    <div class="blue row" style="margin-bottom:30px">
      <div>
        <small>PENDING REVIEW</small>
        <h3 style="margin-top:12px">Individual development plan</h3>
      </div>
      <span class="badge">${escapeHtml(state.plan.status)}</span>
    </div>
    <div class="columns">
      <div class="panel review-summary">
        <h2>Plan summary</h2>
        <small>MENTEE</small>
        <p>Alina K. · School of Computing</p>
        <small>MENTOR</small>
        <p>${demoMentors[state.request.mentor]?.name || 'Not selected'} · School of Computing</p>
        <small>DEVELOPMENT FOCUS</small>
        <p><span data-no-translate>${escapeHtml(state.request.area)}</span></p>
        <hr />
        <a class="profile-link" href="#plan">View full plan and version history →</a>
      </div>
      <form class="panel" data-form="review">
        <small>YOUR DECISION</small>
        <h2>Keep progress moving.</h2>
        ${renderTextarea('comment', 'Review comment', state.plan.comment || '', false)}
        <p class="helper">A comment is required when returning a plan for revision.</p>
        <div class="review-buttons">
          <button
            type="submit"
            name="decision"
            value="Approved"
            ${state.plan.status !== 'Needs review' ? 'disabled' : ''}
          >
            Approve plan${arrowIcon}
          </button>
          <button
            class="secondary"
            type="submit"
            name="decision"
            value="Returned for revision"
            ${state.plan.status !== 'Needs review' ? 'disabled' : ''}
          >
            Return for revision${arrowIcon}
          </button>
        </div>
      </form>
    </div>
    <p class="helper" style="margin-top:32px">
      Demo School workspace. Submit a plan before reviewing it.
    </p>
  `;
}
