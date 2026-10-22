import {
  requireNonEmptyValue,
  requireScenarioRole,
  findRecord,
  requireValidDate,
} from '../validation.js';
import { mentorLoad } from '../queries.js';
import { addWorkingDays } from '../calendar.js';
export function pairPropose({ nextState, data, role, entityId, createId }) {
  requireScenarioRole(role, 'director');
  const request = findRecord(nextState.requests, entityId);
  if (request.status !== 'submitted') throw new Error('Запрос уже обработан.');
  const mentor = findRecord(nextState.mentors, data.mentorId);
  if (mentor.status !== 'published' || !mentor.trained)
    throw new Error('Кандидат должен пройти проверку и инструктаж.');
  if (request.name.trim().toLowerCase() === mentor.name.trim().toLowerCase())
    throw new Error('Нельзя назначить себя собственным наставником.');
  request.status = 'matching';
  nextState.pairs.push({
    id: createId(),
    requestId: entityId,
    mentorId: mentor.id,
    status: 'consents',
    consents: {
      mentor: false,
      mentee: false,
    },
    plan: {
      version: 1,
      items: [],
      consents: {
        mentor: false,
        mentee: false,
      },
      approved: false,
    },
    meetings: [],
    visits: [],
    evaluations: {},
    changeRequests: [],
  });
}
export function pairConsent({ role, getPair, requireParticipant }) {
  requireParticipant();
  const mentoringPair = getPair();
  if (mentoringPair.status !== 'consents') throw new Error('Согласование пары завершено.');
  mentoringPair.consents[role] = true;
}
export function pairDecline({ nextState, data, getPair, requireParticipant }) {
  requireParticipant();
  requireNonEmptyValue(data.reason, 'Причина отказа');
  const mentoringPair = getPair();
  if (mentoringPair.status !== 'consents') throw new Error('Используйте обращение о замене.');
  mentoringPair.status = 'ended';
  mentoringPair.reason = data.reason;
  findRecord(nextState.requests, mentoringPair.requestId).status = 'submitted';
}
export function pairPresent({ nextState, data, role, getPair }) {
  requireScenarioRole(role, 'director');
  const mentoringPair = getPair();
  if (
    mentoringPair.status !== 'consents' ||
    !mentoringPair.consents.mentor ||
    !mentoringPair.consents.mentee
  )
    throw new Error('Нужны согласия обеих сторон.');
  if (!data.noConflict) throw new Error('Подтвердите отсутствие конфликта интересов.');
  mentoringPair.noConflict = true;
  mentoringPair.exceptionReason = data.exceptionReason || '';
  mentoringPair.exceptionDirector = !!data.exceptionDirector;
  mentoringPair.exceptionMentor = !!data.exceptionMentor;
  if (
    mentorLoad(nextState, mentoringPair.mentorId) > 2 &&
    !(
      mentoringPair.exceptionReason.trim() &&
      mentoringPair.exceptionDirector &&
      mentoringPair.exceptionMentor
    )
  )
    throw new Error(
      'Лимит — два наставляемых. Для исключения нужны обоснование, согласие наставника и решение директора.',
    );
  mentoringPair.status = 'presented';
}
export function pairAppoint({ nextState, data, role, getPair }) {
  requireScenarioRole(role, 'rector');
  const mentoringPair = getPair();
  if (mentoringPair.status !== 'presented') throw new Error('Сначала представление директора.');
  requireNonEmptyValue(data.number, 'Номер распоряжения');
  requireValidDate(data.date, 'Дата распоряжения');
  requireValidDate(data.end, 'Конец периода');
  if (data.end <= data.date) throw new Error('Конец периода должен быть после назначения.');
  if (
    mentorLoad(nextState, mentoringPair.mentorId) > 2 &&
    !(
      mentoringPair.exceptionReason.trim() &&
      mentoringPair.exceptionDirector &&
      mentoringPair.exceptionMentor
    )
  )
    throw new Error('Превышена нагрузка наставника.');
  mentoringPair.appointment = {
    number: data.number,
    date: data.date,
    end: data.end,
    authority: 'Проректор по академической работе',
  };
  mentoringPair.planDeadline = addWorkingDays(data.date, 10);
  mentoringPair.status = 'planning';
}
export function pairComplete({ role, getActivePair }) {
  requireScenarioRole(role, 'director');
  const mentoringPair = getActivePair();
  if (!mentoringPair.evaluations.final?.mentor || !mentoringPair.evaluations.final?.mentee)
    throw new Error('Нужны итоговый отзыв наставника и самооценка наставляемого.');
  mentoringPair.status = 'completed';
}
