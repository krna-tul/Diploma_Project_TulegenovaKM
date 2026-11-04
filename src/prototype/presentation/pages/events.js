import { html } from '../components/html-template.js';
import { demoEvents } from '../../domain/demo/catalog.js';
import { renderHeading, renderInput, renderSelect, renderLink } from '../components/html.js';
import { renderFooter } from './layout.js';
import { lineIcon } from '../components/line-icons.js';
const renderCardContent = (card) =>
  [
    card.preview && `<p class="fc-preview">${card.preview}</p>`,
    ...(card.blocks || []).map(
      (block) =>
        `<div class="fc-block"><h3 class="fc-subtitle">${lineIcon(block.icon)}<span>${block.title}</span></h3><p>${block.text}</p></div>`,
    ),
    card.emphasizedTitle &&
      `<h3 class="fc-subtitle fc-emphasis">${card.emphasisIcon ? lineIcon(card.emphasisIcon) : ''}<span>${card.emphasizedTitle}</span></h3>`,
    card.bullets &&
      `<ul class="fc-list">${card.bullets.map((item) => `<li>${item}</li>`).join('')}</ul>`,
  ]
    .filter(Boolean)
    .join('');
const renderCardFooter = (card) =>
  [
    card.footerText && ['users', card.footerText],
    card.footerNotice && ['shield-check', card.footerNotice],
    card.scheduleText && ['clock', card.scheduleText],
  ]
    .filter(Boolean)
    .map(([icon, text]) => `<p class="fc-footer">${lineIcon(icon)}<span>${text}</span></p>`)
    .join('');
const renderEventCard = (event, index) => html`
  <article class="event-card slider-card" data-event="${index}">
    <div class="fc-head">
      <span class="fc-badge">0${index + 1}</span>
      <h2 id="event-title-${index}">${event.title}</h2>
      ${lineIcon(event.card.icon, 'line-icon fc-head-icon')}
    </div>
    <div class="fc-content">${renderCardContent(event.card)}</div>
    <div class="fc-bottom">
      ${renderCardFooter(event.card)}
      <button
        type="button"
        class="card-cta"
        data-action="event"
        data-id="${index}"
        aria-describedby="event-title-${index}"
      >
        <span>Details</span>
        ${lineIcon('arrow-right', 'line-icon card-cta-arrow')}
      </button>
    </div>
  </article>
`;
export function renderEventCards(viewContext) {
  return html`
    <div class="slider-shell" data-slider data-index="0">
      <div class="slider-frame">
        <div class="slider-viewport">
          <div class="slider-track" id="event-cards">
            ${demoEvents.map(renderEventCard).join('')}
          </div>
        </div>
      </div>
      <div class="slider-nav">
        <button type="button" class="nav-btn" data-slider-prev aria-label="Previous events">
          ${lineIcon('arrow-left')}
        </button>
        <span class="slider-counter" data-slider-counter aria-live="polite"></span>
        <button
          type="button"
          class="nav-btn nav-btn-next"
          data-slider-next
          aria-label="Next events"
        >
          ${lineIcon('arrow-right')}
        </button>
      </div>
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
