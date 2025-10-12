

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

// Función principal para renderizar el dashboard
export function renderDashboard(): void {
    const appElement = document.querySelector<HTMLDivElement>('#app');
    if (appElement) {
      appElement.innerHTML = createDashboardHTML();
    }
}
