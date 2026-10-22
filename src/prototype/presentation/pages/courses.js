import { html } from '../components/html-template.js';
import {
  renderHeading,
  renderSelect,
  renderInput,
  renderButton,
  escapeHtml,
} from '../components/html.js';
import { demoMentors } from '../../domain/demo/catalog.js';
import { queryElement } from '../dom.js';
export function renderCoursesPage(viewContext) {
  return html`
    ${renderHeading('MATCHING DEMONSTRATION', 'Mentor courses', 'Manage the illustrative course links used to rank demo mentors.')}
    <p class="helper">
      Initial assignments use course index modulo 3. They are not verified teaching records.
    </p>
    ${renderSelect(
      'course-mentor',
      'Mentor',
      demoMentors.map((mentor, index) => [index, mentor.name]),
      0,
    )}${renderInput('course-search', 'Find a course', '', 'search', false)}
    <div id="course-list"></div>
    ${renderButton('Reset demo assignments', 'reset-courses', true)}
  `;
}
export function updateCourseList(viewContext) {
  const { model, modelError, getCourseOwner } = viewContext;
  if (!model) {
    queryElement('#course-list').textContent = modelError || 'Loading courses…';
    return;
  }
  const id = Number(queryElement('[name=course-mentor]').value),
    searchQuery = queryElement('[name=course-search]').value.toLowerCase();
  queryElement('#course-list').innerHTML =
    model.courses
      .filter((course) => course.title.toLowerCase().includes(searchQuery))
      .map(
        (course) => html`
          <label class="course-option">
            <input
              type="checkbox"
              data-course="${course.id}"
              ${getCourseOwner(course) === id ? 'checked' : ''}
            />
            <span>
              <span data-no-translate>${escapeHtml(course.title)}</span>
              <br />
              <small>
                ${getCourseOwner(course) >= 0 ? 'Linked to ' + demoMentors[getCourseOwner(course)]?.name : 'Unassigned'}
              </small>
            </span>
          </label>
        `,
      )
      .join('') || 'No courses found.';
}
