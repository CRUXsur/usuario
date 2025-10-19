import { checkDeviceId, createCliente, type ClienteData } from './api';

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

// Función para convertir el input month (YYYY-MM) a formato ISO Date
function convertirMesAFecha(mesInput: string): string | undefined {
    if (!mesInput) return undefined;
    return `${mesInput}-01`;
}

// Función para preparar los datos del formulario para el backend
function prepararDatosCliente(form: HTMLFormElement): ClienteData {
    const formData = new FormData(form);
    const worTablet = (document.getElementById('wor-tablet') as HTMLInputElement)?.checked || false;
    
    const clienteData: ClienteData = {
        nombrecompleto: formData.get('nombre-completo') as string,
        ci: formData.get('tel-ci') as string,
        celular: formData.get('tel-celular') as string || undefined,
        fijo: formData.get('tel-fijo') as string || undefined,
        isActive: worTablet,
        device_id: formData.get('numero-dispositivo') as string || undefined,
        fecha_vto_tarjeta: convertirMesAFecha(formData.get('vto-tarjeta') as string),
        sector: formData.get('sector') as string || undefined,
        codigo: formData.get('codigo-interno') as string || undefined,
        banco: formData.get('banco-coop') as string || undefined,
        numero_cuenta: formData.get('no-cuenta') as string || undefined,
        moneda: formData.get('moneda') as string || undefined,
        garante: formData.get('garanter') as string || undefined,
        celular_garante: formData.get('reg-celular') as string || undefined,
        observaciones: formData.get('observaciones') as string || undefined,
    };
    
    Object.keys(clienteData).forEach(key => {
        if (clienteData[key as keyof ClienteData] === undefined || clienteData[key as keyof ClienteData] === '') {
            delete clienteData[key as keyof ClienteData];
        }
    });
    
    return clienteData;
}

// Función para guardar el cliente en el backend
async function guardarCliente(form: HTMLFormElement): Promise<boolean> {
    try {
        const clienteData = prepararDatosCliente(form);
        console.log('💾 Intentando guardar cliente...', clienteData);
        
        const response = await createCliente(clienteData);
        
        if (response.success) {
            alert(`✅ ${response.message || 'Cliente creado exitosamente'}`);
            console.log('✅ Cliente guardado:', response.data);
            return true;
        } else {
            alert(`❌ Error al guardar: ${response.error}`);
            console.error('❌ Error al guardar cliente:', response.error);
            return false;
        }
    } catch (error) {
        console.error('💥 Error inesperado al guardar cliente:', error);
        alert('Error inesperado al guardar el cliente. Por favor, intente nuevamente.');
        return false;
    }
}

// Función para obtener el device_id usando la API existente
async function getDeviceId(): Promise<{ deviceId: string | null; error?: string }> {
    try {
        console.log('🔍 Ejecutando proceso de automatización para obtener device_id...');
        const result = await checkDeviceId();
        
        if (!result.success || !result.deviceId) {
            const errorMsg = result.reason || result.message || 'No se pudo detectar el dispositivo';
            return { deviceId: null, error: errorMsg };
        }
        
        if (result.cliente) {
            const clienteNombre = result.cliente.nombrecompleto || 'Cliente existente';
            const errorMsg = `Este dispositivo ya está registrado para: ${clienteNombre}`;
            return { deviceId: null, error: errorMsg };
        }
        
        return { deviceId: result.deviceId };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        return { deviceId: null, error: errorMsg };
    }
}

