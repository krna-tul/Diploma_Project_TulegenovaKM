import { html } from '../components/html-template.js';
import { renderInput, arrowIcon } from '../components/html.js';
export function renderSignInPage(viewContext) {
  return html`
    <section class="signin">
      <div class="photo signin-photo">
        <div class="signin-quote">
          <h2>
            Support starts
            <br />
            with a conversation.
          </h2>
          <p>A shared commitment to better teaching.</p>
        </div>
      </div>
      <form class="signin-form" data-form="signin">
        <small>WELCOME BACK</small>
        <h1>
          Your next chapter
          <br />
          starts here.
        </h1>
        <p class="subtitle">Sign in to your AITU mentoring workspace.</p>
        ${renderInput('email', 'Corporate email', 'name@astanait.edu.kz', 'email')}${renderInput('password', 'Password', '', 'password')}
        <div style="text-align:right">
          <button type="button" class="quiet-link" data-action="forgot">Forgot password?</button>
        </div>
        <button type="submit">Sign in${arrowIcon}</button>
        <p class="helper">
          Demo access only. No account is authenticated and no password is stored or sent. Use an
          illustrative email and password.
        </p>
        <p class="demo-note" style="margin-top:65px">
          Need help? Contact the program administrator.
        </p>
      </form>
    </section>
  `;
}
