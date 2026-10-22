import { html } from '../components/html-template.js';
import { form, input, textarea, check, select, esc as escapeHtml, detail } from './components.js';
import { skillChecks } from './dashboard.js';
import { mentorLoad } from '../../domain.js';
export function mentorForm(viewContext) {
  return html`
    <span class="eyebrow">Стать наставником</span>
    <h1>Поделитесь своей экспертизой</h1>
    <p class="lead">
      Школа проверит карточку и критерии положения. Перед началом работы потребуется вводный
      инструктаж.
    </p>
    <div class="note">
      Для демонстрации вводите только вымышленные сведения. Минимальный преподавательский стаж — 3
      года.
    </div>
    <section class="panel">
      ${form('mentor-submit', input('name', 'Имя преподавателя') + input('school', 'Школа', 'text', 'Школа цифровых технологий') + input('experience', 'Стаж преподавания в вузе, лет', 'number') + input('qualification', 'Квалификация') + textarea('evidence', 'Подтвержденные результаты педагогической деятельности') + textarea('expertise', 'Области экспертизы и запросы, с которыми готовы помочь') + skillChecks(viewContext) + input('formats', 'Возможные форматы взаимодействия') + input('availability', 'Доступность и периодичность') + `<div class="wide">${check('consent', 'Готов(а) регулярно взаимодействовать, соблюдать конфиденциальность и участвовать в программе')}</div>`, '', 'Отправить в Школу')}
    </section>
  `;
}
export function menteeForm(viewContext) {
  const { formats, state } = viewContext;
  return html`
    <span class="eyebrow">Найти наставника</span>
    <h1>С чего начнем ваше развитие?</h1>
    <p class="lead">
      Опишите профессиональную потребность. Наставника можно выбрать сейчас или вместе со Школой.
    </p>
    <div class="note">
      Здесь используются только демо-сведения. Частные затруднения не включаются в управленческую
      аналитику.
    </div>
    <section class="panel">
      ${form(
        'request-submit',
        input('name', 'Имя преподавателя') +
          input('school', 'Школа', 'text', 'Школа цифровых технологий') +
          textarea('need', 'Индивидуальный профессиональный запрос') +
          textarea('goal', 'Ожидаемый результат') +
          skillChecks(viewContext) +
          select('format', 'Предпочтительный формат', formats) +
          select('period', 'Период', [
            ['Один триместр', 'Один триместр'],
            ['Один учебный год', 'Один учебный год'],
          ]) +
          select(
            'mentorId',
            'Предпочтительный наставник',
            [
              ['', 'Помогите подобрать'],
              ...state.mentors
                .filter((mentor) => mentor.status === 'published')
                .map((mentor) => [mentor.id, mentor.name]),
            ],
            '',
            false,
          ) +
          `<div class="wide">${check('consent', 'Согласен(на) участвовать в программе и соблюдать конфиденциальность')}</div>`,
        '',
        'Подать запрос',
      )}
    </section>
  `;
}
export function mentorCards(viewContext) {
  const { chosenSkill, skillName, state } = viewContext;
  return html`
    <span class="eyebrow">Коллеги рядом</span>
    <h1>Наставники и экспертиза</h1>
    <p class="lead">
      Выберите поддержку по профессиональному запросу. Окончательное назначение проходит через
      Школу.
    </p>
    <div class="sectionhead">
      <h2>${chosenSkill ? escapeHtml(skillName(chosenSkill)) : 'Все направления'}</h2>
      ${chosenSkill ? '<button data-skill="">Показать всех</button>' : ''}
    </div>
    <div class="grid">
      ${
        state.mentors
          .filter(
            (mentor) =>
              mentor.status === 'published' &&
              (!chosenSkill || mentor.skills.includes(chosenSkill)),
          )
          .map(
            (mentor) =>
              `<article class="card"><span class="tag">${escapeHtml(mentor.school)}</span><h3>${escapeHtml(mentor.name)}</h3><p>${escapeHtml(mentor.expertise)}</p><p class="hint">${mentor.experience} лет · ${escapeHtml(mentor.formats)}</p><div>${mentor.skills.map((skill) => `<span class="tag">${escapeHtml(skillName(skill))}</span>`).join(' ')}</div><p class="hint">Зарезервировано пар: ${mentorLoad(state, mentor.id)} · ${escapeHtml(mentor.availability)}</p><button data-mentor="${mentor.id}" class="primary">Запросить поддержку</button></article>`,
          )
          .join('') ||
        '<div class="empty">По этому навыку пока нет опубликованных наставников. Подайте запрос без кандидатуры.</div>'
      }
    </div>
  `;
}
export function requestsPage(viewContext) {
  const { state, statuses, role, skillName } = viewContext;
  return html`
    <span class="eyebrow">Организация программы</span>
    <h1>Заявки и согласование</h1>
    <p class="lead">
      Школа проверяет кандидатов, согласует пару с обеими сторонами и представляет назначение.
    </p>
    <h2 style="margin-top:28px">Карточки наставников</h2>
    <div class="stack">
      ${
        state.mentors
          .filter((mentor) => mentor.status !== 'published')
          .map(
            (mentor) =>
              `<article class="panel"><span class="step">${statuses[mentor.status]}</span><h3>${escapeHtml(mentor.name)}</h3><p>${escapeHtml(mentor.qualification)} · Стаж: ${escapeHtml(mentor.experience)} лет</p><p>${escapeHtml(mentor.evidence)}</p><p>${escapeHtml(mentor.expertise)} · ${escapeHtml(mentor.formats)} · ${escapeHtml(mentor.availability)}</p>${mentor.reason ? `<p>Причина возврата: ${escapeHtml(mentor.reason)}</p>` : ''}${role === 'director' && mentor.status === 'review' ? form('mentor-review', `<div class="wide">${check('verified', 'Проверены стаж, результаты, компетенции, процедуры AITU, коммуникация, готовность и опыт по запросу')}</div>`, mentor.id, 'Подтвердить критерии') : ''}${role === 'department' && mentor.status === 'training' ? form('mentor-training', input('date', 'Дата инструктажа', 'date'), mentor.id, 'Подтвердить инструктаж') : ''}${role === 'director' && ['review', 'training'].includes(mentor.status) ? detail('Вернуть карточку', form('mentor-return', textarea('reason', 'Причина возврата'), mentor.id, 'Вернуть')) : ''}</article>`,
          )
          .join('') ||
        '<div class="empty">Новых карточек нет. Подайте заявку через кнопку сверху.</div>'
      }
    </div>
    <h2 style="margin-top:28px">Запросы наставляемых</h2>
    <div class="stack">
      ${
        state.requests
          .map(
            (record) =>
              `<article class="panel"><span class="step">${statuses[record.status]}</span><h3>${escapeHtml(record.name)}</h3><p>${escapeHtml(record.need)}</p><p class="hint">Цель: ${escapeHtml(record.goal)} · ${escapeHtml(record.period)} · ${escapeHtml(record.format)}</p><p class="hint">Навыки: ${(record.skills || []).map(skillName).map(escapeHtml).join(', ') || 'Нужна помощь с выбором'}</p>${
                role === 'director' && record.status === 'submitted'
                  ? form(
                      'pair-propose',
                      select(
                        'mentorId',
                        'Предложить наставника',
                        state.mentors
                          .filter((mentor) => mentor.status === 'published')
                          .map((mentor) => [mentor.id, mentor.name]),
                        record.mentorId,
                      ),
                      record.id,
                      'Предложить пару',
                    )
                  : ''
              }</article>`,
          )
          .join('') || '<div class="empty">Запросов пока нет.</div>'
      }
    </div>
  `;
}
