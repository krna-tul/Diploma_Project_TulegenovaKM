import { html } from '../components/html-template.js';
import { summary, skills } from '../../domain.js';
import { esc as escapeHtml, date, detail, form, input } from './components.js';
export function dashboard(viewContext) {
  const { state, chosenSkill, area, query, skillName } = viewContext;
  const stats = summary(state);
  const selected = skills.find((skill) => skill.id === chosenSkill);
  const list = skills.filter(
    (skill) =>
      (area === 'Все' || skill.area === area) &&
      `${skill.name} ${skill.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return html`
    <section class="hero">
      <div>
        <span class="eyebrow">Профессиональное развитие · AITU</span>
        <h1>
          Расти в преподавании.
          <br />
          Вместе с коллегами.
        </h1>
        <p class="lead">
          Найдите навык, который хотите развить, выберите наставника или начните с мероприятия.
        </p>
      </div>
      <aside class="hero-aside">
        <span class="eyebrow">Ваш маршрут</span>
        <h3>От запроса к результату</h3>
        <p>01 · Выберите направление</p>
        <p>02 · Найдите поддержку</p>
        <p>03 · Составьте совместный план</p>
        <p>04 · Практикуйте и обсуждайте</p>
      </aside>
    </section>
    <div class="stats">
      ${[
        ['Наставники', stats.published],
        ['Профессиональные запросы', stats.requests],
        ['Активные программы', stats.active],
        ['Завершенные программы', stats.completed],
      ]
        .map(
          ([label, fieldName]) =>
            `<div class="stat"><strong>${fieldName}</strong><span>${label}</span></div>`,
        )
        .join('')}
    </div>
    <section>
      <div class="sectionhead">
        <div>
          <span class="eyebrow">Каталог направлений</span>
          <h2>Какой навык вы хотите развить?</h2>
        </div>
        <label class="field search">
          Поиск навыка
          <input id="search" value="${escapeHtml(query)}" placeholder="Например, обратная связь" />
        </label>
      </div>
      <p class="hint">Если запрос еще не сформулирован, начните с описания навыков.</p>
      <div class="filters">
        ${['Все', ...new Set(skills.map((skill) => skill.area))].map((first) => `<button data-area="${escapeHtml(first)}" class="${area === first ? 'selected' : ''}">${escapeHtml(first)}</button>`).join('')}
      </div>
      <div class="grid">
        ${list.map((skill, index) => `<article class="card ${chosenSkill === skill.id ? 'selected' : ''}"><span class="tag">${escapeHtml(skill.area)}</span><h3>${escapeHtml(skill.name)}</h3><p>${escapeHtml(skill.description)}</p><div class="actions"><button data-skill="${skill.id}" aria-pressed="${chosenSkill === skill.id}">Изучить направление →</button></div></article>`).join('') || '<div class="empty">Навыки не найдены. Попробуйте другой запрос.</div>'}
      </div>
    </section>
    ${selected ? `<section class="panel" style="margin-top:24px"><div class="sectionhead"><h2>${escapeHtml(selected.name)}</h2><button data-skill="">Сбросить выбор</button></div><p>${escapeHtml(selected.description)}</p><div class="actions"><button class="primary" data-page="mentee-form">Запросить наставничество</button><button data-page="mentors">Посмотреть наставников</button></div></section>` : ''}
    <section>
      <div class="sectionhead">
        <div>
          <span class="eyebrow">Витрина мероприятий</span>
          <h2>${selected ? 'События по выбранному навыку' : 'Учитесь через практику'}</h2>
        </div>
        <span class="hint">Демонстрационные мероприятия</span>
      </div>
      <div class="grid">
        ${
          state.events
            .filter((event) => !chosenSkill || event.skills.includes(chosenSkill))
            .map(
              (event) =>
                `<article class="card"><span class="date">${date(event.date)} · ${escapeHtml(event.time)}</span><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.format)}</p><p class="hint">${escapeHtml(event.location)}</p><div>${event.skills.map((skill) => `<span class="tag">${escapeHtml(skillName(skill))}</span>`).join(' ')}</div><p class="hint">Свободно ${event.capacity - state.enrollments.filter((value) => value.eventId === event.id).length} мест</p>${detail('Записаться', form('event-enroll', input('name', 'Демо-имя участника'), event.id, 'Записаться'))}</article>`,
            )
            .join('') ||
          '<div class="empty">По этому навыку мероприятий пока нет. Можно подать запрос на наставничество.</div>'
        }
      </div>
    </section>
  `;
}
export function skillChecks(viewContext) {
  const { chosenSkill } = viewContext;
  return html`
    <fieldset class="wide">
      <legend>Направления поддержки</legend>
      ${skills.map((skill) => `<label class="check"><input type="checkbox" name="skills" value="${skill.id}" ${chosenSkill === skill.id ? 'checked' : ''}>${escapeHtml(skill.name)}</label>`).join('')}
    </fieldset>
  `;
}
