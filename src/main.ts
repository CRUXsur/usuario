import './style.css'
import { renderLoginForm } from './login.ts'

// Inicializar el login cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.querySelector<HTMLDivElement>('#app');
  if (appElement) {
    appElement.innerHTML = renderLoginForm();
  }
});