// Función para manejar el click del botón device_id
async function handleGetDeviceId(): Promise<void> {
    const inputDispositivo = document.getElementById('numero-dispositivo') as HTMLInputElement;
    const btnLeerDispositivo = document.getElementById('btn-leer-dispositivo');
    
    if (!inputDispositivo || !btnLeerDispositivo) return;

    const originalText = btnLeerDispositivo.textContent;
    btnLeerDispositivo.textContent = '⏳';
    btnLeerDispositivo.classList.add('loading');
    
    try {
        const result = await getDeviceId();
        
        if (result.deviceId) {
            inputDispositivo.value = result.deviceId;
            inputDispositivo.classList.remove('input-error');
            const errorMessages = inputDispositivo.parentElement?.querySelectorAll('.error-message');
            errorMessages?.forEach(msg => msg.remove());
            btnLeerDispositivo.textContent = '✅';
            setTimeout(() => {
                btnLeerDispositivo.textContent = originalText;
            }, 1500);
        } else {
            const errorMessage = result.error || 'El dispositivo no está conectado o ya existe para un cliente';
            alert(errorMessage);
            btnLeerDispositivo.textContent = '❌';
            setTimeout(() => {
                btnLeerDispositivo.textContent = originalText;
            }, 1500);
        }
    } catch (error) {
        console.error('💥 Error inesperado al obtener device_id:', error);
        alert('Error al conectar con el dispositivo');
        btnLeerDispositivo.textContent = '❌';
        setTimeout(() => {
            btnLeerDispositivo.textContent = originalText;
        }, 1500);
    } finally {
        btnLeerDispositivo.classList.remove('loading');
    }
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
                                    <option value="Bco.UNION">UNImovilPlus</option>
                                    <option value="BCP">BCP</option>
                                    <option value="BNB">BNB</option>
                                    <option value="Coopertiva">Cooperativa</option>
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
                                    <option value="Dolares">Dólares</option>
                                    <option value="Bolivianos">Bolivianos</option>
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
        btnLeerDispositivo.addEventListener('click', async () => {
            await handleGetDeviceId();
        });
    }

    // Botón guardar
    const guardarBtn = document.getElementById('btn-guardar');
    if (guardarBtn) {
        guardarBtn.addEventListener('click', async () => {
            const form = document.getElementById('form-nuevo-cliente') as HTMLFormElement;
            if (form) {
                // Validar formulario
                if (!validarFormulario(form)) {
                    return; // No continuar si hay errores
                }
                
                // Deshabilitar el botón mientras se guarda
                const btnElement = guardarBtn as HTMLButtonElement;
                const textoOriginal = btnElement.textContent;
                btnElement.disabled = true;
                btnElement.textContent = '⏳ Guardando...';
                btnElement.style.opacity = '0.6';
                
                try {
                    // Guardar el cliente en el backend
                    const exito = await guardarCliente(form);
                    
                    if (exito) {
                        // Cerrar modal después de guardar exitosamente
                        cerrarModalNuevoCliente();
                        // Recargar la lista de clientes
                        window.dispatchEvent(new CustomEvent('clienteCreado'));
                    }
                } finally {
                    // Restaurar el botón
                    btnElement.disabled = false;
                    btnElement.textContent = textoOriginal;
                    btnElement.style.opacity = '1';
                }
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
    console.log('🔧 Inicializando modal nuevo cliente...');
    
    // Agregar el HTML del modal al body
    const appElement = document.querySelector<HTMLDivElement>('#app');
    if (appElement) {
        appElement.insertAdjacentHTML('beforeend', createNuevoClienteModal());
        console.log('✅ Modal HTML agregado al DOM');
    } else {
        console.error('❌ No se encontró el elemento #app');
        return;
    }

    // Configurar event listeners
    configurarEventListenersModal();

    // Agregar event listener al botón de "Agregar nuevo cliente"
    const agregarClienteBtn = document.querySelector('.cliente-card .card-icons button:nth-child(2)');
    console.log('🔍 Buscando botón "Agregar nuevo cliente":', agregarClienteBtn);
    
    if (agregarClienteBtn) {
        agregarClienteBtn.addEventListener('click', () => {
            console.log('🖱️ Click en botón "Agregar nuevo cliente"');
            mostrarModalNuevoCliente();
        });
        console.log('✅ Event listener agregado al botón');
    } else {
        console.error('❌ No se encontró el botón "Agregar nuevo cliente"');
        console.log('📝 Intentando con todos los botones...');
        const todosLosBotones = document.querySelectorAll('.cliente-card .card-icons button');
        console.log('Botones encontrados:', todosLosBotones.length);
        todosLosBotones.forEach((btn, index) => {
            console.log(`Botón ${index}:`, btn);
        });
    }
}

