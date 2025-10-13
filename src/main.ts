import './style.css'
import { renderDashboard } from './dashboard.ts'
import { inicializarModalNuevoCliente } from './nuevocliente.ts'




// Inicializar el dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  inicializarModalNuevoCliente();
});


