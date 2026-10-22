import { html } from '../components/html-template.js';
import {
  renderHeading,
  renderInput,
  renderTextarea,
  renderSelect,
  arrowIcon,
  renderButton,
} from '../components/html.js';
export function renderMentorFormPage(viewContext) {
  const { state } = viewContext;
  const mentor = state.mentor;
  return html`
    ${renderHeading('JOIN AS A MENTOR', 'Share your expertise', 'Tell colleagues what you can help with and how you prefer to work together.')}
    <div class="columns">
      <form class="panel" data-form="mentor">
        <small>YOUR MENTOR PROFILE</small>
        <div class="field-grid">
          ${renderInput('name', 'Full name', mentor.name)}${renderInput('school', 'School', mentor.school)}
        </div>
        ${renderInput('expertise', 'Areas of expertise', mentor.expertise)}${renderTextarea('approach', 'Your experience and approach', mentor.approach)}
        <div class="field-grid">
          ${renderInput('format', 'Preferred format', mentor.format)}${renderSelect(
            'capacity',
            'Available capacity',
            [
              [1, 'Up to 1 active mentee'],
              [2, 'Up to 2 active mentees'],
            ],
            mentor.capacity,
          )}
        </div>
        <div class="actions">
          <button type="submit">Submit mentor form${arrowIcon}</button>
          ${renderButton('Save draft', 'mentor-draft', true)}
        </div>
      </form>
      <div>
        <div class="blue" style="min-height:300px">
          <small>MENTORING AT AITU</small>
          <h2>Experience worth sharing.</h2>
          <p>
            Your School reviews the profile before it appears in the mentor directory. Assignments
            are agreed with both participants.
          </p>
        </div>
        <div class="side-copy">
          <h2>
            Help someone take
            <br />
            their next step.
          </h2>
          <p>Mentoring is voluntary, confidential and focused on professional growth.</p>
        </div>
      </div>
    </div>
  `;
}
