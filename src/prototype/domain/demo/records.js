export const MENTOR_LIMIT = 2;
export const HOURS_PER_MENTEE = 15;

export const programStages = [
  ['Draft request', 'Mentee'],
  ['Submitted', 'Mentee'],
  ['Matching', 'School'],
  ['Appointment pending', 'School director'],
  ['Mentor assigned', 'Vice-rector'],
  ['Plan draft', 'Mentor and mentee'],
  ['Plan approval', 'School director'],
  ['Active', 'Mentor and mentee'],
  ['Change request', 'School'],
  ['Final review', 'Mentor and mentee'],
  ['Completed', 'School'],
  ['Archived', 'Program administrator'],
];

export function getProgramStage(state) {
  if (state.final?.closed) return 'Completed';
  if ((state.records?.changes || []).some((change) => change.status === 'Submitted'))
    return 'Change request';
  if (state.plan.status === 'Approved') return 'Active';
  if (state.plan.status === 'Needs review') return 'Plan approval';
  if (state.appointment?.status === 'Confirmed') return 'Plan draft';
  if (state.appointment?.status === 'Pending') return 'Appointment pending';
  if (state.request.status === 'Submitted for School review') return 'Submitted';
  return 'Draft request';
}

export const changeTypes = [
  'Mentor replacement',
  'Program extension',
  'Program shortening',
  'Early completion',
];
export const meetingFormats = ['In person', 'Online', 'Blended'];
export const lessonTypes = ['Lecture', 'Practical class', 'Laboratory class', 'Seminar', 'Other'];

export const observationCriteria = [
  [
    'A',
    'Lesson organization and structure',
    [
      'Logical structure of the lesson',
      'Coherence between lesson stages',
      'Time management',
      'Achievement of the objectives of each lesson stage',
    ],
  ],
  [
    'B',
    'Teaching methods and technologies',
    [
      'Use of active and interactive teaching methods',
      'Use of digital technologies/tools',
      'Differentiation and consideration of learning needs',
      'Alignment of methods with the lesson objectives and outcomes',
    ],
  ],
  [
    'C',
    'Student engagement',
    [
      'Student activity',
      'Teacher–student interaction',
      'Student–student interaction',
      'Level of participation of the majority of students',
    ],
  ],
  [
    'D',
    'Assessment and feedback',
    ['Formative assessment', 'Teacher feedback', 'Student reflection'],
  ],
];

export const effectivenessChecklist = [
  'The individual plan was completed',
  'Meetings took place at least once every two weeks',
  'A Development Visit was completed and discussed',
  'The mentee feels more confident in teaching',
  'The mentee uses new methods or digital tools',
  'Interim feedback led to plan adjustments',
];

const required = {
  meetings: ['date', 'format', 'topic', 'result'],
  interim: ['working', 'adjustments'],
  changes: ['type', 'reason'],
  confidential: ['topic', 'message'],
  support: ['category', 'description'],
  references: ['list', 'value'],
};

export function validateRecord(kind, values) {
  for (const field of required[kind] || [])
    if (!String(values[field] ?? '').trim()) throw new Error('Fill in all required fields.');
  if (kind === 'meetings' && !/^\d{4}-\d{2}-\d{2}$/.test(values.date))
    throw new Error('Choose the meeting date.');
}

export function createRecord(kind, values, author, at) {
  validateRecord(kind, values);
  const record = { ...values, author, at };
  if (kind === 'meetings') record.confirmed = false;
  if (kind === 'changes') record.status = 'Submitted';
  if (kind === 'confidential') record.status = 'Restricted';
  if (kind === 'support') record.status = 'Open';
  return record;
}

export function getMentorWorkload(mentors, appointments) {
  return mentors.map((mentor, id) => {
    const mentees = appointments.filter((item) => item.mentor === id).length;
    return {
      id,
      name: mentor.name,
      school: mentor.school,
      mentees,
      hours: mentees * HOURS_PER_MENTEE,
      available: mentees < MENTOR_LIMIT,
    };
  });
}

export function checkAppointment(workload, mentorId, directorApproval) {
  const mentor = workload[mentorId];
  if (!mentor) throw new Error('Choose a mentor.');
  if (!mentor.available && !directorApproval)
    throw new Error('This mentor already supports two mentees. Director approval is required.');
}

export function validateImportRows(rows, existingEmails = []) {
  const seen = new Set(existingEmails.map((email) => email.toLowerCase()));
  return rows.map((row, index) => {
    const email = String(row.email || '').toLowerCase();
    let issue = '';
    if (!row.name || !row.school || !email) issue = 'Missing required field';
    else if (!/^[^@\s]+@astanait\.edu\.kz$/.test(email)) issue = 'Invalid corporate email';
    else if (seen.has(email)) issue = 'Duplicate record';
    if (email) seen.add(email);
    return { ...row, line: index + 2, issue, valid: !issue };
  });
}

