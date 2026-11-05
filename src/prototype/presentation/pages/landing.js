import { html } from '../components/html-template.js';
import { renderLink } from '../components/html.js';
import { renderSiteFooter } from '../components/site-footer.js';
import { renderIllustratedScene, renderSparkles } from '../components/illustrated-scenes.js';

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

const journey = [...pillars.map(([, title, text]) => [title, text, null]), ...steps];

export function renderLandingPage(viewContext) {
  return html`
    <section class="lp-hero">
      ${renderSparkles(26, 11)}
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
      </div>
      ${renderIllustratedScene('skyline', 'lp-skyline')}
    </section>

    <section class="lp-section lp-explore-section">
      <div class="lp-explore">
        <div class="lp-explore-copy">
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
      <h2 class="lp-title">One shared path</h2>
      <div class="lp-glass-grid lp-glass-journey">
        ${journey
          .map(
            ([title, text, route], index) =>
              `<${route ? `a href="#${route}"` : 'article'} class="glass-card"><h3><span class="glass-num">${index + 1}.</span> ${title}</h3><p>${text}</p></${route ? 'a' : 'article'}>`,
          )
          .join('')}
      </div>
    </section>

    <section class="lp-final">
      ${renderSparkles(16, 29)}
      <div class="lp-final-copy" data-reveal>
        <h2>
          <span>Your next step</span>
          <em>starts here.</em>
        </h2>
        <p>Tell us what you want to develop — or share the experience you can offer.</p>
        <div class="actions">
          ${renderLink('Create mentee form', 'request')}${renderLink('Create mentor form', 'mentor-form', true)}
        </div>
      </div>
      ${renderIllustratedScene('campus', 'lp-campus')}
    </section>

    ${renderSiteFooter()}
  `;
}
