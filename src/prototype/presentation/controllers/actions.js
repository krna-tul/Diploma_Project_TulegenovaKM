import { demoMentors, demoEvents } from '../../domain/demo/catalog.js';
import { buildProgramReportCsv } from '../../application/export-program-report.js';
import { buildAnalyticsCsv } from '../../domain/demo/records.js';
import { readFormValues, queryElement } from '../dom.js';
import { roleLabels } from '../pages/meetings.js';
import {
  renderAccountHelp,
  renderArchiveRecord,
  renderMentorProfile,
  renderCourseEvidence,
  renderActivityDialog,
  renderEventDialog,
} from '../components/dialogs.js';
export function createActionHandlers({
  service,
  session,
  getContext,
  render,
  notify,
  openDialog,
  closeDialog,
  navigate,
  downloadCsv,
  refreshCourses,
}) {
  const requestValues = () => readFormValues(queryElement('[data-form=request]'));
  return {
    notifications() {
      navigate('notifications');
    },
    'read-notifications'() {
      service.markNotificationsRead();
      render();
    },
    'confirm-meeting'(button) {
      service.confirmMeeting(Number(button.dataset.id));
      notify('Meeting record confirmed.');
      render();
    },
    'decide-change'(button) {
      service.decideChange(Number(button.dataset.id), button.dataset.decision);
      notify('School decision saved.');
      render();
    },
    'confirm-appointment'() {
      service.confirmAppointment();
      notify('Appointment order recorded. The pair has ten working days to agree the plan.');
      render();
    },
    'final-tab'(button) {
      session.finalTab = button.dataset.tab;
      render();
    },
    'close-program'() {
      service.closeProgram();
      notify('Program marked as completed.');
      render();
    },
    'import-preview'() {
      session.importPreview = service.previewImport();
      render();
    },
    'import-apply'() {
      service.applyImport();
      notify('Valid rows imported. Import recorded in the audit log.');
      render();
    },
    'open-archive'(button) {
      service.openArchiveRecord(button.dataset.id);
      openDialog(renderArchiveRecord(button.dataset.id));
    },
    'export-analytics'() {
      downloadCsv(buildAnalyticsCsv(), 'aitu-program-analytics.csv');
      service.recordReportExport();
      notify('Analytics exported without personal details.');
    },
    'retry-delivery'() {
      notify('Delivery retry scheduled.');
    },
    forgot() {
      openDialog(renderAccountHelp());
    },
    'request-draft'() {
      service.saveRequest(requestValues());
      notify('Request draft saved.');
    },
    'mentor-draft'() {
      service.saveMentor(readFormValues(queryElement('[data-form=mentor]')));
      notify('Mentor profile draft saved.');
    },
    recommend() {
      service.prepareRecommendations(requestValues(), session.model);
      session.ranked = true;
      notify('Recommendations calculated from the selected skill.');
      navigate('mentors');
    },
    profile(button) {
      const mentorId = Number(button.dataset.id);
      openDialog(renderMentorProfile(demoMentors[mentorId], mentorId));
    },
    choose(button) {
      service.chooseMentor(Number(button.dataset.id));
      notify('Preferred mentor saved. This does not confirm an assignment.');
      closeDialog();
      navigate('request');
    },
    evidence(button) {
      const recommendation = getContext()
        .getRankedMentors()
        .find((mentor) => mentor.id === Number(button.dataset.id));
      if (recommendation?.best)
        openDialog(renderCourseEvidence(recommendation, session.model.threshold));
    },
    'add-activity'() {
      openDialog(renderActivityDialog());
    },
    'plan-draft'() {
      service.savePlanDraft();
      notify('Plan draft saved.');
      render();
    },
    'plan-submit'() {
      service.submitPlan();
      notify('Plan submitted. Open the School workspace to review it.');
      render();
    },
    'visit-tab'(button) {
      const form = queryElement('[data-form=visit]');
      if (form) service.saveVisitDraft(readFormValues(form));
      session.visitTab = button.dataset.tab;
      render();
    },
    'reset-courses'() {
      service.resetCourseAssignments();
      notify('Illustrative assignments restored.');
      refreshCourses();
    },
    event(button) {
      const eventId = Number(button.dataset.id);
      openDialog(
        renderEventDialog(
          demoEvents[eventId],
          eventId,
          service.getState().enrollments.includes(eventId),
        ),
      );
    },
    enroll(button) {
      service.registerInterest(Number(button.dataset.id));
      notify('Your interest has been saved locally.');
      closeDialog();
    },
    export() {
      downloadCsv(buildProgramReportCsv(service.getState()), 'aitu-program-report.csv');
      service.recordReportExport();
      notify('Report exported. Local audit entry recorded.');
    },
  };
}
export function createFormHandlers({ service, session, render, notify, closeDialog, navigate }) {
  return {
    signin() {
      session.role = 'mentee';
      navigate('overview');
      notify('Demo workspace opened. No password was stored or sent.');
    },
    request(values) {
      service.saveRequest(values, true);
      notify('Request submitted in the local demo.');
      navigate('overview');
    },
    mentor(values) {
      service.saveMentor(values, true);
      notify('Profile submitted for demo School review.');
    },
    activity(values) {
      service.addActivity(values);
      notify('Activity added. The updated plan requires a new review.');
      closeDialog();
      render();
    },
    visit(values) {
      service.saveVisit(session.visitTab, values);
      const stage = session.visitTab;
      notify(`${stage[0].toUpperCase() + stage.slice(1)} saved in this browser.`);
    },
    review(values, event) {
      service.reviewPlan(event.submitter?.value, values.comment);
      notify('School decision saved.');
      render();
    },
    feedback(values) {
      service.saveFeedback(values.feedback);
      notify('Feedback saved locally.');
    },
    change(values) {
      service.requestChange(values.change);
      notify('Change request saved locally.');
    },
    record(values, event) {
      const kind = event.target.dataset.kind;
      service.saveRecord(kind, values, roleLabels[session.role]);
      notify('Record saved.');
      render();
    },
    observation(values) {
      service.saveObservation(values);
      notify('Observation form saved.');
    },
    final(values, event) {
      service.saveFinal(event.target.dataset.part, values);
      notify('Saved.');
      render();
    },
    appointment(values) {
      service.appointMentor(values);
      notify('Appointment submitted for the vice-rector order.');
      render();
    },
    profile(values) {
      service.saveProfile(values);
      notify('Preferences saved.');
    },
  };
}
