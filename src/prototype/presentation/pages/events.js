import { html } from '../components/html-template.js';
import { demoEvents } from '../../domain/demo/catalog.js';
import {
  arrowIcon,
  renderHeading,
  renderInput,
  renderSelect,
  renderLink,
} from '../components/html.js';
import { renderFooter } from './layout.js';
export function renderEventCards(viewContext) {
  return html`
    <div class="cards" id="event-cards">
      ${demoEvents.map((event, index) => `<article class="card event-card" data-event="${index}"><div class="event-photo e${index}" role="img" aria-label="${event.type.toLowerCase()} with colleagues"></div><div class="card-body"><span class="type">${event.type}</span><h2>${event.title}</h2><p>${event.description}</p><button class="profile-link" data-action="event" data-id="${index}">${event.tags}${arrowIcon}</button></div></article>`).join('')}
    </div>
  `;
}
export function renderEventsPage(viewContext) {
  return html`
    <section class="public-section">
      ${renderHeading('WORKSHOPS / OPEN LESSONS / SHARED PRACTICE', 'Explore skills with mentors', 'Experience new approaches before choosing your development focus. Learn with AITU colleagues through practical events.')}
      <div class="filter-row">
        ${renderInput('event-search', 'Find an event', '', 'search', false)}${renderSelect('event-format', 'Event format', [['', 'All formats'], ...demoEvents.map((event) => [event.type, event.type])], '')}${renderSelect(
          'event-skill',
          'Skill area',
          [
            ['', 'All skills'],
            ['Active learning', 'Active learning'],
            ['Observation', 'Observation'],
            ['Feedback', 'Feedback'],
          ],
          '',
        )}
      </div>
      ${renderEventCards(viewContext)}
      <p id="event-empty" hidden>No events match your filters.</p>
      <p class="demo-note">
        Illustrative events for the prototype. Dates and mentors will be confirmed by AITU.
      </p>
      <div class="blue row public-cta">
        <h2>Found a skill you want to develop?</h2>
        <div class="actions">
          ${renderLink('Create mentee form', 'request')}${renderLink('Create mentor form', 'mentor-form', true)}
        </div>
      </div>
    </section>
    ${renderFooter(viewContext)}
  `;
}
