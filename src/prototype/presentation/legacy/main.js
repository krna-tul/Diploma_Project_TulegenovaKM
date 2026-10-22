import { html } from '../components/html-template.js';
import { dashboard as dashboardView, skillChecks as skillChecksView } from './dashboard.js';
import {
  mentorForm as mentorFormView,
  menteeForm as menteeFormView,
  mentorCards as mentorCardsView,
  requestsPage as requestsPageView,
} from './applications.js';
import { pairControls as pairControlsView, pairsPage as pairsPageView } from './pairs.js';
import { planPage as planPageView, visitCard as visitCardView } from './plan.js';
import { reportPage as reportPageView } from './report.js';
import { esc as escapeHtml } from './components.js';
function getViewContext() {
  return {
    state,
    role,
    chosenSkill,
    query,
    area,
    pairId,
    names,
    statuses,
    formats,
    criteria,
    skillName,
  };
}
const dashboard = (...args) => dashboardView(getViewContext(), ...args);
const skillChecks = (...args) => skillChecksView(getViewContext(), ...args);
const mentorForm = (...args) => mentorFormView(getViewContext(), ...args);
const menteeForm = (...args) => menteeFormView(getViewContext(), ...args);
const mentorCards = (...args) => mentorCardsView(getViewContext(), ...args);
const requestsPage = (...args) => requestsPageView(getViewContext(), ...args);
const pairControls = (...args) => pairControlsView(getViewContext(), ...args);
const pairsPage = (...args) => pairsPageView(getViewContext(), ...args);
const planPage = (...args) => planPageView(getViewContext(), ...args);
const visitCard = (...args) => visitCardView(getViewContext(), ...args);
const reportPage = (...args) => reportPageView(getViewContext(), ...args);
import { initialState, skills, transition } from '../../domain.js';
const key = 'aitu-mentorship-prototype-v1';
let state,
  storageWarning = '';
try {
  state = JSON.parse(localStorage.getItem(key) || 'null');
  if (state?.schema !== 1) state = initialState();
} catch {
  state = initialState();
  storageWarning = 'Локальное хранилище недоступно или повреждено. Сессия начата с демо-данных.';
}
let page = 'dashboard',
  role = 'teacher',
  chosenSkill = '',
  query = '',
  area = 'Все',
  pairId = '';
