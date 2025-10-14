// Función para crear el HTML del modal de detalles del cliente
export function createFileClienteModal(): string {
    return `
        <div id="modal-file-cliente" class="modal-overlay">
            <div class="modal-content modal-file-cliente">
                <div class="modal-header">
                    <h2>Registro Cliente</h2>
                    <button class="close-modal" id="close-file-modal-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Tab Menu -->
                    <div class="tab-menu">
                        <button class="tab-btn active" data-tab="general">General</button>
                        <button class="tab-btn" data-tab="prestamos">Prestamos</button>
                        <button class="tab-btn" data-tab="pagos">Pagos</button>
                        <button class="tab-btn" data-tab="banco">Banco</button>
                    </div>

                    <!-- Tab Content -->
                    <div class="tab-content-container">
                        <!-- General Tab -->
                        <div class="tab-content active" id="tab-general">
                            <p class="tab-placeholder">Contenido de General</p>
                        </div>

                        <!-- Prestamos Tab -->
                        <div class="tab-content" id="tab-prestamos">
                            <p class="tab-placeholder">Contenido de Prestamos</p>
                        </div>

                        <!-- Pagos Tab -->
                        <div class="tab-content" id="tab-pagos">
                            <p class="tab-placeholder">Contenido de Pagos</p>
                        </div>

                        <!-- Banco Tab -->
                        <div class="tab-content" id="tab-banco">
                            <p class="tab-placeholder">Contenido de Banco</p>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-cancelar" id="btn-cerrar-file">Cerrar</button>
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar el modal
export function mostrarModalFileCliente(clienteId: string): void {
    console.log('📂 Abriendo detalles del cliente:', clienteId);
    const modal = document.getElementById('modal-file-cliente');
    if (modal) {
        modal.style.display = 'flex';
        // Aquí se podría cargar información específica del cliente usando el clienteId
    }
}

// Función para cerrar el modal
export function cerrarModalFileCliente(): void {
    const modal = document.getElementById('modal-file-cliente');
    if (modal) {
        modal.style.display = 'none';
        // Resetear a la primera pestaña
        resetearTabs();
    }
}

// Función para resetear las pestañas a su estado inicial
function resetearTabs(): void {
    // Resetear botones
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, index) => {
        if (index === 0) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Resetear contenidos
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((content, index) => {
        if (index === 0) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Función para manejar el cambio de pestañas
function handleTabChange(tabName: string): void {
    console.log('📑 Cambiando a pestaña:', tabName);

    // Actualizar botones activos
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Actualizar contenido activo
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        if (content.id === `tab-${tabName}`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Función para configurar los event listeners del modal
export function configurarEventListenersFileModal(): void {
    // Botón de cerrar (X)
    const closeBtn = document.getElementById('close-file-modal-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModalFileCliente);
    }

    // Botón cerrar en el footer
    const cerrarBtn = document.getElementById('btn-cerrar-file');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', cerrarModalFileCliente);
    }

    // Event listeners para las pestañas
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            if (tabName) {
                handleTabChange(tabName);
            }
        });
    });

    // Cerrar modal al hacer click fuera de él
    const modalOverlay = document.getElementById('modal-file-cliente');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                cerrarModalFileCliente();
            }
        });
    }
}

// Función para inicializar el modal en el dashboard
export function inicializarModalFileCliente(): void {
    console.log('🔧 Inicializando modal file cliente...');
    
    // Agregar el HTML del modal al body
    const appElement = document.querySelector<HTMLDivElement>('#app');
    if (appElement) {
        appElement.insertAdjacentHTML('beforeend', createFileClienteModal());
        console.log('✅ Modal file cliente agregado al DOM');
    } else {
        console.error('❌ No se encontró el elemento #app');
        return;
    }

    // Configurar event listeners
    configurarEventListenersFileModal();
    
    console.log('✅ Modal file cliente inicializado correctamente');
}

// Función para agregar event listeners a los botones 📁 en la tabla
export function agregarEventListenersBtnView(): void {
    const btnsView = document.querySelectorAll('.btn-view');
    btnsView.forEach(btn => {
        // Remover listener previo si existe para evitar duplicados
        btn.removeEventListener('click', handleViewClick);
        btn.addEventListener('click', handleViewClick);
    });
}

// Handler para el click en el botón ver
function handleViewClick(e: Event): void {
    const clienteId = (e.currentTarget as HTMLElement).getAttribute('data-id');
    if (clienteId) {
        mostrarModalFileCliente(clienteId);
    }
}

