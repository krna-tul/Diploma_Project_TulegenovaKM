import { mentorSubmit, mentorReview, mentorReturn, mentorTraining } from './commands/mentors.js';
import { requestSubmit } from './commands/requests.js';
import {
  pairPropose,
  pairConsent,
  pairDecline,
  pairPresent,
  pairAppoint,
  pairComplete,
} from './commands/pairs.js';
import {
  planReturn,
  meetingConfirm,
  planSave,
  planItem,
  planConsent,
  planApprove,
  itemComplete,
  meetingAdd,
} from './commands/plans.js';
import { visitPrepare, visitObserve, visitReflect } from './commands/visits.js';
import { evaluationSave } from './commands/evaluations.js';
import { changeRequest, changeResolve } from './commands/changes.js';
import { eventEnroll } from './commands/events.js';
import { findRecord } from './validation.js';
const commands = {
  'mentor-submit': mentorSubmit,
  'mentor-review': mentorReview,
  'mentor-return': mentorReturn,
  'mentor-training': mentorTraining,
  'request-submit': requestSubmit,
  'pair-propose': pairPropose,
  'pair-consent': pairConsent,
  'pair-decline': pairDecline,
  'pair-present': pairPresent,
  'pair-appoint': pairAppoint,
  'pair-complete': pairComplete,
  'plan-return': planReturn,
  'meeting-confirm': meetingConfirm,
  'plan-save': planSave,
  'plan-item': planItem,
  'plan-consent': planConsent,
  'plan-approve': planApprove,
  'item-complete': itemComplete,
  'meeting-add': meetingAdd,
  'visit-prepare': visitPrepare,
  'visit-observe': visitObserve,
  'visit-reflect': visitReflect,
  'evaluation-save': evaluationSave,
  'change-request': changeRequest,
  'change-resolve': changeResolve,
  'event-enroll': eventEnroll,
};
export function transition(state, action, data = {}, role = 'teacher', dependencies = {}) {
  const nextState = structuredClone(state);
  const entityId = data.id;
  const createId = dependencies.createId || (() => globalThis.crypto.randomUUID());
  const now = dependencies.now || (() => new Date().toISOString());
  const getPair = () => findRecord(nextState.pairs, entityId);
  const requireParticipant = () => {
    if (!['mentor', 'mentee'].includes(role)) throw new Error('Действие доступно участникам пары.');
  };
  const getActivePair = () => {
    const mentoringPair = getPair();
    if (mentoringPair.status !== 'active')
      throw new Error('Сначала утвердите индивидуальный план.');
    return mentoringPair;
  };
  if (!Object.hasOwn(commands, action)) throw new Error('Неизвестное действие.');
  commands[action]({
    nextState,
    data,
    role,
    entityId,
    createId,
    now,
    getPair,
    getActivePair,
    requireParticipant,
  });
  nextState.audit.push({
    action,
    entityId: entityId || null,
    role,
    at: now(),
  });
  return nextState;
}
