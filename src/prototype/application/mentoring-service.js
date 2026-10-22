import { addPlanActivity, savePlanDraft, submitPlan, reviewPlan } from '../domain/demo/plan.js';
import { saveVisitStage } from '../domain/demo/visit.js';
export function createMentoringService({ store, now = () => new Date().toISOString() }) {
  const recordAction = (state, action) =>
    state.audit.push({
      action,
      at: now(),
    });
  const update = (change) => store.transact(change);
  function mergeRequest(state, values) {
    state.request = {
      ...state.request,
      area: values.area,
      goal: values.goal,
      mentor: values.mentor === '' ? '' : Number(values.mentor),
      ...(values.skill !== undefined
        ? {
            skill: Number(values.skill),
          }
        : {}),
    };
  }
  return {
    getState: store.getState,
    saveRequest(values, submit = false) {
      return update((state) => {
        mergeRequest(state, values);
        state.request.status = submit ? 'Submitted for School review' : 'Draft';
        if (submit) recordAction(state, 'Request submitted');
      });
    },
    prepareRecommendations(values, model) {
      return update((state) => {
        mergeRequest(state, values);
        if (!model?.skills.some((skill) => skill.id === state.request.skill))
          throw new Error('Select an available skill.');
      });
    },
    saveMentor(values, submit = false) {
      return update((state) => {
        state.mentor = {
          ...state.mentor,
          ...values,
        };
        if (submit) {
          state.mentor.status = 'Submitted for School review';
          recordAction(state, 'Mentor profile submitted');
        }
      });
    },
    chooseMentor(mentorId) {
      return update((state) => {
        state.request.mentor = mentorId;
      });
    },
    savePlanDraft() {
      return update((state) => savePlanDraft(state.plan));
    },
    addActivity(activity) {
      return update((state) => addPlanActivity(state.plan, activity));
    },
    submitPlan() {
      return update((state) => {
        submitPlan(state.plan);
        recordAction(state, 'Plan submitted for demo School review');
      });
    },
    reviewPlan(decision, comment) {
      return update((state) => {
        reviewPlan(state.plan, decision, comment);
        recordAction(state, 'Plan ' + decision);
      });
    },
    saveVisit(stage, values) {
      return update((state) => saveVisitStage(state.visit, stage, values));
    },
    saveVisitDraft(values) {
      return update((state) => Object.assign(state.visit, values));
    },
    saveFeedback(feedback) {
      return update((state) => {
        state.feedback = feedback;
      });
    },
    requestChange(reason) {
      return update((state) => {
        state.change = reason;
        recordAction(state, 'Change request saved');
      });
    },
    assignCourse(courseId, mentorId) {
      return update((state) => {
        state.assignments[courseId] = mentorId;
      });
    },
    resetCourseAssignments() {
      return update((state) => {
        state.assignments = {};
      });
    },
    registerInterest(eventId) {
      return update((state) => {
        if (!state.enrollments.includes(eventId)) state.enrollments.push(eventId);
      });
    },
    recordReportExport() {
      return update((state) =>
        recordAction(state, 'Exported administrative demo summary (no private visit notes)'),
      );
    },
  };
}
