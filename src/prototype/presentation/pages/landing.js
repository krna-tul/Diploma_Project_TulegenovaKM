import { html } from '../components/html-template.js';
import { renderLink, renderIcon } from '../components/html.js';
import { renderEventCards } from './events.js';

const pillars = [
  [
    'graduation-cap',
    'Learn from experience',
    'Observe colleagues in class and get thoughtful feedback from an experienced mentor.',
  ],
  [
    'growth-chart',
    'Build your practice',
    'Turn your goals into an individual development plan with clear activities.',
  ],
  ['people', 'Grow together', 'Meet, reflect and share outcomes with your School and colleagues.'],
];

const steps = [
  ['Share your goals', 'Create your mentee form and tell us what you want to develop.', 'request'],
  ['Find your mentor', 'Explore expertise and agree the right support together.', 'mentors'],
  [
    'Put learning into practice',
    'Build a plan, meet, observe and reflect on your progress.',
    'plan',
  ],
];

export function renderLandingPage(viewContext) {
  return html`
    <section class="lp-hero">
      <div class="lp-hero-copy">
        <h1>
          <span>A shared path to</span>
          <br />
          <span>professional</span>
          <em>growth.</em>
        </h1>
        <p>Develop your teaching with a mentor. Share your experience and help a colleague grow.</p>
        <div class="actions">
          ${renderLink('Create mentee form', 'request')}${renderLink('Create mentor form', 'mentor-form', true)}
        </div>
        <small class="lp-trust">FOR AITU FACULTY / VOLUNTARY / CONFIDENTIAL</small>
      </div>
      <div
        class="lp-illustration lp-skyline"
        role="img"
        aria-label="Illustrated Astana skyline"
      ></div>
    </section>

    <section class="lp-section lp-pillars">
      ${pillars
        .map(
          ([icon, title, text], index) => html`
            <a class="lp-pillar" href="#about">
              <span class="lp-pillar-top">
                ${renderIcon(icon, 'lp-pillar-icon')}
                <span class="lp-pillar-step" aria-hidden="true">0${index + 1}</span>
              </span>
              <h2>${title}</h2>
              <p>${text}</p>
              <span class="lp-round-arrow" aria-hidden="true">→</span>
            </a>
          `,
        )
        .join('')}
    </section>

    <section class="lp-section">
      <div class="lp-explore">
        <div class="lp-explore-icon">${renderIcon('calendar')}</div>
        <div class="lp-explore-copy">
          <small>START WITH AN EVENT</small>
          <h2>
            Not sure which skill
            <br />
            to develop?
          </h2>
        </div>
        <div class="lp-explore-action">
          <p>
            Join a workshop or an open lesson, meet mentors and discover what you would like to
            learn next.
          </p>
          <div class="lp-explore-row">
            ${renderLink('Explore events', 'events')}
            <a class="lp-text-link" href="#events">Learn before you choose.</a>
          </div>
        </div>
      </div>
    </section>

    <section class="lp-section">
      <small class="lp-eyebrow">DISCOVER SKILLS THROUGH SHARED PRACTICE</small>
      <div class="section-heading lp-heading">
        <h2>Learn with our mentors</h2>
        ${renderLink('View all events', 'events', true)}
      </div>
      ${renderEventCards(viewContext)}
      <p class="demo-note">
        Illustrative events for the prototype. Dates and mentors will be confirmed by AITU.
      </p>
    </section>

    <section class="lp-section">
      <small class="lp-eyebrow">HOW MENTORING WORKS</small>
      <h2 class="lp-title">Three steps, one shared path</h2>
      <div class="lp-steps">
        ${steps
          .map(
            ([title, text, route], index) => html`
              <a class="lp-step" href="#${route}">
                <span class="lp-step-number">
                  <b>0${index + 1}</b>
                  <i aria-hidden="true"></i>
                </span>
                <h3>${title}</h3>
                <p>${text}</p>
              </a>
            `,
          )
          .join('')}
      </div>
    </section>

    <section class="lp-final">
      <div class="lp-final-copy">
        <h2>
          <span>Your next step</span>
          <em>starts here.</em>
        </h2>
        <p>Tell us what you want to develop — or share the experience you can offer.</p>
        <div class="actions">
          ${renderLink('Create mentee form', 'request')}${renderLink('Create mentor form', 'mentor-form', true)}
        </div>
      </div>
      <div class="lp-illustration lp-campus" role="img" aria-label="Illustrated AITU campus"></div>
    </section>

    <footer class="landing-footer">
      <span class="lp-footer-brand">
        <span class="logo lp-footer-logo">
          <img class="symbol" src="assets/logo-symbol.svg" alt="" />
          <img class="wordmark" src="assets/logo-text.svg" alt="Astana IT University" />
        </span>
        <span>AITU Faculty Mentoring</span>
      </span>
      <a href="#help">Support · Privacy · Program guidelines</a>
    </footer>
  `;
}
