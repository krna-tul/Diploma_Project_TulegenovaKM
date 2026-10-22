import { html } from '../components/html-template.js';
import { renderHeading, renderLink, escapeHtml } from '../components/html.js';
import { demoMentors } from '../../domain/demo/catalog.js';
export function renderOverviewPage(viewContext) {
  const { state } = viewContext;
  return html`
    ${renderHeading('MY WORKSPACE', 'Your mentoring journey', 'A clear view of your goals, conversations and next steps.')}
    <div class="overview-banner">
      <div>
        <small>YOUR NEXT STEP</small>
        <h2>Start with what matters to you.</h2>
        <p>Tell us where you would like support, then explore colleagues who can help.</p>
        ${renderLink('Create a request', 'request')}
      </div>
      <div class="photo" role="img" aria-label="Astana campus"></div>
    </div>
    <div class="grid3">
      ${[
        ['Find a mentor', 'Explore expertise across AITU.', 'mentors'],
        ['Build your plan', 'Turn your goals into practical steps.', 'plan'],
        ['Reflect & develop', 'Learn from visits and feedback.', 'visit'],
      ]
        .map(
          ([label, values, item], index) =>
            `<a class="journey-card" href="#${item}"><small>0${index + 1} / YOUR JOURNEY</small><h2>${label}</h2><p>${values}</p></a>`,
        )
        .join('')}
    </div>
    <h2 class="section-title">Program at a glance</h2>
    <div class="grid3">
      ${[
        ['CURRENT STATUS', state.request.status],
        [
          'MENTOR',
          state.request.status === 'Not started'
            ? 'Not assigned'
            : `${demoMentors[state.request.mentor]?.name || 'Not selected'} (preferred)`,
        ],
        [
          'DEVELOPMENT PLAN',
          state.plan.status === 'Draft' ? 'Ready when you are' : state.plan.status,
        ],
      ]
        .map(
          ([label, value]) =>
            `<div class="glance"><small>${label}</small><p>${escapeHtml(value)}</p></div>`,
        )
        .join('')}
    </div>
  `;
}
