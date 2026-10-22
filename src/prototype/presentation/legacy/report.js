import { html } from '../components/html-template.js';
import { summary } from '../../domain.js';
export function reportPage(viewContext) {
  const { state } = viewContext;
  const skill = summary(state);
  return html`
    <span class="eyebrow">Обзор программы</span>
    <h1>Обобщенные показатели</h1>
    <p class="lead">
      Руководство видит ход программы. Тексты частных наблюдений и рефлексии здесь не отображаются.
    </p>
    <div class="stats" style="margin-top:28px">
      ${Object.entries({
        Наставники: skill.published,
        Запросы: skill.requests,
        'Активные программы': skill.active,
        Завершенные: skill.completed,
      })
        .map(
          ([label, fieldName]) =>
            `<div class="stat"><strong>${fieldName}</strong><span>${label}</span></div>`,
        )
        .join('')}
    </div>
    <div class="panel">
      <h2>Границы демонстрации</h2>
      <p>
        Все записи синтетические и хранятся в одном браузере. Переключатель ролей позволяет
        проверить сценарии. Серверная авторизация и многопользовательская работа требуют следующего
        этапа.
      </p>
      <p class="hint">
        Часы наставничества: по положению 15 часов за одного наставляемого в триместр; здесь учет не
        заменяет индивидуальный план работы преподавателя.
      </p>
    </div>
  `;
}
