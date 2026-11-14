import { html } from '../components/html-template.js';
import {
  renderHeading,
  renderInput,
  renderTextarea,
  escapeHtml,
  arrowIcon,
} from '../components/html.js';
import { lessonTypes, observationCriteria } from '../../domain/demo/records.js';

const ROWS = 4;
const field = (values, name) => escapeHtml(values[name] || '');

export function renderObservationFormPage({ state }) {
  const values = { ...state.observation };
  if (!values.course) values.course = state.visit.course;
  if (!values.date) values.date = state.visit.date;
  return html`
    ${renderHeading('DEVELOPMENT VISIT / LESSON OBSERVATION FORM', 'Lesson observation form', 'Record facts and timestamps without interfering with the lesson. Share the form with the teacher afterwards.')}
    <form class="observation-form" data-form="observation">
      <section class="panel">
        <small>LESSON DETAILS</small>
        <div class="field-grid">
          ${renderInput('teacher', 'Teacher', values.teacher || 'Alina K.')}
          ${renderInput('observer', 'Observer', values.observer || 'Aigerim S.')}
        </div>
        <div class="field-grid">
          ${renderInput('course', 'Course', values.course)}
          ${renderInput('topic', 'Lesson topic', values.topic)}
        </div>
        <div class="field-grid">
          ${renderInput('date', 'Date', values.date, 'date')}
          ${renderInput('time', 'Time', values.time || '10:00', 'time')}
        </div>
        <fieldset class="choice-row">
          <legend>Type of lesson</legend>
          ${lessonTypes
            .map(
              (type) =>
                `<label class="check"><input type="radio" name="lessonType" value="${type}" ${(values.lessonType || 'Practical class') === type ? 'checked' : ''} /><span>${type}</span></label>`,
            )
            .join('')}
        </fieldset>
      </section>
      <section class="panel">
        <small>1. LESSON CONTEXT</small>
        <div class="field-grid">
          ${renderTextarea('objectives', 'Lesson objectives', values.objectives, false)}
          ${renderTextarea('outcomes', 'Planned learning outcomes', values.outcomes, false)}
        </div>
        <div class="field-grid">
          ${renderInput('students', 'Number of students', values.students, 'number', false)}
          ${renderInput('group', 'Group characteristics', values.group, 'text', false)}
        </div>
      </section>
      <section class="panel">
        <small>2. LESSON PROGRESSION</small>
        <p class="helper">Chronological observations. Example: 12:30 — students work in pairs.</p>
        <div class="table-wrap">
          <table class="progress-table">
            <thead>
              <tr>
                <th>TIME / STAGE</th>
                <th>OBSERVED TEACHER ACTION</th>
                <th>STUDENT ACTIONS</th>
                <th>COMMENTS / QUESTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${Array.from(
                { length: ROWS },
                (_, row) =>
                  `<tr>${[
                    ['time', 'Time/stage'],
                    ['teacher', 'Observed teacher action'],
                    ['students', 'Student actions'],
                    ['comment', 'Comments/questions'],
                  ]
                    .map(
                      ([column, label]) =>
                        `<td><input name="row${row}-${column}" aria-label="${label}" value="${field(values, `row${row}-${column}`)}" /></td>`,
                    )
                    .join('')}</tr>`,
              ).join('')}
            </tbody>
          </table>
        </div>
      </section>
      <section class="panel">
        <small>3. OBSERVATION OF TEACHING PRACTICE</small>
        <div class="criteria-grid">
          ${observationCriteria
            .map(
              ([letter, title, criteria]) => html`
                <div class="criteria-block">
                  <h3>
                    <span class="criteria-letter">${letter}</span>
                    <span>${title}</span>
                  </h3>
                  ${criteria
                    .map(
                      (criterion, index) =>
                        `<label class="field"><span>${criterion}</span><textarea name="${letter}${index}" rows="2">${field(values, `${letter}${index}`)}</textarea></label>`,
                    )
                    .join('')}
                </div>
              `,
            )
            .join('')}
        </div>
      </section>
      <section class="panel">
        <small>4–7. DISCUSSION</small>
        <div class="field-grid">
          ${renderTextarea('strengths', 'Strengths of the lesson', values.strengths, false)}
          ${renderTextarea('questions', 'Questions for professional discussion', values.questions, false)}
        </div>
        ${renderTextarea('reflection', 'Observer’s final reflection', values.reflection, false)}
        <div class="pqr">
          <div>
            <small>PLUS</small>
            <p>I noticed that at 12:30 all students were actively working in pairs.</p>
          </div>
          <div>
            <small>QUESTION</small>
            <p>How do you plan to strengthen differentiation for higher-performing students?</p>
          </div>
          <div>
            <small>RECOMMENDATION</small>
            <p>Try adding an additional task for those who finish earlier.</p>
          </div>
        </div>
        <div class="actions">
          <button type="submit">Save observation form${arrowIcon}</button>
          <a class="button secondary" href="#visit">Back to the visit${arrowIcon}</a>
        </div>
      </section>
    </form>
  `;
}
