const socialIcons = {
  Instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="currentColor"/>',
  YouTube:
    '<rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor"/><path d="M10 9l5 3-5 3z" fill="#f5f8fc"/>',
  TikTok:
    '<path fill="currentColor" d="M14.5 3h3c.2 1.9 1.4 3.3 3.5 3.6v3c-1.4 0-2.6-.4-3.6-1.1v6.3a5.8 5.8 0 1 1-5-5.7v3.1a2.8 2.8 0 1 0 2.1 2.7z"/>',
  Telegram:
    '<path fill="currentColor" d="M21.4 3.6 2.9 10.8c-1 .4-1 1.6.1 1.9l4.6 1.4 1.8 5.6c.3.8 1.3 1 1.9.4l2.6-2.4 4.7 3.5c.7.5 1.7.1 1.9-.8L23 4.9c.2-1-.7-1.7-1.6-1.3zM9.5 14l8.6-6.6-6.9 7.6-.3 2.9z"/>',
  LinkedIn:
    '<rect x="3" y="9" width="4" height="12" fill="currentColor"/><circle cx="5" cy="5" r="2.2" fill="currentColor"/><path fill="currentColor" d="M10 9h3.8v1.7c.6-1.1 2-2 3.9-2 3 0 4.3 1.9 4.3 5.2V21h-4v-6.4c0-1.6-.6-2.6-2-2.6s-2 1.1-2 2.6V21h-4z"/>',
};

const columns = [
  [
    'Applicants',
    [
      "Bachelor's degree",
      "Master's degree",
      'Doctoral studies',
      'College',
      'Incoming academic mobility',
    ],
  ],
  [
    'Schools of Astana IT University',
    [
      'School of Intelligent Systems',
      'School of Artificial Intelligence and Data Science',
      'School of Software Engineering',
      'School of Cybersecurity',
      'School of Creative Industries',
      'School of General Education',
      'School of Digital Public Administration',
    ],
  ],
  [
    'More',
    [
      'Contacts',
      'Careers',
      'Partnerships',
      'Procurement',
      'Compliance officer',
      'Sociological research',
      'Internal documents',
    ],
  ],
];

const contacts = [
  [
    'Chancellery',
    [
      ['tel:+77172645728', '+7 (7172) 645-728'],
      ['mailto:info@astanait.edu.kz', 'info@astanait.edu.kz'],
    ],
    'Licence for educational activities KZ26LAA00015835 of 02.04.2019',
  ],
  [
    'Admissions office',
    [
      ['tel:+77172645710', '+7 (7172) 64-57-10'],
      ['mailto:admission@astanait.edu.kz', 'admission@astanait.edu.kz'],
    ],
  ],
  [
    'For media',
    [
      ['mailto:pr@astanait.edu.kz', 'pr@astanait.edu.kz'],
      ['#footer', 'Press photos'],
    ],
  ],
];

const icon = (name) =>
  `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">${socialIcons[name]}</svg>`;

export function renderSiteFooter() {
  return `<footer class="site-footer" id="footer">
    <div class="site-footer-inner">
      <div class="site-footer-top">
        <a class="site-footer-logo" href="#landing" aria-label="Astana IT University">
          <img class="symbol" src="assets/logo-symbol.svg" alt="" />
          <img class="wordmark" src="assets/logo-text.svg" alt="Astana IT University" />
        </a>
        <address class="site-footer-address">
          <span>Astana IT University LLP, Mangilik El Ave. 55/1, EXPO Business Centre, block C1</span>
          <span>Astana, Kazakhstan, 010000</span>
        </address>
        <div class="site-footer-social">
          <h2>Social media</h2>
          <div class="site-footer-social-links">
            ${Object.keys(socialIcons)
              .map(
                (name) =>
                  `<a href="#footer" aria-label="${name}" title="${name}">${icon(name)}</a>`,
              )
              .join('')}
          </div>
        </div>
      </div>
      <div class="site-footer-grid">
        ${columns
          .map(
            ([title, links]) =>
              `<div class="site-footer-col"><h2>${title}</h2><ul>${links.map((label) => `<li><a href="#footer">${label}</a></li>`).join('')}</ul></div>`,
          )
          .join('')}
      </div>
      <div class="site-footer-grid site-footer-contacts">
        ${contacts
          .map(
            ([title, links, note]) =>
              `<div><h2>${title}</h2><ul>${links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>${note ? `<p>${note}</p>` : ''}</div>`,
          )
          .join('')}
      </div>
      <div class="site-footer-bottom">
        <span>AITU Faculty Mentoring · diploma prototype</span>
        <span>© 2026 Astana IT University</span>
        <span class="site-footer-legal"><a href="#help">Privacy policy</a><a href="#help">Public offer agreement</a></span>
      </div>
    </div>
  </footer>`;
}
