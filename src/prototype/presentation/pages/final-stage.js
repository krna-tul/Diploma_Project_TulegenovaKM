import { html } from '../components/html-template.js';
import {
  renderHeading,
  renderTextarea,
  renderSelect,
  renderButton,
  arrowIcon,
} from '../components/html.js';
import { effectivenessChecklist } from '../../domain/demo/records.js';

const tabs = [
  ['checklist', 'F-08 Checklist'],
  ['self', 'F-09 Self-assessment'],
  ['review', 'F-10 Mentor review'],
];
const scale = [
  ['', 'Choose'],
  ['Significant progress', 'Significant progress'],
  ['Noticeable progress', 'Noticeable progress'],
  ['Some progress', 'Some progress'],
  ['Too early to say', 'Too early to say'],
];

function renderChecklist(final) {
  return html`
    <form class="panel" data-form="final" data-part="checklist">
      <small>F-08 / EFFECTIVENESS CHECKLIST</small>
      <h2>What was achieved?</h2>
      <div class="check-list">
        ${effectivenessChecklist
          .map(
            (item, index) =>
              `<label class="check"><input type="checkbox" name="c${index}" ${final.checklist.includes(`c${index}`) ? 'checked' : ''} /><span>${item}</span></label>`,
          )
          .join('')}
      </div>
      <div class="actions"><button type="submit">Save checklist${arrowIcon}</button></div>
    </form>
  `;
}

function renderSelf(final) {
  const values = final.self;
  return html`
    <form class="panel" data-form="final" data-part="self">
      <small>F-09 / MENTEE SELF-ASSESSMENT</small>
      <h2>Your reflection</h2>
      ${renderSelect('progress', 'Overall progress', scale, values.progress || '')}
      ${renderTextarea('confidence', 'What do you now do more confidently?', values.confidence || '', false)}
      ${renderTextarea('next', 'What would you like to develop next?', values.next || '', false)}
      <div class="actions"><button type="submit">Save self-assessment${arrowIcon}</button></div>
    </form>
  `;
}

function renderReview(final) {
  const values = final.review;
  return html`
    <form class="panel" data-form="final" data-part="review">
      <small>F-10 / MENTOR FINAL REVIEW</small>
      <h2>Progress and plan completion</h2>
      ${renderSelect('progress', 'Mentee progress', scale, values.progress || '')}
      ${renderTextarea('plan', 'How the individual plan was completed', values.plan || '', false)}
      ${renderTextarea('recommendations', 'Recommendations for further development', values.recommendations || '', false)}
      <div class="actions"><button type="submit">Save mentor review${arrowIcon}</button></div>
    </form>
  `;
}

export function renderFinalPage({ state, finalTab = 'checklist', role }) {
  const final = state.final;
  const done = {
    checklist: final.checklist.length > 0,
    self: Boolean(final.self.progress),
    review: Boolean(final.review.progress),
  };
  return html`
    ${renderHeading('FINAL STAGE / EFFECTIVENESS', 'Final review', 'A short final reflection, the mentor’s review and the effectiveness checklist.')}
    <div class="tabs">
      ${tabs
        .map(
          ([id, label]) =>
            `<button class="${finalTab === id ? 'active' : ''}" data-action="final-tab" data-tab="${id}"><span>${label}</span>${done[id] ? ' ✓' : ''}</button>`,
        )
        .join('')}
    </div>
    <div class="columns record-columns">
      ${{ checklist: renderChecklist, self: renderSelf, review: renderReview }[finalTab](final)}
      <div class="record-list">
        <div class="blue side-tip">
          <small>STATUS</small>
          <p>${final.closed ? 'Program completed' : 'Final review in progress'}</p>
        </div>
        <ul class="status-checks">
          ${tabs.map(([id, label]) => `<li class="${done[id] ? 'is-done' : ''}"><span>${label}</span></li>`).join('')}
        </ul>
        ${role === 'school' && !final.closed ? renderButton('Mark program as completed', 'close-program') : ''}
        <p class="helper">
          Assessment supports development. It is not an attestation or administrative control.
        </p>
      </div>
    </div>
  `;
}
