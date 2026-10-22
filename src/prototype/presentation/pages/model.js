import { html } from '../components/html-template.js';
import { renderHeading } from '../components/html.js';
export function renderModelPage(viewContext) {
  return html`
    ${renderHeading('OPEN DATA / LOGISTIC REGRESSION', 'How recommendations work', 'A reproducible course–skill matching demonstration using UniSkill.')}
    <div class="panel">
      <h2>Why open data?</h2>
      <p>
        Confidential university data was not provided for training or demonstration. This project
        therefore uses the publicly available
        <a href="https://huggingface.co/datasets/nurlanm/UniSkill_dataset">UniSkill dataset</a>
        (Apache-2.0), with illustrative mentor profiles.
      </p>
      <p>
        Five lexical features compare a selected skill with a course title and content. The fitted
        StandardScaler and logistic regression coefficients produce a course relevance score. Each
        demo mentor is ranked by their highest-scoring linked course.
      </p>
      <p>
        Free-text goals are saved as context, not used as model inputs. Scores do not measure a
        person's competence or establish an assignment.
      </p>
    </div>
    <div class="metrics" style="margin-top:28px">
      ${[
        ['Held-out test accuracy', '72.69%'],
        ['Test Macro-F1', '0.6938'],
        ['Decision threshold', '0.55'],
      ]
        .map(([label, value]) => `<div class="metric">${label}<strong>${value}</strong></div>`)
        .join('')}
    </div>
    <p class="helper">
      216 test course–skill pairs. These metrics are from the supplied experiment, not an evaluation
      of mentor suitability or results at AITU. Lexical overlap can produce unsuitable
      recommendations.
    </p>
    <p>
      <a href="https://aclanthology.org/2026.lrec-1.31/">
        Musazade, Mezei & Zhang (2026). UniSkill.
      </a>
    </p>
  `;
}
