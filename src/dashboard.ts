

// Función para crear el HTML del dashboard
export function createDashboardHTML(): string {
    return `
      <div class="dashboard-container">
        <div class="dashboard">
        <!-- Header -->
        <header class="header">
          
          <div class="header-left">
            <span class="user-label">User</span>
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
