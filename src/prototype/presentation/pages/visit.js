import { html } from '../components/html-template.js';
import {
  renderHeading,
  renderInput,
  renderTextarea,
  arrowIcon,
  renderButton,
} from '../components/html.js';
export function renderVisitPage(viewContext) {
  const { state, visitTab } = viewContext;
  const visit = state.visit;
  return html`
    ${renderHeading('SHARED PRACTICE / DEVELOPMENT VISIT', 'Observe. Reflect. Develop.', 'A supportive lesson observation, guided by the goals you agree with your mentor.')}
    <div class="tabs">
      ${['preparation', 'observation', 'reflection'].map((label, index) => `<button class="${visitTab === label ? 'active' : ''}" data-action="visit-tab" data-tab="${label}">0${index + 1} ${label.toUpperCase()}</button>`).join('')}
    </div>
    <div class="columns">
      <form class="panel" data-form="visit">
        <h2>
          ${
            {
              preparation: 'Prepare your visit',
              observation: 'Record your observations',
              reflection: 'Reflect together',
            }[visitTab]
          }
        </h2>
        ${visitTab === 'preparation' ? `${renderInput('course', 'Course / lesson', visit.course)}<div class="field-grid">${renderInput('date', 'Date', visit.date, 'date')}${renderInput('location', 'Time / location', visit.location)}</div>${renderTextarea('focus', 'Agreed observation focus', visit.focus)}` : visitTab === 'observation' ? `${renderInput('timestamp', 'Observation time (mm:ss)', visit.timestamp || '10:00')}${renderTextarea('observation', 'Observed teacher and student actions', visit.observation || '')}` : `${renderTextarea('plus', 'Plus — strengths', visit.plus || '')}${renderTextarea('question', 'Question for discussion', visit.question || '')}${renderTextarea('recommendation', 'Recommendation and next step', visit.recommendation || '')}`}
        <div class="actions">
          <button type="submit">Save ${visitTab}${arrowIcon}</button>
          ${visitTab === 'preparation' ? renderButton('Observation form', 'visit-tab', true, 'data-tab="observation"') : ''}
        </div>
      </form>
      <div>
        <div class="photo" role="img" aria-label="Astana campus"></div>
        <div class="side-copy" style="padding:30px 26px">
          <small>A SHARED APPROACH</small>
          <h2 style="margin-top:20px">
            Plus. Question.
            <br />
            Recommendation.
          </h2>
          <p>Notice strengths. Ask thoughtful questions. Agree a practical next step together.</p>
        </div>
      </div>
    </div>
  `;
}
