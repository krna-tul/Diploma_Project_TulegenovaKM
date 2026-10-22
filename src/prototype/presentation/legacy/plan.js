import { html } from '../components/html-template.js';
import { pairsPage } from './pairs.js';
import {
  esc as escapeHtml,
  date,
  detail,
  form,
  textarea,
  input,
  select,
  hidden,
  btn as renderButton,
  check,
} from './components.js';
export function planPage(viewContext) {
  const { state, pairId, role, statuses, formats, names } = viewContext;
  const mentoringPair = state.pairs.find((item) => item.id === pairId);
  if (!mentoringPair) return pairsPage(viewContext);
  const record = state.requests.find((recordValue) => recordValue.id === mentoringPair.requestId);
  const participant = ['mentor', 'mentee'].includes(role);
  const editable = ['planning', 'active'].includes(mentoringPair.status);
  return html`
    <span class="eyebrow">${escapeHtml(statuses[mentoringPair.status])}</span>
    <h1>Индивидуальный план</h1>
    <p class="lead">${escapeHtml(record.name)} · ${escapeHtml(record.goal)}</p>
    <p class="hint">
      Версия ${mentoringPair.plan.version} · Срок подготовки: ${date(mentoringPair.planDeadline)} ·
      Период: ${date(mentoringPair.appointment.date)} — ${date(mentoringPair.appointment.end)}
    </p>
    <section class="panel">
      <h2>Цели и организация</h2>
      <p>${escapeHtml(mentoringPair.plan.goal || 'Цель еще не определена')}</p>
      <p class="hint">
        ${escapeHtml(mentoringPair.plan.format || '')} ·
        ${escapeHtml(mentoringPair.plan.frequency || '')} · Рекомендуется встречаться не реже одного
        раза в две недели.
      </p>
      ${participant && editable ? detail('Разработать или изменить план', form('plan-save', textarea('goal', 'Цель плана', mentoringPair.plan.goal || record.goal) + input('frequency', 'Периодичность встреч', 'text', mentoringPair.plan.frequency || 'Один раз в две недели') + select('format', 'Формат встреч', formats, mentoringPair.plan.format), mentoringPair.id, 'Сохранить новую версию')) : ''}
      <h3>Мероприятия и задачи</h3>
      ${mentoringPair.plan.items.map((index) => `<div class="item"><strong>${index.done ? '✓ ' : ''}${escapeHtml(index.task)}</strong><p class="hint">До ${date(index.due)} · Поддержка: ${escapeHtml(index.support)}</p><p>Ожидаемый результат: ${escapeHtml(index.expected)}</p><p class="hint">Фиксация прогресса: ${escapeHtml(index.evidence)}</p>${index.result ? `<p>Достигнуто: ${escapeHtml(index.result)}</p>` : ''}${participant && mentoringPair.status === 'active' && !index.done ? detail('Зафиксировать результат', form('item-complete', hidden('itemId', index.id) + textarea('result', 'Достигнутый результат'), mentoringPair.id, 'Завершить задачу')) : ''}</div>`).join('') || '<p class="hint">Добавьте хотя бы одну задачу с результатом и сроком.</p>'}${participant && editable ? detail('Добавить мероприятие в план', form('plan-item', textarea('task', 'Задача') + input('due', 'Срок', 'date') + textarea('support', 'Форма поддержки наставника') + textarea('expected', 'Ожидаемый результат') + textarea('evidence', 'Способ фиксации прогресса'), mentoringPair.id, 'Добавить задачу')) : ''}
      <p class="hint">
        Согласование версии: наставник ${mentoringPair.plan.consents.mentor ? '✓' : '—'},
        наставляемый ${mentoringPair.plan.consents.mentee ? '✓' : '—'} ·
        ${mentoringPair.plan.approved ? 'Утвержден директором' : 'Ожидает утверждения'}
      </p>
      <div class="actions">
        ${participant && mentoringPair.status === 'planning' ? renderButton('plan-consent', mentoringPair.id, 'Согласовать эту версию') : ''}${role === 'director' && mentoringPair.status === 'planning' ? renderButton('plan-approve', mentoringPair.id, 'Утвердить план') : ''}
      </div>
      ${mentoringPair.planHistory?.length ? detail('История утвержденных версий', mentoringPair.planHistory.map((value) => `<div class="item">Версия ${value.version}: ${escapeHtml(value.goal)} · ${value.items.length} задач</div>`).join('')) : ''}
    </section>
    ${
      mentoringPair.status === 'active' && participant
        ? `<section class="panel" style="margin-top:20px"><h2>Встречи и прогресс</h2>${detail('Зафиксировать встречу', form('meeting-add', input('date', 'Дата встречи', 'date') + select('format', 'Формат', formats) + textarea('result', 'Обобщенный результат для плана'), mentoringPair.id))}${mentoringPair.meetings.map((mentor) => `<div class="item">${date(mentor.date)} · ${escapeHtml(mentor.format)}<p>${escapeHtml(mentor.result)}</p></div>`).join('') || '<p class="hint">Встречи еще не зафиксированы.</p>'}</section><section class="panel private" style="margin-top:20px"><h2>Development Visit</h2><p class="hint">Частные наблюдения пары. Записывайте факты без вмешательства в занятие. Рекомендуется 2–3 фокуса.</p>${detail(
            '1. Подготовить визит',
            form(
              'visit-prepare',
              textarea('purpose', 'Цель визита') +
                input('course', 'Дисциплина') +
                input('topic', 'Тема занятия') +
                input('date', 'Дата', 'date') +
                input('time', 'Время', 'time') +
                input('location', 'Место') +
                select(
                  'lessonType',
                  'Тип занятия',
                  ['Лекция', 'Практическое', 'Лабораторное', 'Семинар', 'Другое'].map((value) => [
                    value,
                    value,
                  ]),
                ) +
                textarea('objectives', 'Цели занятия') +
                textarea('outcomes', 'Планируемые результаты обучения') +
                input('students', 'Количество обучающихся', 'number') +
                textarea('group', 'Особенности группы и оснащение') +
                textarea('focus', 'Фокус наблюдения') +
                `<div class="wide">${check('criteriaShared', 'Наставляемый ознакомлен с критериями карты наблюдения')}</div>`,
              mentoringPair.id,
              'Подготовить визит',
            ),
          )}${mentoringPair.visits.map((value) => visitCard(viewContext, mentoringPair, value)).join('')}</section><section class="panel private" style="margin-top:20px"><h2>Оценка развития</h2><p class="hint">В начале — ожидания и цели; в середине — обратная связь; в конце — самооценка и отзыв.</p>${form(
            'evaluation-save',
            select('stage', 'Этап', [
              ['start', 'Начало'],
              ['middle', 'Середина'],
              ['final', 'Итог'],
            ]) +
              textarea(
                'text',
                role === 'mentor' ? 'Краткий отзыв наставника' : 'Самооценка наставляемого',
              ),
            mentoringPair.id,
          )}${Object.entries(mentoringPair.evaluations)
            .map(
              ([stage, value]) =>
                `<div class="item"><strong>${
                  {
                    start: 'Начало',
                    middle: 'Середина',
                    final: 'Итог',
                  }[stage]
                }</strong>${Object.entries(value)
                  .map(([who, text]) => `<p>${names[who]}: ${escapeHtml(text)}</p>`)
                  .join('')}</div>`,
            )
            .join('')}</section>`
        : ''
    }
    ${role === 'director' && mentoringPair.status === 'active' ? `<section class="panel" style="margin-top:20px"><h2>Завершение программы</h2><p class="hint">Итоговая самооценка: ${mentoringPair.evaluations.final?.mentee ? 'получена' : 'ожидается'} · Отзыв наставника: ${mentoringPair.evaluations.final?.mentor ? 'получен' : 'ожидается'}</p>${renderButton('pair-complete', mentoringPair.id, 'Завершить программу')}</section>` : ''}
    <section class="panel" style="margin-top:20px">
      <h2>Обращения участников</h2>
      <p class="hint">
        Замена или досрочное завершение не рассматриваются как профессиональный неуспех.
      </p>
      ${
        participant && !['completed', 'ended'].includes(mentoringPair.status)
          ? detail(
              'Подать обращение',
              form(
                'change-request',
                select('type', 'Тип', [
                  ['replacement', 'Замена наставника'],
                  ['ending', 'Досрочное завершение'],
                ]) + textarea('reason', 'Причина обращения'),
                mentoringPair.id,
                'Отправить в Школу',
              ),
            )
          : ''
      }${mentoringPair.changeRequests.map((changeRequest) => `<div class="item">${changeRequest.type === 'replacement' ? 'Замена' : 'Досрочное завершение'} · ${escapeHtml(changeRequest.status)}<p>${escapeHtml(changeRequest.reason)}</p>${changeRequest.decision ? `<p>Решение: ${escapeHtml(changeRequest.decision)}</p>` : ''}${role === 'director' && changeRequest.status === 'pending' ? form('change-resolve', hidden('changeId', changeRequest.id) + textarea('reason', 'Решение Школы') + `<div class="wide">${check('end', 'Прекратить текущую пару и вернуть запрос на подбор')}</div>`, mentoringPair.id, 'Зафиксировать решение') : ''}</div>`).join('') || '<p class="hint">Обращений нет.</p>'}
    </section>
  `;
}
export function visitCard(viewContext, item, visit) {
  const { role, criteria } = viewContext;
  return html`
    <article class="item">
      <h3>${escapeHtml(visit.topic)} · ${date(visit.date)}</h3>
      <p>
        ${escapeHtml(visit.course)} · ${escapeHtml(visit.lessonType)} ·
        ${escapeHtml(visit.location)} · ${escapeHtml(visit.time)}
      </p>
      <p>
        Цель: ${escapeHtml(visit.purpose)}
        <br />
        Фокус: ${escapeHtml(visit.focus)}
      </p>
      <p class="hint">
        Контекст: ${escapeHtml(visit.objectives)} · ${escapeHtml(visit.outcomes)} ·
        ${escapeHtml(visit.group)} · ${escapeHtml(visit.students)} обучающихся
      </p>
      ${visit.observations.map((o) => `<div class="item"><strong>${escapeHtml(o.timestamp)} · ${escapeHtml(o.criterion)}</strong><p>Преподаватель: ${escapeHtml(o.teacherAction)}</p><p>Обучающиеся: ${escapeHtml(o.studentAction)}</p><p class="hint">${escapeHtml(o.comment)}</p></div>`).join('')}${
        role === 'mentor' && visit.status !== 'complete'
          ? detail(
              '2. Добавить наблюдение',
              form(
                'visit-observe',
                hidden('visitId', visit.id) +
                  input('timestamp', 'Таймкод, мм:сс') +
                  select(
                    'criterion',
                    'Критерий',
                    criteria.map((value) => [value, value]),
                  ) +
                  textarea('teacherAction', 'Наблюдаемое действие преподавателя') +
                  textarea('studentAction', 'Действия обучающихся') +
                  textarea('comment', 'Комментарии и вопросы', '', false),
                item.id,
                'Добавить факт',
              ),
            )
          : ''
      }${
        visit.status !== 'complete'
          ? detail(
              '3. Зафиксировать совместное обсуждение',
              form(
                'visit-reflect',
                hidden('visitId', visit.id) +
                  textarea('selfAnalysis', 'Краткий самоанализ наставляемого') +
                  textarea('plus', 'Сильные стороны занятия') +
                  textarea('question', 'Вопрос для профессионального обсуждения') +
                  textarea('recommendation', 'Рекомендация наставника') +
                  textarea('change', 'Изменения плана следующего занятия') +
                  textarea('measurement', 'Как измерить эффект изменения') +
                  textarea('observerReflection', 'Итоговая рефлексия наблюдателя') +
                  `<div class="wide">${check('shared', 'Карта обсуждена с наставляемым')}</div>`,
                item.id,
                'Завершить обсуждение',
              ),
            )
          : `<p class="tag">Визит завершен</p>${Object.entries({
              selfAnalysis: 'Самоанализ',
              plus: 'Плюс',
              question: 'Вопрос',
              recommendation: 'Рекомендация',
              change: 'Следующий шаг',
              measurement: 'Измерение',
              observerReflection: 'Рефлексия наблюдателя',
            })
              .map(
                ([key, label]) =>
                  `<p><strong>${label}:</strong> ${escapeHtml(visit.reflection[key])}</p>`,
              )
              .join('')}`
      }
    </article>
  `;
}
