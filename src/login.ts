// Login functionality
export function renderLoginForm(): string {
    return `
      <div class="auth-section" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 40vh;">
          <div id="login-form" class="card-login">
            <h3>Login</h3>
            <div class="form-group-login">
              <label for="email">Email:</label>
              <input type="email" id="email" value="luisaescobar@gmail.com" />
            </div>
            <div class="form-group-login">
              <label for="password">Password:</label>
              <input type="password" id="password" value="Abc123" />
            </div>
            <button id="login-btn" type="button">Login</button>
          <div id="login-result" class="result" style="display:none"></div>
          </div>
      </div>
    `
  }

