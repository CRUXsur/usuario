
import { obtenerClientes, toggleClienteEstado, type ClienteConDatos } from './api';

// Función para obtener el nombre del usuario
function getUserDisplayName(): string {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.fullName || user.name || user.email || 'User';
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  return 'User';
}

// Función para crear el HTML del dashboard
export function createDashboardHTML(): string {
    return `
      <div class="dashboard-container">
        <div class="dashboard">
        <!-- Header -->
        <header class="header">
          
          <div class="header-left">
            <span class="user-label">${getUserDisplayName()}</span>
          </div>

          <div class="header-right">
            <button class="icon-btn" title="Configuración">
              <span class="settings-btn">⚙️</span>
            </button>
            <button class="icon-btn" title="Salir">
              <span class="logout-btn">❗</span>
            </button>
          </div>

        </header>
  
        <!-- Main Content -->
        <main class="main-content">
          <!-- Top Cards Section -->
          <section class="top-cards">

                <!-- Cliente Card -->
                <div class="card cliente-card">
                    <div class="card-header">
                    <h3>CLIENTE</h3>
                    <div class="card-icons">
                        <button class="icon-btn-link" title="Buscar cliente">
                        <span class="icon-placeholder">📲</span>
                        </button>
                        <button class="icon-btn-link" title="Agregar nuevo cliente">
                        <span class="icon-placeholder">➕</span>
                        </button>
                    </div>
                    </div>
                    <div class="card-body">
                    <div class="input-group">
                        <label>CI</label>
                        <div class="input-container">
                        <input type="text" id="ci-input" placeholder="Ingrese CI">
                        <span class="icon-placeholder">🔍</span>
                        </div>
                    </div>
                </div>
            </div>
          </section>

          <!-- Lista de Clientes Section -->
          <section class="clientes-section">
            <div class="card lista-clientes-card">
                <div class="card-header">
                    <h3>LISTA DE CLIENTES</h3>
                    <div class="card-icons">
                        <button class="icon-btn-link" id="btn-refresh-clientes" title="Actualizar lista">
                            <span class="icon-placeholder">🔄</span>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div id="clientes-loading" class="loading-container" style="display: none;">
                        <p>⏳ Cargando clientes...</p>
                    </div>
                    <div id="clientes-lista" class="clientes-tabla-container">
                        <!-- Aquí se cargará la tabla de clientes dinámicamente -->
                    </div>
                </div>
            </div>
          </section>
        </main>
        </div>
      </div>
    `;
}

