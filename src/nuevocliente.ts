// Función para crear el HTML del modal de nuevo cliente
export function createNuevoClienteModal(): string {
    return `
        <div id="modal-nuevo-cliente" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Nuevo Cliente</h2>
                    <button class="close-modal" id="close-modal-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="form-nuevo-cliente">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="garanter">Garanter:</label>
                                <input type="text" id="garanter" name="garanter">
                            </div>
                            <div class="form-group">
                                <label for="observaciones">Observaciones:</label>
                                <input type="text" id="observaciones" name="observaciones">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group full-width">
                                <label for="nombre-completo">Nombre Completo:</label>
                                <input type="text" id="nombre-completo" name="nombre-completo">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="moneda">Moneda:</label>
                                <select id="moneda" name="moneda">
                                    <option value="">Seleccionar...</option>
                                    <option value="USD">USD</option>
                                    <option value="BS">BS</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="aporte-mensual">Aporte Mensual:</label>
                                <input type="text" id="aporte-mensual" name="aporte-mensual">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="banco-coop">Banco/Coop:</label>
                                <select id="banco-coop" name="banco-coop">
                                    <option value="">Seleccionar...</option>
                                    <option value="banco1">Banco 1</option>
                                    <option value="banco2">Banco 2</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="no-cuenta">No Cuenta:</label>
                                <input type="text" id="no-cuenta" name="no-cuenta">
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Teléfonos:</h3>
                            <div class="form-row">
                                <div class="form-group-small">
                                    <label for="tel-celular">Celular:</label>
                                    <input type="text" id="tel-celular" name="tel-celular">
                                </div>
                                <div class="form-group-small">
                                    <label for="tel-fijo">Fijo:</label>
                                    <input type="text" id="tel-fijo" name="tel-fijo">
                                </div>
                                <div class="form-group-small">
                                    <label for="tel-ci">CI:</label>
                                    <input type="text" id="tel-ci" name="tel-ci">
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group checkbox-group">
                                <label for="wor-tablet">Wor Tablet?:</label>
                                <input type="checkbox" id="wor-tablet" name="wor-tablet">
                            </div>
                            <div class="form-group">
                                <label for="telefono">Teléfono:</label>
                                <input type="text" id="telefono" name="telefono">
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Registro:</h3>
                            <div class="form-row">
                                <div class="form-group-small">
                                    <label for="reg-celular">Celular:</label>
                                    <input type="text" id="reg-celular" name="reg-celular">
                                </div>
                                <div class="form-group-small">
                                    <label for="reg-fijo">Fijo:</label>
                                    <input type="text" id="reg-fijo" name="reg-fijo">
                                </div>
                                <div class="form-group-small">
                                    <label for="reg-ci">CI:</label>
                                    <input type="text" id="reg-ci" name="reg-ci">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancelar" id="btn-cancelar">Cancelar</button>
                    <button type="button" class="btn-guardar" id="btn-guardar">Guardar</button>
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar el modal
export function mostrarModalNuevoCliente(): void {
    const modal = document.getElementById('modal-nuevo-cliente');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Función para cerrar el modal
export function cerrarModalNuevoCliente(): void {
    const modal = document.getElementById('modal-nuevo-cliente');
    if (modal) {
        modal.style.display = 'none';
        // Limpiar formulario
        const form = document.getElementById('form-nuevo-cliente') as HTMLFormElement;
        if (form) {
            form.reset();
        }
    }
}

// Función para configurar los event listeners del modal
export function configurarEventListenersModal(): void {
    // Botón de cerrar (X)
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModalNuevoCliente);
    }

    // Botón cancelar
    const cancelBtn = document.getElementById('btn-cancelar');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cerrarModalNuevoCliente);
    }

    // Botón guardar
    const guardarBtn = document.getElementById('btn-guardar');
    if (guardarBtn) {
        guardarBtn.addEventListener('click', () => {
            const form = document.getElementById('form-nuevo-cliente') as HTMLFormElement;
            if (form) {
                // Aquí puedes agregar la lógica para guardar los datos
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                console.log('Datos del cliente:', data);
                
                // Cerrar modal después de guardar
                cerrarModalNuevoCliente();
            }
        });
    }

    // Cerrar modal al hacer click fuera de él
    const modalOverlay = document.getElementById('modal-nuevo-cliente');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                cerrarModalNuevoCliente();
            }
        });
    }
}

// Función para inicializar el modal en el dashboard
export function inicializarModalNuevoCliente(): void {
    // Agregar el HTML del modal al body
    const appElement = document.querySelector<HTMLDivElement>('#app');
    if (appElement) {
        appElement.insertAdjacentHTML('beforeend', createNuevoClienteModal());
    }

    // Configurar event listeners
    configurarEventListenersModal();

    // Agregar event listener al botón de "Agregar nuevo cliente"
    const agregarClienteBtn = document.querySelector('.cliente-card .card-icons button:nth-child(2)');
    if (agregarClienteBtn) {
        agregarClienteBtn.addEventListener('click', mostrarModalNuevoCliente);
    }
}