export const demoImportRows = [
  { name: 'Aruzhan B.', school: 'School of Computing', email: 'a.bekova@astanait.edu.kz' },
  { name: 'Yerlan T.', school: 'School of Engineering', email: 'y.tokhtarov@astanait.edu.kz' },
  { name: 'Saule R.', school: '', email: 's.rakhimova@astanait.edu.kz' },
  { name: 'Nurlan O.', school: 'School of Computing', email: 'nurlan.o@gmail.com' },
  { name: 'Aigerim S.', school: 'School of Computing', email: 'a.serikova@astanait.edu.kz' },
  { name: 'Aruzhan B.', school: 'School of Computing', email: 'a.bekova@astanait.edu.kz' },
];
export const existingStaffEmails = ['a.serikova@astanait.edu.kz'];

export const demoMenteeQueue = [
  { name: 'Alina K.', school: 'School of Computing', area: 'Teaching methods and lesson design' },
  { name: 'Ruslan M.', school: 'School of Engineering', area: 'Assessment and feedback' },
  { name: 'Zhanel S.', school: 'School of Computing', area: 'Digital tools in teaching' },
];

export const seededMeetings = [
  {
    date: '2026-10-14',
    format: 'In person',
    topic: 'Goals and individual plan',
    result: 'Agreed three goals and a meeting schedule',
    planItem: '1',
    author: 'Mentor',
    at: '2026-10-14T11:20:00.000Z',
    confirmed: true,
  },
  {
    date: '2026-10-28',
    format: 'Online',
    topic: 'Interactive practical class design',
    result: 'Drafted a group activity for week 9',
    planItem: '1',
    author: 'Mentee',
    at: '2026-10-28T15:05:00.000Z',
    confirmed: false,
  },
];

export const demoNotifications = [
  ['2026-11-04', 'Plan', 'Your development plan is waiting for School approval.'],
  ['2026-11-03', 'Meeting', 'Please confirm the meeting record from 28 October.'],
  ['2026-11-01', 'Reminder', 'Interim feedback is due by 20 November.'],
  ['2026-10-20', 'Appointment', 'Your mentor appointment has been confirmed.'],
];

export const referenceLists = {
  Schools: [
    'School of Computing',
    'School of Engineering',
    'School of Creative Industries',
    'School of General Education',
  ],
  'Development areas': [
    'Teaching methods and lesson design',
    'Assessment and feedback',
    'Digital tools in teaching',
    'Research and Action Research',
  ],
  'Meeting formats': meetingFormats,
  'Change request types': changeTypes,
};

export const demoArchive = [
  ['ARC-2025-014', 'Dana M. / Madina K.', 'School of Computing', '2026-06-30'],
  ['ARC-2025-009', 'Arman Zh. / Daniyar N.', 'School of Engineering', '2026-06-27'],
  ['ARC-2025-003', 'Ainur S. / Aigerim S.', 'School of Computing', '2026-01-15'],
];

export const seededAudit = [
  ['2026-11-04 09:12', 'School coordinator', 'Mentor appointment submitted for approval'],
  ['2026-11-03 16:40', 'Program administrator', 'Reference list updated: Development areas'],
  ['2026-11-02 10:05', 'Program administrator', 'Archive record opened: ARC-2025-014'],
  ['2026-11-01 08:30', 'System', 'Reminder sent: interim feedback'],
];

export const analyticsBySchool = [
  ['School of Computing', 14, 11, 4],
  ['School of Engineering', 8, 6, 2],
  ['School of Creative Industries', 4, 3, 1],
  ['School of General Education', 5, 4, 0],
];
export const analyticsByArea = [
  ['Teaching methods and lesson design', 12],
  ['Assessment and feedback', 8],
  ['Digital tools in teaching', 7],
  ['Research and Action Research', 4],
];

export const integrations = [
  ['Single sign-on (SSO)', 'Connected', '2026-11-05 08:00'],
  ['HR system', 'Connected', '2026-11-05 06:00'],
  ['Corporate email', 'Delivery errors', '2026-11-05 09:14'],
  ['Digital signature (EDS)', 'Not configured', '—'],
  ['Backup', 'Connected', '2026-11-05 03:00'],
];

export const deliveryErrors = [
  ['2026-11-05 09:14', 'Email', 'a.***@astanait.edu.kz', 'Mailbox unavailable'],
  ['2026-11-04 18:02', 'Email', 'r.***@astanait.edu.kz', 'Timeout'],
];

export const technicalLogs = [
  ['2026-11-05 09:14', 'WARN', 'notifications', 'Retry scheduled for 2 messages'],
  ['2026-11-05 08:00', 'INFO', 'auth', 'SSO metadata refreshed'],
  ['2026-11-05 06:00', 'INFO', 'hr-sync', 'Staff list synchronized: 412 records'],
  ['2026-11-05 03:00', 'INFO', 'backup', 'Nightly backup completed'],
  ['2026-11-04 22:31', 'ERROR', 'eds', 'Digital signature provider is not configured'],
];

export function buildAnalyticsCsv() {
  const rows = [
    ['School', 'Requests', 'Active pairs', 'Completed'],
    ...analyticsBySchool.map((row) => row.map(String)),
  ];
  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}
