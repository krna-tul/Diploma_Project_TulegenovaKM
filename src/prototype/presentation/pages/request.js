import { html } from '../components/html-template.js';
import {
  renderInput,
  renderSelect,
  renderButton,
  renderHeading,
  renderTextarea,
  arrowIcon,
} from '../components/html.js';
import { demoMentors } from '../../domain/demo/catalog.js';
export function renderMatchingFields(viewContext) {
  const { model, modelError, state } = viewContext;
  if (!model)
    return html`
      <p class="loading">${modelError || 'Loading the open-data matching model…'}</p>
    `;
  return html`
    <details class="matching-box" ${state.request.skill !== undefined ? 'open' : ''}>
      <summary>Find recommendations by skill</summary>
      <p class="helper">
        Choose a skill from the open UniSkill dataset to explore courses and linked demo mentors.
      </p>
      ${renderInput('skill-search', 'Search available skills', '', 'search', false)}${renderSelect(
        'skill',
        'Development skill',
        model.skills.map((skill) => [skill.id, skill.label]),
        state.request.skill ?? model.skills[0].id,
      )}
      <p id="skill-description" class="helper skill-description"></p>
      ${renderButton('Find recommended mentors', 'recommend')}
      <p class="helper">
        Recommendations use course–skill relevance. Your written goals provide context and are not
        scored.
      </p>
    </details>
  `;
}
export function renderRequestPage(viewContext) {
  const { state } = viewContext;
  return html`
    ${renderHeading('START YOUR PROGRAM', 'Your professional request', 'A thoughtful starting point helps you find a mentor and set useful goals.')}
    <div class="columns">
      <form class="panel" data-form="request">
        <small>01 / YOUR DEVELOPMENT GOALS</small>
        ${renderInput('area', 'Area of support', state.request.area)}${renderTextarea('goal', 'What would you like to work on?', state.request.goal)}${renderSelect('mentor', 'Preferred mentor', [['', 'Help me choose'], ...demoMentors.map((mentor, index) => [index, `${mentor.name} — ${mentor.school}`])], state.request.mentor)}
        <p class="helper">A preference does not confirm an assignment.</p>
        <div class="actions">
          <button type="submit">Submit request${arrowIcon}</button>
          ${renderButton('Save draft', 'request-draft', true)}
        </div>
        ${renderMatchingFields(viewContext)}
      </form>
      <div>
        <div class="blue steps">
          <small>WHAT HAPPENS NEXT</small>
          <p>
            <b>01</b>
            School review
          </p>
          <div class="helper">Your request is reviewed by your School.</div>
          <p>
            <b>02</b>
            Mutual agreement
          </p>
          <div class="helper">Availability and consent are confirmed.</div>
          <p>
            <b>03</b>
            Start planning
          </p>
          <div class="helper">Build your plan after the assignment.</div>
        </div>
        <div class="side-copy">
          <h2>Your growth, your direction.</h2>
          <p>
            Mentoring supports professional development. It is not an appraisal or ranking process.
          </p>
        </div>
      </div>
    </div>
  `;
}
