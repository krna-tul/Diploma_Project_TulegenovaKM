import { demoMentors, demoEvents } from '../../domain/demo/catalog.js';
import { buildProgramReportCsv } from '../../application/export-program-report.js';
import { readFormValues, queryElement } from '../dom.js';
import {
  renderAccountHelp,
  renderNotifications,
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
      openDialog(renderNotifications(service.getState()));
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
  };
}
