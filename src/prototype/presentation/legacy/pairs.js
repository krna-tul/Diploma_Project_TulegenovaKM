import { html } from '../components/html-template.js';
import {
  btn as renderButton,
  detail,
  form,
  textarea,
  check,
  input,
  esc as escapeHtml,
  date,
} from './components.js';
export function pairControls(viewContext, mentoringPair) {
  const { role } = viewContext;
  if (mentoringPair.status === 'consents')
    return html`
      <p>
        Наставник: ${mentoringPair.consents.mentor ? 'согласен' : 'ожидается согласие'} ·
        Наставляемый: ${mentoringPair.consents.mentee ? 'согласен' : 'ожидается согласие'}
      </p>
      ${['mentor', 'mentee'].includes(role) ? `<div class="actions">${renderButton('pair-consent', mentoringPair.id, 'Согласиться на пару')}</div>${detail('Отказаться', form('pair-decline', textarea('reason', 'Причина отказа'), mentoringPair.id, 'Отказаться'))}` : ''}${role === 'director' ? form('pair-present', `<div class="wide">${check('noConflict', 'Проверено отсутствие конфликта интересов')}</div>` + textarea('exceptionReason', 'Обоснование увеличения нагрузки', '', false) + `<div class="wide">${check('exceptionDirector', 'Директор согласовал превышение лимита')}${check('exceptionMentor', 'Получено согласие наставника на увеличенную нагрузку')}</div>`, mentoringPair.id, 'Представить на назначение') : ''}
    `;
  if (mentoringPair.status === 'presented')
    return role === 'rector'
      ? form(
          'pair-appoint',
          input('number', 'Номер распоряжения проректора') +
            input('date', 'Дата назначения', 'date') +
            input('end', 'Конец периода', 'date'),
          mentoringPair.id,
          'Зарегистрировать распоряжение',
        )
      : '<p class="hint">Ожидается оформление распоряжения проректора по академической работе.</p>';
  return mentoringPair.appointment
    ? html`
        <p class="hint">
          Распоряжение № ${escapeHtml(mentoringPair.appointment.number)} от
          ${date(mentoringPair.appointment.date)} · Период до ${date(mentoringPair.appointment.end)}
          <br />
          План подготовить до ${date(mentoringPair.planDeadline)} (10 дней пн–пт, без учета
          праздников).
        </p>
        <div class="actions">
          <button data-pair="${mentoringPair.id}">Открыть план и работу пары →</button>
        </div>
      `
    : html`
        <p class="hint">
          ${escapeHtml(mentoringPair.reason || 'Программа завершена без назначения.')}
        </p>
      `;
}
export function pairsPage(viewContext) {
  const { state, statuses } = viewContext;
  return html`
    <span class="eyebrow">Маршрут наставничества</span>
    <h1>Пары и индивидуальные планы</h1>
    <p class="lead">
      Согласия → представление директора → распоряжение → совместный план → работа и оценка.
    </p>
    <div class="stack" style="margin-top:28px">
      ${
        state.pairs
          .map((item) => {
            const mentor = state.mentors.find(
                (candidateMentor) => candidateMentor.id === item.mentorId,
              ),
              record = state.requests.find((recordValue) => recordValue.id === item.requestId);
            return `<article class="panel"><span class="step">${statuses[item.status]}</span><h3>${escapeHtml(mentor.name)} → ${escapeHtml(record.name)}</h3><p class="hint">${escapeHtml(record.goal)}</p>${pairControls(viewContext, item)}</article>`;
          })
          .join('') ||
        '<div class="empty">Пары появятся после подбора Школой. Начните с запроса и роли директора.</div>'
      }
    </div>
  `;
}
