import { seededMeetings } from './records.js';
export const createInitialState = () => ({
  request: {
    area: 'Teaching methods and lesson design',
    goal: 'I would like to make my practical classes more interactive and develop strategies for engaging students with different learning needs.',
    mentor: 0,
    status: 'Not started',
  },
  mentor: {
    name: 'Aigerim S.',
    school: 'School of Computing',
    expertise: 'Active learning · Lesson design · Assessment',
    approach: '',
    format: 'Meetings and Development Visits',
    capacity: '2',
  },
  plan: {
    status: 'Draft',
    version: 1,
    items: [
      {
        task: 'Design an interactive practical class',
        note: 'Active learning and differentiation',
        date: '2026-10-30',
        result: 'Revised lesson plan',
      },
      {
        task: 'Complete a Development Visit',
        note: 'Observe, reflect and discuss',
        date: '2026-11-13',
        result: 'Observation and reflection',
      },
      {
        task: 'Review student feedback',
        note: 'Identify improvements for the next cycle',
        date: '2026-12-04',
        result: 'Agreed next steps',
      },
    ],
    history: [],
  },
  visit: {
    course: 'Programming Fundamentals — Practical class',
    date: '2026-11-13',
    location: '10:00 · Room 302',
    focus:
      'Student engagement, active learning and differentiation. Record specific observations and timestamps during the visit.',
  },
  assignments: {},
  enrollments: [],
  audit: [],
  records: {
    meetings: structuredClone(seededMeetings),
    interim: [],
    changes: [],
    confidential: [],
    support: [],
    references: [],
  },
  appointment: { status: 'Not started' },
  appointments: [
    { mentee: 'Timur A.', mentor: 1 },
    { mentee: 'Arman Zh.', mentor: 1 },
    { mentee: 'Dana M.', mentor: 2 },
  ],
  observation: {},
  final: { checklist: [], self: {}, review: {}, closed: false },
  profile: {
    name: 'Alina K.',
    position: 'Senior lecturer',
    school: 'School of Computing',
    email: 'a.kenzhebaeva@astanait.edu.kz',
    channel: 'Email and in-app',
  },
  imported: [],
  notificationsRead: false,
});
export const withDefaults = (saved) => ({ ...createInitialState(), ...saved });
