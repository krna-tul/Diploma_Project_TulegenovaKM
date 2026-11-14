import { addPlanActivity, savePlanDraft, submitPlan, reviewPlan } from '../domain/demo/plan.js';
import { saveVisitStage } from '../domain/demo/visit.js';
import {
  createRecord,
  getMentorWorkload,
  checkAppointment,
  validateImportRows,
  demoImportRows,
  existingStaffEmails,
} from '../domain/demo/records.js';
import { demoMentors } from '../domain/demo/catalog.js';
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
    saveRecord(kind, values, author) {
      return update((state) => {
        state.records[kind].unshift(createRecord(kind, values, author, now()));
        recordAction(state, `Record saved: ${kind}`);
      });
    },
    confirmMeeting(index) {
      return update((state) => {
        const meeting = state.records.meetings[index];
        if (!meeting) throw new Error('Meeting record not found.');
        meeting.confirmed = true;
        recordAction(state, 'Meeting record confirmed');
      });
    },
    decideChange(index, decision) {
      return update((state) => {
        const change = state.records.changes[index];
        if (!change) throw new Error('Change request not found.');
        change.status = decision;
        recordAction(state, `Change request ${decision.toLowerCase()}`);
      });
    },
    appointMentor(values) {
      return update((state) => {
        const mentor = Number(values.mentor);
        checkAppointment(
          getMentorWorkload(demoMentors, state.appointments),
          mentor,
          values.approval === 'on',
        );
        state.appointments.push({ mentee: values.mentee, mentor });
        state.appointment = { ...values, mentor, status: 'Pending' };
        recordAction(state, 'Mentor appointment submitted for approval');
      });
    },
    confirmAppointment() {
      return update((state) => {
        if (state.appointment.status !== 'Pending') throw new Error('Submit an appointment first.');
        state.appointment.status = 'Confirmed';
        recordAction(state, 'Mentor appointment confirmed');
      });
    },
    saveObservation(values) {
      return update((state) => {
        if (!values.teacher?.trim() || !values.topic?.trim())
          throw new Error('Fill in the teacher and the lesson topic.');
        state.observation = values;
        recordAction(state, 'Observation form saved');
      });
    },
    saveFinal(part, values) {
      return update((state) => {
        if (part === 'checklist') state.final.checklist = Object.keys(values);
        else if (!Object.values(values).some((value) => String(value).trim()))
          throw new Error('Fill in at least one field.');
        else state.final[part] = values;
        recordAction(state, `Final stage saved: ${part}`);
      });
    },
    closeProgram() {
      return update((state) => {
        if (!state.final.self.progress || !state.final.review.progress)
          throw new Error('Both the self-assessment and the mentor review are required.');
        state.final.closed = true;
        recordAction(state, 'Program marked as completed');
      });
    },
    saveProfile(values) {
      return update((state) => {
        state.profile = { ...state.profile, ...values };
      });
    },
    previewImport() {
      return validateImportRows(demoImportRows, existingStaffEmails);
    },
    applyImport() {
      return update((state) => {
        const rows = validateImportRows(demoImportRows, existingStaffEmails).filter(
          (row) => row.valid,
        );
        state.imported = rows;
        recordAction(state, `Staff import applied: ${rows.length} records`);
      });
    },
    openArchiveRecord(id) {
      return update((state) => recordAction(state, `Archive record opened: ${id}`));
    },
    markNotificationsRead() {
      return update((state) => {
        state.notificationsRead = true;
      });
    },
    recordReportExport() {
      return update((state) =>
        recordAction(state, 'Exported administrative demo summary (no private visit notes)'),
      );
    },
  };
}
