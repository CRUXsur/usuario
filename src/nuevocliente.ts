
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
                            <div class="form-group full-width">
                                <label for="nombre-completo">Nombre Completo:</label>
                                <input type="text" id="nombre-completo" name="nombre-completo">
                            </div>
                        </div>

                        <div class="form-row">

                            <div class="form-group-small">
                                <label for="tel-ci">CI:</label>
                                <input type="text" id="tel-ci" name="tel-ci">
                            </div>
                            <div class="form-group-small">
                                <label for="tel-celular">Celular:</label>
                                <input type="text" id="tel-celular" name="tel-celular">
                            </div>
                            <div class="form-group-small">
                                <label for="tel-fijo">Fijo:</label>
                                <input type="text" id="tel-fijo" name="tel-fijo">
                            </div>

                        </div>

                        <div class="form-row">
                            <div class="form-group checkbox-group">
                                <label for="wor-tablet">Activo?:</label>
                                <input type="checkbox" id="wor-tablet" name="wor-tablet">
                            </div>
                            <div class="form-group">
                                <label for="numero-dispositivo">N° Dispositivo:</label>
                                <div class="input-container">
                                    <span class="icon-placeholder device-icon" id="btn-leer-dispositivo">📲</span>
                                    <input type="text" id="numero-dispositivo" name="numero-dispositivo" readonly>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="vto-tarjeta">Vto. Tarjeta:</label>
                                <input type="month" id="vto-tarjeta" name="vto-tarjeta">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="sector">Sector(Grupo):</label>
                                <select id="sector" name="sector">
                                    <option value="">Seleccionar...</option>
                                    <option value="Salud">Salud</option>
                                    <option value="Magisterio">Magisterio</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="codigo-interno">Codigo:</label>
                                <input type="text" id="codigo-interno" name="codigo-interno">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group-small">
                                <label for="banco-coop">Banco/Coop:</label>
                                <select id="banco-coop" name="banco-coop">
                                    <option value="">Seleccionar...</option>
                                    <option value="BancoUnion">Banco Union</option>
                                    <option value="BCP">BCP</option>
                                    <option value="BNB">BNB</option>
                                    <option value="Coop">Cooperativa</option>
                                </select>
                            </div>
                            <div class="form-group-small">
                                <label for="no-cuenta">No Cuenta:</label>
                                <input type="text" id="no-cuenta" name="no-cuenta">
                            </div>
                            <div class="form-group-small">
                                <label for="moneda">Moneda:</label>
                                <select id="moneda" name="moneda">
                                    <option value="">Seleccionar...</option>
                                    <option value="USD">Dólares</option>
                                    <option value="BS">Bolivianos</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Garante:</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="garanter">Nombre Completo:</label>
                                    <input type="text" id="garanter" name="garanter">
                                </div>
                                <div class="form-group">
                                    <label for="reg-celular">Celular:</label>
                                    <input type="text" id="reg-celular" name="reg-celular">
                                </div>
                            </div>
                            <div class="form-group full-width">
                                <label for="observaciones">Observaciones:</label>
                                <textarea id="observaciones" name="observaciones" rows="3"></textarea>
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

    // Botón leer dispositivo
    const btnLeerDispositivo = document.getElementById('btn-leer-dispositivo');
    if (btnLeerDispositivo) {
        btnLeerDispositivo.addEventListener('click', () => {
            const inputDispositivo = document.getElementById('numero-dispositivo') as HTMLInputElement;
            if (inputDispositivo) {
                // Simular lectura del número único del dispositivo
                // En producción, aquí iría la lógica real para leer del dispositivo
                // const numeroUnico = generateDeviceNumber();
                // inputDispositivo.value = numeroUnico;
            }
        });
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

