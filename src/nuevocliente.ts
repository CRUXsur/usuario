// Función para validar el formulario
function validarFormulario(form: HTMLFormElement): boolean {
    // Limpiar errores previos
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.classList.remove('input-error');
    });

    // Eliminar mensajes de error previos
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());

    let isValid = true;
    let primerCampoInvalido: HTMLElement | null = null;

    // Validar cada campo requerido
    inputs.forEach(input => {
        const htmlInput = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        
        if (!htmlInput.value.trim()) {
            isValid = false;
            htmlInput.classList.add('input-error');
            
            // Agregar mensaje de error
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Este campo es requerido';
            htmlInput.parentElement?.appendChild(errorMsg);

            // Guardar el primer campo inválido para hacer scroll
            if (!primerCampoInvalido) {
                primerCampoInvalido = htmlInput;
            }
        }
    });

    // Mostrar alerta si hay errores
    if (!isValid) {
        alert('Por favor, complete todos los campos requeridos (*)');
        
        // Hacer scroll al primer campo inválido
        if (primerCampoInvalido && 'focus' in primerCampoInvalido) {
            (primerCampoInvalido as HTMLInputElement).focus();
        }
    }

    return isValid;
}

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
                    <form id="form-nuevo-cliente" novalidate>
                        <div class="form-row">
                            <div class="form-group full-width">
                                <label for="nombre-completo">Nombre Completo: <span class="required">*</span></label>
                                <input type="text" id="nombre-completo" name="nombre-completo" required>
                            </div>
                        </div>

                        <div class="form-row">

                            <div class="form-group-small">
                                <label for="tel-ci">CI: <span class="required">*</span></label>
                                <input type="text" id="tel-ci" name="tel-ci" required>
                            </div>
                            <div class="form-group-small">
                                <label for="tel-celular">Celular: <span class="required">*</span></label>
                                <input type="text" id="tel-celular" name="tel-celular" required>
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
                                <label for="numero-dispositivo">N° Dispositivo: <span class="required">*</span></label>
                                <div class="input-container">
                                    <span class="icon-placeholder device-icon" id="btn-leer-dispositivo">📲</span>
                                    <input type="text" id="numero-dispositivo" name="numero-dispositivo" readonly required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="vto-tarjeta">Vto. Tarjeta: <span class="required">*</span></label>
                                <input type="month" id="vto-tarjeta" name="vto-tarjeta" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="sector">Sector(Grupo): <span class="required">*</span></label>
                                <select id="sector" name="sector" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="Salud">Salud</option>
                                    <option value="Magisterio">Magisterio</option>
                                    <option value="Petrolero">Petrolero</option>
                                    <option value="Comerciantes">Comerciantes</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="codigo-interno">Codigo: <span class="required">*</span></label>
                                <input type="text" id="codigo-interno" name="codigo-interno" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group-small">
                                <label for="banco-coop">Banco/Coop: <span class="required">*</span></label>
                                <select id="banco-coop" name="banco-coop" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="UNImovilPlus">UNImovilPlus</option>
                                    <option value="BCP">BCP</option>
                                    <option value="BNB">BNB</option>
                                    <option value="Coop">Cooperativa</option>
                                </select>
                            </div>
                            <div class="form-group-small">
                                <label for="no-cuenta">No Cuenta: <span class="required">*</span></label>
                                <input type="text" id="no-cuenta" name="no-cuenta" required>
                            </div>
                            <div class="form-group-small">
                                <label for="moneda">Moneda: <span class="required">*</span></label>
                                <select id="moneda" name="moneda" required>
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
                                    <label for="garanter">Nombre Completo: <span class="required">*</span></label>
                                    <input type="text" id="garanter" name="garanter" required>
                                </div>
                                <div class="form-group">
                                    <label for="reg-celular">Celular: <span class="required">*</span></label>
                                    <input type="text" id="reg-celular" name="reg-celular" required>
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
            
            // Limpiar errores de validación
            const inputs = form.querySelectorAll('.input-error');
            inputs.forEach(input => input.classList.remove('input-error'));
            
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());
            
            // Limpiar campo de dispositivo readonly
            const dispositivoInput = document.getElementById('numero-dispositivo') as HTMLInputElement;
            if (dispositivoInput) {
                dispositivoInput.value = '';
            }
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
                // Validar formulario
                if (!validarFormulario(form)) {
                    return; // No continuar si hay errores
                }
                
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

