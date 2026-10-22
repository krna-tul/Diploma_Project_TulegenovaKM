import { html } from '../components/html-template.js';
import { renderLink } from '../components/html.js';
import { renderEventCards } from './events.js';
export function renderLandingPage(viewContext) {
  return html`
    <section class="landing-hero">
      <div class="landing-copy">
        <small>━ &nbsp; AITU FACULTY MENTORING</small>
        <h1>
          A shared path
          <br />
          to professional
          <br />
          growth.
        </h1>
        <p>Develop your teaching with a mentor. Share your experience and help a colleague grow.</p>
        <div class="actions">
          ${renderLink('Create mentee form', 'request')}${renderLink('Create mentor form', 'mentor-form', true)}
        </div>
        <small>FOR AITU FACULTY / VOLUNTARY / CONFIDENTIAL</small>
      </div>
      <div class="photo" role="img" aria-label="Astana campus and city"></div>
    </section>
    <section class="landing-band">
      <h2>
        Not sure which skill
        <br />
        to develop?
      </h2>
      <div>
        <p>
          Start with an event. Join a workshop or an open lesson, meet mentors and discover what you
          would like to learn next.
        </p>
        ${renderLink('Explore events', 'events')} &nbsp; Learn before you choose.
      </div>
    </section>
    <section class="public-section">
      <small>DISCOVER SKILLS THROUGH SHARED PRACTICE</small>
      <div class="section-heading">
        <h2 style="font-size:40px">Learn with our mentors</h2>
        ${renderLink('View all events', 'events', true)}
      </div>
      ${renderEventCards(viewContext)}
      <p class="demo-note">
        Illustrative events for the prototype. Dates and mentors will be confirmed by AITU.
      </p>
      <hr />
      <h2 style="font-size:40px">Your next step starts here.</h2>
      <div class="grid3">
        ${[
          [
            'Share your goals',
            'Create your mentee form and tell us what you want to develop.',
            'request',
          ],
          [
            'Find your mentor',
            'Explore expertise and agree the right support together.',
            'mentors',
          ],
          [
            'Put learning into practice',
            'Build a plan, meet, observe and reflect on your progress.',
            'plan',
          ],
        ]
          .map(
            ([label, values, item], index) =>
              `<a class="journey-card" style="border:0;padding-left:0" href="#${item}"><small>0${index + 1} / MENTORING</small><h2>${label}</h2><p>${values}</p></a>`,
          )
          .join('')}
      </div>
    </section>
    <footer class="landing-footer">
      <h3>AITU Faculty Mentoring</h3>
      <a href="#help">Support · Privacy · Program guidelines</a>
    </footer>
  `;
}