// Función para renderizar la tabla de clientes
function renderClientesTabla(clientes: ClienteConDatos[]): string {
  if (!clientes || clientes.length === 0) {
    return '<p class="no-data">No hay clientes registrados</p>';
  }

  return `
    <table class="clientes-tabla">
      <thead>
        <tr>
          <th>Código</th>
          <th>Device ID</th>
          <th>Nombre Completo</th>
          <th>Monto Prestado</th>
          <th>Cuota</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${clientes.map(cliente => `
          <tr data-cliente-id="${cliente.id_cliente}" class="${cliente.isActive ? '' : 'cliente-inactivo'}">
            <td>${cliente.codigo || '-'}</td>
            <td>${cliente.device_id || '-'}</td>
            <td>${cliente.nombrecompleto}</td>
            <td class="monto">${cliente.monto_prestado ? `$${cliente.monto_prestado.toFixed(2)}` : '-'}</td>
            <td class="monto">${cliente.monto_cuota ? `$${cliente.monto_cuota.toFixed(2)}` : '-'}</td>
            <td class="acciones-cell">
              <button class="btn-action btn-toggle ${cliente.isActive ? 'active' : 'inactive'}" 
                      data-id="${cliente.id_cliente}" 
                      data-estado="${cliente.isActive}"
                      title="${cliente.isActive ? 'Desactivar cliente' : 'Activar cliente'}">
                <span class="toggle-icon">${cliente.isActive ? '✅' : '❌'}</span>
              </button>
              <button class="btn-action btn-view" data-id="${cliente.id_cliente}" title="Ver detalles">
                👁️
              </button>
              <button class="btn-action btn-edit" data-id="${cliente.id_cliente}" title="Editar">
                ✏️
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Función para cargar clientes desde el backend
async function cargarClientes(): Promise<void> {
  const loadingElement = document.getElementById('clientes-loading');
  const listaElement = document.getElementById('clientes-lista');

  if (!loadingElement || !listaElement) return;

  // Mostrar loading
  loadingElement.style.display = 'block';
  listaElement.innerHTML = '';

  try {
    console.log('📡 Cargando clientes desde el backend...');
    const response = await obtenerClientes();

    if (response.success && response.data) {
      console.log('✅ Clientes cargados:', response.data);
      listaElement.innerHTML = renderClientesTabla(response.data);
      
      // Agregar event listeners a los botones de acción
      agregarEventListenersAcciones();
    } else {
      console.error('❌ Error al cargar clientes:', response.error);
      listaElement.innerHTML = `<p class="error-message">Error: ${response.error}</p>`;
    }
  } catch (error) {
    console.error('💥 Error inesperado:', error);
    listaElement.innerHTML = '<p class="error-message">Error al cargar los clientes</p>';
  } finally {
    loadingElement.style.display = 'none';
  }
}

// Función para manejar el toggle de estado
async function handleToggleEstado(clienteId: string, estadoActual: boolean, btnElement: HTMLElement): Promise<void> {
  const nuevoEstado = !estadoActual;
  
  // Deshabilitar el botón mientras se actualiza
  btnElement.style.opacity = '0.5';
  btnElement.style.pointerEvents = 'none';

  try {
    console.log(`🔄 Cambiando estado de cliente ${clienteId} a ${nuevoEstado ? 'Activo' : 'Inactivo'}...`);
    
    const response = await toggleClienteEstado(clienteId, nuevoEstado);
    
    if (response.success) {
      console.log('✅ Estado actualizado exitosamente');
      // Recargar la lista de clientes
      await cargarClientes();
    } else {
      console.error('❌ Error al actualizar estado:', response.error);
      alert(`Error: ${response.error}`);
      // Restaurar el botón
      btnElement.style.opacity = '1';
      btnElement.style.pointerEvents = 'auto';
    }
  } catch (error) {
    console.error('💥 Error inesperado:', error);
    alert('Error al actualizar el estado del cliente');
    // Restaurar el botón
    btnElement.style.opacity = '1';
    btnElement.style.pointerEvents = 'auto';
  }
}

// Función para agregar event listeners a los botones de acción
function agregarEventListenersAcciones(): void {
  // Botones de toggle estado
  const btnsToggle = document.querySelectorAll('.btn-toggle');
  btnsToggle.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const btnElement = e.currentTarget as HTMLElement;
      const clienteId = btnElement.getAttribute('data-id');
      const estadoActual = btnElement.getAttribute('data-estado') === 'true';
      
      if (clienteId) {
        const confirmar = confirm(`¿Desea ${estadoActual ? 'desactivar' : 'activar'} este cliente?`);
        if (confirmar) {
          await handleToggleEstado(clienteId, estadoActual, btnElement);
        }
      }
    });
  });

  // Botones de ver
  const btnsView = document.querySelectorAll('.btn-view');
  btnsView.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const clienteId = (e.currentTarget as HTMLElement).getAttribute('data-id');
      console.log('Ver cliente:', clienteId);
      // TODO: Implementar vista de detalles
    });
  });

  // Botones de editar
  const btnsEdit = document.querySelectorAll('.btn-edit');
  btnsEdit.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const clienteId = (e.currentTarget as HTMLElement).getAttribute('data-id');
      console.log('Editar cliente:', clienteId);
      // TODO: Implementar edición
    });
  });
}

// Función para inicializar eventos del dashboard
function initializeDashboardEvents(): void {
  // Botón de logout
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('¿Está seguro que desea salir?')) {
        console.log('Logout clicked - iniciando proceso de logout');
        
        // Importar dinámicamente la función de logout
        import('./login.ts').then(({ logout }) => {
          logout();
        }).catch(error => {
          console.error('Error importing logout function:', error);
          alert('Error al realizar logout');
        });
      }
    });
  } else {
    console.error('Logout button not found');
  }

  // Botón de actualizar clientes
  const btnRefresh = document.getElementById('btn-refresh-clientes');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', async () => {
      console.log('🔄 Actualizando lista de clientes...');
      await cargarClientes();
    });
  }

  // Escuchar evento de cliente creado
  window.addEventListener('clienteCreado', async () => {
    console.log('✅ Cliente creado, recargando lista...');
    await cargarClientes();
  });

  // Cargar clientes al iniciar
  cargarClientes();
}

// Función principal para renderizar el dashboard
export function renderDashboard(): void {
    const appElement = document.querySelector<HTMLDivElement>('#app');
    if (appElement) {
      appElement.innerHTML = createDashboardHTML();
      // Inicializar eventos después de renderizar el HTML
      initializeDashboardEvents();
    }
}
