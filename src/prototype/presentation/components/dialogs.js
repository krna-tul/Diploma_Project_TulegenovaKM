import { parseDetails } from './slider-math.js';
import { html } from './html-template.js';
import { escapeHtml, renderButton, renderInput, arrowIcon } from './html.js';
export const renderAccountHelp = () =>
  '<h2>Account support</h2><p>This is a local demo; no account or password has been created. For institutional access, contact the program administrator.</p>';
export function renderNotifications(state) {
  return html`
    <h2>Notifications</h2>
    <p>Request: ${escapeHtml(state.request.status)}</p>
    <p>Plan: ${escapeHtml(state.plan.status)}</p>
    <p class="helper">Local demo activity only.</p>
  `;
}
export function renderMentorProfile(mentor, mentorId) {
  return html`
    <small>MENTOR PROFILE · ILLUSTRATIVE DATA</small>
    <h2>${mentor.name}</h2>
    <p>${mentor.school}</p>
    <p>${mentor.tags.join(' · ')}</p>
    <p>
      Available for meetings and Development Visits. The School confirms availability and mutual
      agreement before assignment.
    </p>
    ${renderButton('Choose preferred mentor', 'choose', false, `data-id="${mentorId}"`)}
  `;
}
export function renderCourseEvidence(recommendation, threshold) {
  const evidence = recommendation.best;
  const labels = [
    'Content–skill cosine',
    'Title–skill cosine',
    'Minimum cosine',
    'Content–skill Jaccard',
    'Title–skill Jaccard',
  ];
  return html`
    <small>COURSE EVIDENCE</small>
    <h2 data-no-translate>${escapeHtml(evidence.course.title)}</h2>
    <p data-no-translate>${escapeHtml(evidence.course.content)}</p>
    <table>
      ${evidence.features.map((feature, index) => `<tr><td>${labels[index]}</td><td>${feature.toFixed(6)}</td></tr>`).join('')}
    </table>
    <p>Model score: ${evidence.probability.toFixed(6)} · Threshold: ${threshold.toFixed(2)}</p>
    <p class="helper">
      This course is illustratively assigned to ${recommendation.name}. The score is not a validated
      measure of mentor suitability.
    </p>
  `;
}
export function renderActivityDialog() {
  return html`
    <h2>Add an activity</h2>
    <form class="dialog-form" data-form="activity">
      ${renderInput('task', 'Activity')}${renderInput('note', 'Development focus')}${renderInput('date', 'Target date', '2026-11-20', 'date')}${renderInput('result', 'Expected result')}
      <button type="submit">Add activity${arrowIcon}</button>
    </form>
  `;
}
export function renderEventDialog(event, eventId, isRegistered) {
  const blocks = parseDetails(event.details)
    .map((block) =>
      block.type === 'list'
        ? `<ul class="detail-list">${block.items.map((item) => `<li>${item}</li>`).join('')}</ul>`
        : block.type === 'heading'
          ? `<h3>${block.text}</h3>`
          : `<p>${block.text}</p>`,
    )
    .join('');
  return html`
    <div class="event-dialog">
      <span class="type tone-${eventId % 3}">${event.type}</span>
      <h2 id="dialog-title">${event.title}</h2>
      ${blocks || `<p>${event.description}</p>`}
      <p>Dates and mentors will be confirmed by AITU.</p>
      <p class="helper">Registering interest is saved in this browser only.</p>
      ${renderButton(isRegistered ? 'Interest registered' : 'Register interest', 'enroll', false, `data-id="${eventId}" ${isRegistered ? 'disabled' : ''}`)}
    </div>
  `;
}
