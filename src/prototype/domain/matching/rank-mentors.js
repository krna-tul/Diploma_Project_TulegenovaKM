import { scoreCourseRelevance } from './logistic-regression.js';
export function getCourseOwner(course, assignments) {
  return Object.hasOwn(assignments, course.id) ? Number(assignments[course.id]) : course.mentor;
}
export function rankMentors({ mentors, model, skillId, assignments, sortByRelevance = true }) {
  const selectedSkill = model?.skills.find((skill) => skill.id === Number(skillId));
  const recommendations = mentors.map((mentor, id) => {
    let best = null;
    if (selectedSkill)
      for (const course of model.courses) {
        if (getCourseOwner(course, assignments) !== id) continue;
        const relevance = scoreCourseRelevance(model, selectedSkill, course);
        if (!best || relevance.probability > best.probability)
          best = {
            ...relevance,
            course,
          };
      }
    return {
      ...mentor,
      id,
      best,
    };
  });
  return recommendations.sort((first, second) =>
    sortByRelevance
      ? (second.best?.probability ?? -1) - (first.best?.probability ?? -1)
      : first.id - second.id,
  );
}
