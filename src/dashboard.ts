

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


  
          </section>
        </main>
        </div>
      </div>
    `;
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
