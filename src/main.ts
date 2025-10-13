import './style.css'
import { renderLoginForm, initializeLogin } from './login'

// Verificar si ya hay un token válido en localStorage
function checkAuthStatus(): boolean {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  
  if (token && user) {
    try {
      // Verificar si el token no ha expirado (opcional)
      const userData = JSON.parse(user)
      console.log('User already authenticated:', userData)
      return true
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return false
    }
  }
  return false
}

// Función para navegar al dashboard
async function navigateToDashboard(): Promise<void> {
  try {
    const { renderDashboard } = await import('./dashboard')
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = ''
    renderDashboard()
  } catch (error) {
    console.error('Error loading dashboard:', error)
    alert('Error al cargar el dashboard')
  }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  if (checkAuthStatus()) {
    // Si ya está autenticado, ir directamente al dashboard
    navigateToDashboard()
  } else {
    // Si no está autenticado, mostrar el formulario de login
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = renderLoginForm()
    initializeLogin()
  }
})
