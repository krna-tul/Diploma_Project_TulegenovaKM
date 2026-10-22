export function mentorLoad(state, entityId) {
  return state.pairs.filter(
    (mentoringPair) =>
      mentoringPair.mentorId === entityId && !['completed', 'ended'].includes(mentoringPair.status),
  ).length;
}
export function summary(state) {
  return {
    published: state.mentors.filter((mentor) => mentor.status === 'published').length,
    requests: state.requests.length,
    active: state.pairs.filter((mentoringPair) => mentoringPair.status === 'active').length,
    completed: state.pairs.filter((mentoringPair) => mentoringPair.status === 'completed').length,
  };
}