const app = document.querySelector('#app');
const skillName = (id) => skills.find((skill) => skill.id === id)?.name || id;
const names = {
  teacher: 'Преподаватель',
  mentor: 'Наставник',
  mentee: 'Наставляемый',
  director: 'Директор Школы',
  rector: 'Регистратор распоряжения',
  department: 'Академический департамент',
};
const statuses = {
  review: 'Проверка Школы',
  training: 'Ожидается инструктаж',
  published: 'Доступен',
  returned: 'Возвращена',
  submitted: 'Ожидает подбора',
  matching: 'Пара предложена',
  consents: 'Согласия сторон',
  presented: 'Представление директора',
  planning: 'Подготовка и утверждение плана',
  active: 'Программа идет',
  completed: 'Завершена',
  ended: 'Прекращена',
};
const formats = [
  ['Очный', 'Очный'],
  ['Дистанционный', 'Дистанционный'],
  ['Смешанный', 'Смешанный'],
];
function notify(text, error = false) {
  const fieldName = document.querySelector('#notice');
  fieldName.textContent = text;
  fieldName.classList.toggle('error', error);
  fieldName.style.display = 'block';
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => (fieldName.style.display = 'none'), 6000);
}
function persist(next) {
  try {
    localStorage.setItem(key, JSON.stringify(next));
    state = next;
  } catch {
    throw new Error(
      'Не удалось сохранить изменения. Проверьте доступность и объем хранилища браузера.',
    );
  }
}
const criteria = [
  'Логичность структуры занятия',
  'Связь этапов занятия',
  'Управление временем',
  'Достижение целей этапов',
  'Активные и интерактивные методы',
  'Цифровые инструменты',
  'Дифференциация и потребности',
  'Методы и результаты обучения',
  'Активность обучающихся',
  'Взаимодействие преподавателя и студентов',
  'Взаимодействие студентов',
  'Участие большинства',
  'Формирующее оценивание',
  'Обратная связь преподавателя',
  'Рефлексия студентов',
];
function render() {
  app.innerHTML = html`
    <header>
      <div class="topbar">
        <div class="brand">
          <span class="brandmark">AITU</span>
          Наставничество
        </div>
        <div class="actions">
          <button data-page="mentor-form">Подать как наставник</button>
          <button class="primary" data-page="mentee-form">Подать как наставляемый</button>
        </div>
      </div>
      <nav aria-label="Основная навигация">
        ${[
          ['dashboard', 'Главная'],
          ['mentors', 'Наставники'],
          ['requests', 'Заявки'],
          ['pairs', 'Пары и планы'],
          ['report', 'Обзор программы'],
        ]
          .map(
            ([item, label]) =>
              `<button data-page="${item}" class="${page === item || (item === 'pairs' && page === 'plan') ? 'selected' : ''}">${label}</button>`,
          )
          .join('')}
      </nav>
    </header>
    <main>
      <div class="demo">
        <span>Локальный прототип · синтетические данные · без серверной авторизации</span>
        <label>
          Роль сценария
          <select id="role">
            ${Object.entries(names)
              .map(
                ([record, fieldName]) =>
                  `<option value="${record}" ${role === record ? 'selected' : ''}>${fieldName}</option>`,
              )
              .join('')}
          </select>
        </label>
      </div>
      ${storageWarning ? `<div class="note">${escapeHtml(storageWarning)}</div>` : ''}${(
        {
          dashboard,
          mentors: mentorCards,
          'mentor-form': mentorForm,
          'mentee-form': menteeForm,
          requests: requestsPage,
          pairs: pairsPage,
          plan: planPage,
          report: reportPage,
        }[page] || dashboard
      )()}
      <footer>
        AITU · Дипломный проект · Наставничество как поддержка профессионального развития
      </footer>
    </main>
  `;
}
app.addEventListener('change', (event) => {
  if (event.target.id === 'role') {
    role = event.target.value;
    render();
  }
});
app.addEventListener('input', (event) => {
  if (event.target.id === 'search') {
    query = event.target.value;
    const at = event.target.selectionStart;
    render();
    const field = document.querySelector('#search');
    field.focus();
    field.setSelectionRange(at, at);
  }
});
app.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.page) {
    page = button.dataset.page;
    if (['mentor-form', 'mentee-form'].includes(page)) role = 'teacher';
    render();
    window.scrollTo(0, 0);
    return;
  }
  if ('skill' in button.dataset) {
    chosenSkill = button.dataset.skill;
    render();
    return;
  }
  if (button.dataset.area) {
    area = button.dataset.area;
    render();
    return;
  }
  if (button.dataset.mentor) {
    page = 'mentee-form';
    role = 'teacher';
    render();
    document.querySelector('[name=mentorId]').value = button.dataset.mentor;
    window.scrollTo(0, 0);
    return;
  }
  if (button.dataset.pair) {
    pairId = button.dataset.pair;
    page = 'plan';
    render();
    window.scrollTo(0, 0);
    return;
  }
  if (button.dataset.action) {
    try {
      persist(
        transition(
          state,
          button.dataset.action,
          {
            id: button.dataset.id,
          },
          role,
        ),
      );
      render();
      notify('Изменения сохранены.');
    } catch (err) {
      notify(err.message, true);
    }
  }
});
app.addEventListener('submit', (event) => {
  event.preventDefault();
  const formValue = event.target;
  if (!formValue.dataset.action) return;
  const formData = new FormData(formValue);
  const values = Object.fromEntries(formData);
  values.skills = formData.getAll('skills');
  for (const course of formValue.querySelectorAll('input[type=checkbox]'))
    if (course.name !== 'skills') values[course.name] = course.checked;
  try {
    persist(transition(state, formValue.dataset.action, values, role));
    if (['mentor-submit', 'request-submit'].includes(formValue.dataset.action)) page = 'requests';
    render();
    notify('Сохранено. Следующий этап доступен в соответствующей роли.');
  } catch (err) {
    notify(err.message, true);
  }
});
render();
