// Login functionality
export function renderLoginForm(): string {
    return `
      <div class="login-container">
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
  
  // Función para hacer logout
  export function logout(): void {
    // Limpiar datos de autenticación del localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    console.log('Logout realizado - datos limpiados')
    
    // Navegar de vuelta al login
    navigateToLogin()
  }
  
  // Función para navegar al login
  function navigateToLogin(): void {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = renderLoginForm()
    initializeLogin()
  }
  
  // Función para navegar al dashboard después del login exitoso
  function navigateToDashboard(): void {
    // Importar dinámicamente el dashboard para evitar dependencias circulares
    import('./dashboard').then(({ renderDashboard }) => {
      document.querySelector<HTMLDivElement>('#app')!.innerHTML = ''
      renderDashboard()
    }).catch(error => {
      console.error('Error loading dashboard:', error)
      alert('Error al cargar el dashboard')
    })
  }
  
  export function initializeLogin(): void {
    const loginButton = document.querySelector<HTMLButtonElement>('#login-btn')!
  
    if (!loginButton) {
      console.error('Login button not found')
      return
    }
  
    // Login button event listener
    loginButton.addEventListener('click', async () => {
      const resultEl = document.getElementById('login-result')!
      const email = (document.getElementById('email') as HTMLInputElement).value
      const password = (document.getElementById('password') as HTMLInputElement).value
  
      loginButton.disabled = true
      loginButton.textContent = 'Logging in...'
      resultEl.style.display = 'none'
      resultEl.className = 'result'
      resultEl.textContent = ''
  
      try {
        const res = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })
  
        if (!res.ok) {
          // Non-2xx HTTP - try to parse JSON error body, otherwise text
          let bodyText = ''
          try {
            const jsonErr = await res.json()
            bodyText = jsonErr.message || JSON.stringify(jsonErr)
          } catch (e) {
            bodyText = await res.text()
          }
  
          // Decide whether this is an auth/credentials error that should show a popup
          const isAuthError = [400, 401, 403, 404].includes(res.status) || /credencial|invalid/i.test(String(bodyText))
  
          if (isAuthError) {
            // For credential errors: do NOT show the inline error panel, only the popup
            resultEl.style.display = 'none'
            resultEl.className = 'result'
            resultEl.textContent = ''
            alert('Credenciales inválidas')
          } else {
            // For other errors, show the inline panel
            resultEl.style.display = 'block'
            resultEl.classList.add('error')
            resultEl.textContent = `HTTP ${res.status}: ${bodyText}`
          }
          return
        }
  
        const data = await res.json()
        console.log(data)
  
        if (data && data.success) {
          // expected response: { success: true, token, user, message }
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
  
          // Navigate to dashboard immediately after successful login
          navigateToDashboard()
        } else {
          // user not found / invalid credentials
          resultEl.style.display = 'block'
          resultEl.classList.add('error')
          resultEl.innerHTML = `<h3>Error</h3><p>${data.message || 'Credenciales inválidas'}</p>`
          // show an alert popup as requested
          alert('Credenciales inválidas')
        }
  
      } catch (error) {
        resultEl.style.display = 'block'
        resultEl.classList.add('error')
        resultEl.innerHTML = `<h3>Error</h3><p>${(error as Error).message || 'Network error'}</p>`
        alert((error as Error).message || 'Network error')
      } finally {
        loginButton.disabled = false
        loginButton.textContent = 'Login'
      }
    })
  }