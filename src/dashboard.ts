

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

// Función principal para renderizar el dashboard
export function renderDashboard(): void {
    const appElement = document.querySelector<HTMLDivElement>('#app');
    if (appElement) {
      appElement.innerHTML = createDashboardHTML();
    }
}
