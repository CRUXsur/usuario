import { obtenerClientePorId, type ClienteDetalle } from './api';
import { obtenerBancosCliente, crearBancoCliente, actualizarBancoCliente, type BancoClienteData, type CreateBancoClienteDto } from './api';
import { obtenerPrestamosPorCliente, actualizarPrestamo, crearPrestamo, type PrestamoData, type UpdatePrestamoDto, type CreatePrestamoDto } from './api';

// Variable para almacenar el cliente actual
let clienteActual: ClienteDetalle | null = null;

// Variable para almacenar los bancos del cliente
let bancosCliente: BancoClienteData[] = [];

// Variable para almacenar los préstamos del cliente
let prestamosCliente: PrestamoData[] = [];

// Función para crear el HTML de la pestaña General
function createGeneralTabContent(cliente: ClienteDetalle): string {
    return `
        <div class="datos-generales-container">
            <!-- Tarjeta principal con información del cliente -->
            <div class="datos-main-card">
                <div class="personal-info-section">
                    <!-- Fila 1: Nombre Completo y Serie -->
                    <div class="info-row">
                        <div class="info-field full-width">
                            <label class="info-label">Nombre Completo:</label>
                            <div class="info-value">${cliente.nombrecompleto || '-'}</div>
                        </div>
                        <div class="info-field serie-field">
                            <label class="info-label">N° Serie:</label>
                            <div class="info-value">${cliente.device_id || '-'}</div>
                        </div>
                        <div class="info-field">
                            <label class="info-label">CI:</label>
                            <div class="info-value">${cliente.ci || '-'}</div>
                        </div>
                    </div>

                    <!-- Fila 2: CI, Celular, Fijo -->
                    <div class="info-row">
                        <div class="info-field">
                            <label class="info-label">Código:</label>
                            <div class="info-value">${cliente.codigo || '-'}</div>
                        </div>
                        <div class="info-field">
                            <label class="info-label">Sector (Grupo):</label>
                            <div class="info-value">${cliente.sector || '-'}</div>
                        </div>
                        <div class="info-field">
                            <label class="info-label">Celular:</label>
                            <div class="info-value">${cliente.celular || '-'}</div>
                        </div>
                        <div class="info-field">
                            <label class="info-label">Fijo:</label>
                            <div class="info-value">${cliente.fijo || '-'}</div>
                        </div>
                    </div>

                    <!-- Fila 3: Sector, Código -->
                    <div class="info-row">
                    </div>

                    <!-- Sección de Garante -->
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
                        <h3 style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 15px;">Garante</h3>
                        <div class="info-row">
                            <div class="info-field">
                                <label class="info-label">Nombre Completo:</label>
                                <div class="info-value">${cliente.garante || '-'}</div>
                            </div>
                            <div class="info-field">
                                <label class="info-label">Celular:</label>
                                <div class="info-value">${cliente.celular_garante || '-'}</div>
                            </div>
                        </div>
                        <div class="info-row" style="margin-top: 10px;">
                            <div class="info-field full-width">
                                <label class="info-label">Observaciones:</label>
                                <div class="info-value">${cliente.observaciones || '-'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Toggle Activo -->
                <div class="estado-section">
                    <span class="estado-label">Activo:</span>
                    <div class="toggle-switch">
                        <input type="checkbox" id="toggle-activo" class="toggle-input" ${cliente.isActive ? 'checked' : ''} disabled>
                        <label for="toggle-activo" class="toggle-label">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para crear el HTML del modal de detalles del cliente
export function createFileClienteModal(): string {
    return `
        <div id="modal-file-cliente" class="modal-overlay">
            <div class="modal-content modal-file-cliente">
                <div class="modal-header">
                    <h2 id="modal-cliente-titulo">Registro Cliente</h2>
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
                            <div id="general-content-loading" style="text-align: center; padding: 40px;">
                                <p>⏳ Cargando datos...</p>
                            </div>
                            <div id="general-content" style="display: none;"></div>
                        </div>

                        <!-- Prestamos Tab -->
                        <div class="tab-content" id="tab-prestamos">
                            <div id="prestamos-content-loading" style="text-align: center; padding: 40px; display: none;">
                                <p>⏳ Cargando préstamos...</p>
                            </div>
                            <div id="prestamos-content"></div>
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

// Función para cargar datos del cliente
async function cargarDatosCliente(clienteId: string): Promise<void> {
    const loadingDiv = document.getElementById('general-content-loading');
    const contentDiv = document.getElementById('general-content');

    if (!loadingDiv || !contentDiv) return;

    // Mostrar loading
    loadingDiv.style.display = 'block';
    contentDiv.style.display = 'none';

    try {
        console.log('📡 Cargando datos del cliente:', clienteId);
        const response = await obtenerClientePorId(clienteId);

        if (response.success && response.data) {
            clienteActual = response.data;
            console.log('✅ Datos del cliente cargados:', clienteActual);
            
            // Actualizar título del modal
            const tituloModal = document.getElementById('modal-cliente-titulo');
            if (tituloModal) {
                tituloModal.textContent = `Registro Cliente - ${clienteActual.nombrecompleto}`;
            }
            
            // Renderizar contenido de la pestaña General
            contentDiv.innerHTML = createGeneralTabContent(clienteActual);
            
            // Ocultar loading y mostrar contenido
            loadingDiv.style.display = 'none';
            contentDiv.style.display = 'block';
        } else {
            console.error('❌ Error al cargar cliente:', response.error);
            contentDiv.innerHTML = `<p class="tab-placeholder" style="color: #ff4444;">Error al cargar los datos del cliente: ${response.error}</p>`;
            loadingDiv.style.display = 'none';
            contentDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('💥 Error inesperado:', error);
        contentDiv.innerHTML = '<p class="tab-placeholder" style="color: #ff4444;">Error inesperado al cargar los datos</p>';
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';
    }
}

// Función para mostrar el modal
export function mostrarModalFileCliente(clienteId: string): void {
    console.log('📂 Abriendo detalles del cliente:', clienteId);
    const modal = document.getElementById('modal-file-cliente');
    if (modal) {
        modal.style.display = 'flex';
        // Cargar datos del cliente
        cargarDatosCliente(clienteId);
    }
}

// Función para cerrar el modal
export function cerrarModalFileCliente(): void {
    const modal = document.getElementById('modal-file-cliente');
    if (modal) {
        modal.style.display = 'none';
        // Resetear a la primera pestaña
        resetearTabs();
        // Limpiar datos
        clienteActual = null;
        
        // Resetear contenido de la pestaña General
        const loadingDiv = document.getElementById('general-content-loading');
        const contentDiv = document.getElementById('general-content');
        const tituloModal = document.getElementById('modal-cliente-titulo');
        
        if (loadingDiv) loadingDiv.style.display = 'block';
        if (contentDiv) {
            contentDiv.style.display = 'none';
            contentDiv.innerHTML = '';
        }
        if (tituloModal) tituloModal.textContent = 'Registro Cliente';
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

    // Cargar datos según la pestaña
    if (clienteActual) {
        if (tabName === 'banco') {
            cargarBancosCliente(clienteActual.id_cliente);
        } else if (tabName === 'prestamos') {
            cargarPrestamosCliente(clienteActual.id_cliente);
        }
    }
}

// Función para crear el HTML del tab Banco
function createBancoTabContent(): string {
    const banco1 = bancosCliente[0] || null;
    const banco2 = bancosCliente[1] || null;

    return `
        <div class="banco-container">
            <div class="cuentas-main-container">
                ${renderBancoCard(banco1, 0)}
                ${renderBancoCard(banco2, 1)}
            </div>
        </div>
    `;
}

// Función para renderizar una tarjeta de banco
function renderBancoCard(banco: BancoClienteData | null, index: number): string {
    if (banco) {
        const estadoEmoji = banco.isActive ? '✅' : '❌';
        return `
            <div class="cuenta-section" data-banco-index="${index}">
                <div class="cuenta-header">
                    <h3 class="cuenta-titulo">CUENTA BANCARIA #${index + 1}</h3>
                    <div class="cuenta-header-actions">
                        <span class="estado-emoji" title="${banco.isActive ? 'Cuenta Activa' : 'Cuenta Inactiva'}">${estadoEmoji}</span>
                        <button class="edit-cuenta-btn" data-banco-id="${banco.id_banco_cliente}" title="Editar cuenta">
                            <span class="edit-icon">📝</span>
                        </button>
                    </div>
                </div>
                
                <div class="cuenta-content">
                    <div class="cuenta-field">
                        <span class="cuenta-label">Institución:</span>
                        <span class="cuenta-value">${banco.banco}</span>
                    </div>
                    
                    <div class="cuenta-field">
                        <span class="cuenta-label">N° Cuenta:</span>
                        <span class="cuenta-value">${banco.noCta}</span>
                    </div>
                    
                    <div class="cuenta-field">
                        <span class="cuenta-label">Titular:</span>
                        <span class="cuenta-value">${banco.nombre}</span>
                    </div>
                    
                    <div class="cuenta-field">
                        <span class="cuenta-label">Moneda:</span>
                        <span class="cuenta-value">${banco.moneda}</span>
                    </div>
                    
                    ${banco.usuario ? `
                    <div class="cuenta-field">
                        <span class="cuenta-label">Usuario:</span>
                        <span class="cuenta-value">${banco.usuario}</span>
                    </div>
                    ` : ''}
                    
                    ${banco.key ? `
                    <div class="cuenta-field">
                        <span class="cuenta-label">Key:</span>
                        <span class="cuenta-value cuenta-key">${'•'.repeat(Math.min(banco.key.length, 12))}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    } else {
        return `
            <div class="cuenta-section cuenta-nueva" data-banco-index="${index}">
                <div class="nueva-cuenta-content">
                    <div class="nueva-cuenta-icon">
                        <span class="add-icon">➕</span>
                    </div>
                    <h3 class="nueva-cuenta-titulo">Agregar Cuenta Bancaria #${index + 1}</h3>
                    <p class="nueva-cuenta-descripcion">Haga clic para crear una nueva cuenta bancaria</p>
                    <button class="add-cuenta-btn" data-banco-index="${index}" title="Agregar nueva cuenta">
                        Crear Cuenta
                    </button>
                </div>
            </div>
        `;
    }
}

// Función para cargar bancos del cliente
async function cargarBancosCliente(clienteId: string): Promise<void> {
    try {
        console.log('📡 Cargando bancos del cliente:', clienteId);
        const response = await obtenerBancosCliente(clienteId);

        if (response.success && response.data) {
            bancosCliente = response.data;
            console.log('✅ Bancos cargados:', bancosCliente);
            
            // Renderizar contenido del tab banco
            const bancoTab = document.getElementById('tab-banco');
            if (bancoTab) {
                bancoTab.innerHTML = createBancoTabContent();
                inicializarEventosBanco();
            }
        } else {
            console.error('❌ Error al cargar bancos:', response.error);
            const bancoTab = document.getElementById('tab-banco');
            if (bancoTab) {
                bancoTab.innerHTML = `<p class="tab-placeholder" style="color: #ff4444;">Error al cargar los bancos: ${response.error}</p>`;
            }
        }
    } catch (error) {
        console.error('💥 Error inesperado:', error);
        const bancoTab = document.getElementById('tab-banco');
        if (bancoTab) {
            bancoTab.innerHTML = '<p class="tab-placeholder" style="color: #ff4444;">Error inesperado al cargar los bancos</p>';
        }
    }
}

// Función para inicializar eventos del tab banco
function inicializarEventosBanco(): void {
    // Botones de agregar banco
    const addBtns = document.querySelectorAll('.add-cuenta-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = (e.currentTarget as HTMLElement).getAttribute('data-banco-index');
            if (index !== null && clienteActual) {
                mostrarModalBanco(null, parseInt(index));
            }
        });
    });

    // Botones de editar banco
    const editBtns = document.querySelectorAll('.edit-cuenta-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bancoId = (e.currentTarget as HTMLElement).getAttribute('data-banco-id');
            if (bancoId) {
                const banco = bancosCliente.find(b => b.id_banco_cliente === bancoId);
                if (banco) {
                    const index = bancosCliente.indexOf(banco);
                    mostrarModalBanco(banco, index);
                }
            }
        });
    });
}

// Función para mostrar modal de banco
function mostrarModalBanco(banco: BancoClienteData | null, index: number): void {
    const modal = crearModalBanco(banco, index);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

// Función para crear modal de banco
function crearModalBanco(banco: BancoClienteData | null, index: number): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'cuenta-modal';
    modal.id = 'modal-banco-edit';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${banco ? 'Editar' : 'Agregar'} Cuenta Bancaria #${index + 1}</h3>
                <button class="close-modal-btn" id="close-banco-modal">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="form-group">
                    <label for="banco-institucion">Institución:</label>
                    <input type="text" id="banco-institucion" value="${banco?.banco || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="banco-numero">N° Cuenta:</label>
                    <input type="text" id="banco-numero" value="${banco?.noCta || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="banco-titular">Titular:</label>
                    <input type="text" id="banco-titular" value="${banco?.nombre || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="banco-moneda">Moneda:</label>
                    <select id="banco-moneda" required>
                        <option value="">Seleccionar...</option>
                        <option value="Dólares" ${banco?.moneda === 'Dólares' ? 'selected' : ''}>Dólares</option>
                        <option value="Bolivianos" ${banco?.moneda === 'Bolivianos' ? 'selected' : ''}>Bolivianos</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="banco-usuario">Usuario:</label>
                    <input type="text" id="banco-usuario" value="${banco?.usuario || ''}" placeholder="Usuario de banca en línea (opcional)">
                </div>
                
                <div class="form-group">
                    <label for="banco-key">Key:</label>
                    <input type="password" id="banco-key" value="${banco?.key || ''}" placeholder="Contraseña/Clave (opcional)">
                </div>
                
                <div class="form-group">
                    <label>Estado:</label>
                    <div class="estado-checkbox-section">
                        <input type="checkbox" id="banco-activa" class="estado-checkbox" ${banco?.isActive !== false ? 'checked' : ''}>
                        <label for="banco-activa" class="estado-checkbox-label">
                            <span class="checkbox-emoji"></span>
                            <span class="checkbox-text">Cuenta Activa</span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button id="cancel-banco-btn" class="btn btn-secondary">Cancelar</button>
                <button id="save-banco-btn" class="btn btn-primary">${banco ? 'Actualizar' : 'Guardar'}</button>
            </div>
        </div>
    `;

    // Event listeners
    const closeBtn = modal.querySelector('#close-banco-modal');
    const cancelBtn = modal.querySelector('#cancel-banco-btn');
    const saveBtn = modal.querySelector('#save-banco-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.remove());
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => modal.remove());
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const usuarioValue = (modal.querySelector('#banco-usuario') as HTMLInputElement).value.trim();
            const keyValue = (modal.querySelector('#banco-key') as HTMLInputElement).value.trim();
            
            const formData: any = {
                banco: (modal.querySelector('#banco-institucion') as HTMLInputElement).value,
                noCta: (modal.querySelector('#banco-numero') as HTMLInputElement).value,
                nombre: (modal.querySelector('#banco-titular') as HTMLInputElement).value,
                moneda: (modal.querySelector('#banco-moneda') as HTMLSelectElement).value,
                isActive: (modal.querySelector('#banco-activa') as HTMLInputElement).checked,
            };

            // Agregar campos opcionales solo si tienen valor
            if (usuarioValue) {
                formData.usuario = usuarioValue;
            }
            if (keyValue) {
                formData.key = keyValue;
            }

            if (!formData.banco || !formData.noCta || !formData.nombre || !formData.moneda) {
                alert('Por favor complete todos los campos obligatorios');
                return;
            }

            if (banco && banco.id_banco_cliente) {
                // Actualizar banco existente
                await actualizarBanco(banco.id_banco_cliente, formData);
            } else if (clienteActual) {
                // Crear nuevo banco
                await crearBanco({ ...formData, clienteId: clienteActual.id_cliente });
            }

            modal.remove();
        });
    }

    return modal;
}

// Función para crear banco
async function crearBanco(bancoData: CreateBancoClienteDto): Promise<void> {
    try {
        const response = await crearBancoCliente(bancoData);
        if (response.success) {
            alert('Banco creado exitosamente');
            if (clienteActual) {
                await cargarBancosCliente(clienteActual.id_cliente);
            }
        } else {
            alert(`Error: ${response.error}`);
        }
    } catch (error) {
        console.error('Error al crear banco:', error);
        alert('Error al crear el banco');
    }
}

// Función para actualizar banco
async function actualizarBanco(bancoId: string, bancoData: Partial<CreateBancoClienteDto>): Promise<void> {
    try {
        const response = await actualizarBancoCliente(bancoId, bancoData);
        if (response.success) {
            alert('Banco actualizado exitosamente');
            if (clienteActual) {
                await cargarBancosCliente(clienteActual.id_cliente);
            }
        } else {
            alert(`Error: ${response.error}`);
        }
    } catch (error) {
        console.error('Error al actualizar banco:', error);
        alert('Error al actualizar el banco');
    }
}

// ==================== FUNCIONES PARA PRÉSTAMOS ====================

// Función para formatear fecha a formato DD/MM/YYYY
function formatearFecha(fecha: string | Date): string {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// Función para calcular la cuota mensual
function calcularCuotaMensual(montoPrestado: number, tasaInteres: number, plazoMeses: number): number {
    if (plazoMeses === 0) return 0;
    
    // Fórmula simple: (Monto + (Monto * Tasa)) / Plazo
    const montoConInteres = montoPrestado + (montoPrestado * (tasaInteres / 100));
    return montoConInteres / plazoMeses;
}

// Función para cargar préstamos del cliente
async function cargarPrestamosCliente(clienteId: string): Promise<void> {
    const loadingDiv = document.getElementById('prestamos-content-loading');
    const contentDiv = document.getElementById('prestamos-content');

    if (!loadingDiv || !contentDiv) return;

    // Mostrar loading
    loadingDiv.style.display = 'block';
    contentDiv.innerHTML = '';

    try {
        console.log('📡 Cargando préstamos del cliente:', clienteId);
        const response = await obtenerPrestamosPorCliente(clienteId);

        if (response.success && response.data) {
            prestamosCliente = response.data;
            console.log('✅ Préstamos cargados:', prestamosCliente);
            
            // Renderizar contenido del tab préstamos
            contentDiv.innerHTML = createPrestamosTabContent();
            inicializarEventosPrestamos();
            
            // Ocultar loading
            loadingDiv.style.display = 'none';
        } else {
            console.error('❌ Error al cargar préstamos:', response.error);
            contentDiv.innerHTML = `<p class="tab-placeholder" style="color: #ff4444;">Error al cargar los préstamos: ${response.error}</p>`;
            loadingDiv.style.display = 'none';
        }
    } catch (error) {
        console.error('💥 Error inesperado:', error);
        contentDiv.innerHTML = '<p class="tab-placeholder" style="color: #ff4444;">Error inesperado al cargar los préstamos</p>';
        loadingDiv.style.display = 'none';
    }
}

// Función para crear el HTML del tab Préstamos
function createPrestamosTabContent(): string {
    if (!clienteActual) {
        return '<p class="tab-placeholder">No se encontró información del cliente</p>';
    }

    const filasTabla = prestamosCliente.map(prestamo => {
        const cuota = calcularCuotaMensual(prestamo.monto_prestado, prestamo.tasa_interes, prestamo.plazo_meses);
        
        return `
            <tr>
                <td>${clienteActual?.codigo || '-'}</td>
                <td>${formatearFecha(prestamo.fecha_prestamo)}</td>
                <td class="monto-column">${prestamo.monto_prestado.toFixed(2)}</td>
                <td class="monto-column">${cuota.toFixed(2)}</td>
                <td class="text-center">${prestamo.plazo_meses}</td>
                <td class="acciones-column">
                    <button class="btn-edit-prestamo" data-prestamo-id="${prestamo.id_prestamo}" title="Editar préstamo">
                        ✏️
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Fila para agregar nuevo préstamo
    const filaAgregar = `
        <tr class="fila-nuevo-prestamo">
            <td colspan="5" class="nuevo-prestamo-text">
                <span class="nuevo-prestamo-label">Agregar nuevo préstamo</span>
            </td>
            <td class="acciones-column">
                <button class="btn-add-prestamo" title="Agregar nuevo préstamo">
                    ➕
                </button>
            </td>
        </tr>
    `;

    return `
        <div class="prestamos-container">
            <div class="prestamos-table-wrapper">
                <table class="prestamos-table">
                    <thead>
                        <tr>
                            <th>Código Cliente</th>
                            <th>Fecha de Préstamo</th>
                            <th>Monto Prestado (Bs.)</th>
                            <th>Cuota (Bs.)</th>
                            <th class="text-center">Meses</th>
                            <th class="acciones-header">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filasTabla}
                        ${filaAgregar}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Función para inicializar eventos del tab préstamos
function inicializarEventosPrestamos(): void {
    // Botones de editar préstamo
    const editBtns = document.querySelectorAll('.btn-edit-prestamo');
    editBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prestamoId = (e.currentTarget as HTMLElement).getAttribute('data-prestamo-id');
            if (prestamoId) {
                const prestamo = prestamosCliente.find(p => p.id_prestamo === prestamoId);
                if (prestamo) {
                    mostrarModalEditarPrestamo(prestamo);
                }
            }
        });
    });

    // Botón de agregar nuevo préstamo
    const addBtn = document.querySelector('.btn-add-prestamo');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            mostrarModalNuevoPrestamo();
        });
    }
}

// Función para mostrar modal de editar préstamo
function mostrarModalEditarPrestamo(prestamo: PrestamoData): void {
    const modal = crearModalEditarPrestamo(prestamo);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

// Función para crear modal de editar préstamo
function crearModalEditarPrestamo(prestamo: PrestamoData): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'cuenta-modal';
    modal.id = 'modal-prestamo-edit';
    
    const cuotaActual = calcularCuotaMensual(prestamo.monto_prestado, prestamo.tasa_interes, prestamo.plazo_meses);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Editar Préstamo</h3>
                <button class="close-modal-btn" id="close-prestamo-modal">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="form-group">
                    <label for="prestamo-monto">Monto Prestado (Bs.):</label>
                    <input type="number" id="prestamo-monto" value="${prestamo.monto_prestado}" step="0.01" min="0" required>
                </div>
                
                <div class="form-group">
                    <label for="prestamo-cuota">Cuota (Bs.):</label>
                    <input type="number" id="prestamo-cuota" value="${cuotaActual.toFixed(2)}" step="0.01" min="0" required readonly>
                    <small style="color: #999; font-size: 12px;">Se calcula automáticamente basado en monto, tasa de interés y plazo</small>
                </div>
                
                <div class="form-group">
                    <label for="prestamo-tasa">Tasa de Interés (%):</label>
                    <input type="number" id="prestamo-tasa" value="${prestamo.tasa_interes}" step="0.01" min="0" max="100" required>
                </div>
                
                <div class="form-group">
                    <label for="prestamo-meses">Meses:</label>
                    <input type="number" id="prestamo-meses" value="${prestamo.plazo_meses}" min="1" required>
                </div>
            </div>
            
            <div class="modal-footer">
                <button id="cancel-prestamo-btn" class="btn btn-secondary">Cancelar</button>
                <button id="save-prestamo-btn" class="btn btn-primary">Actualizar</button>
            </div>
        </div>
    `;

    // Event listeners para actualizar la cuota automáticamente
    const montoInput = modal.querySelector('#prestamo-monto') as HTMLInputElement;
    const tasaInput = modal.querySelector('#prestamo-tasa') as HTMLInputElement;
    const mesesInput = modal.querySelector('#prestamo-meses') as HTMLInputElement;
    const cuotaInput = modal.querySelector('#prestamo-cuota') as HTMLInputElement;

    const actualizarCuota = () => {
        const monto = parseFloat(montoInput.value) || 0;
        const tasa = parseFloat(tasaInput.value) || 0;
        const meses = parseInt(mesesInput.value) || 1;
        const cuota = calcularCuotaMensual(monto, tasa, meses);
        cuotaInput.value = cuota.toFixed(2);
    };

    montoInput.addEventListener('input', actualizarCuota);
    tasaInput.addEventListener('input', actualizarCuota);
    mesesInput.addEventListener('input', actualizarCuota);

    // Event listeners para botones
    const closeBtn = modal.querySelector('#close-prestamo-modal');
    const cancelBtn = modal.querySelector('#cancel-prestamo-btn');
    const saveBtn = modal.querySelector('#save-prestamo-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.remove());
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => modal.remove());
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const formData: UpdatePrestamoDto = {
                monto_prestado: parseFloat((modal.querySelector('#prestamo-monto') as HTMLInputElement).value),
                tasa_interes: parseFloat((modal.querySelector('#prestamo-tasa') as HTMLInputElement).value),
                plazo_meses: parseInt((modal.querySelector('#prestamo-meses') as HTMLInputElement).value),
            };

            if (!formData.monto_prestado || !formData.plazo_meses || formData.tasa_interes === undefined) {
                alert('Por favor complete todos los campos obligatorios');
                return;
            }

            await actualizarPrestamoFn(prestamo.id_prestamo, formData);
            modal.remove();
        });
    }

    return modal;
}

// Función para actualizar préstamo
async function actualizarPrestamoFn(prestamoId: string, prestamoData: UpdatePrestamoDto): Promise<void> {
    try {
        const response = await actualizarPrestamo(prestamoId, prestamoData);
        if (response.success) {
            alert('Préstamo actualizado exitosamente');
            if (clienteActual) {
                await cargarPrestamosCliente(clienteActual.id_cliente);
            }
        } else {
            alert(`Error: ${response.error}`);
        }
    } catch (error) {
        console.error('Error al actualizar préstamo:', error);
        alert('Error al actualizar el préstamo');
    }
}

// Función para mostrar modal de nuevo préstamo
function mostrarModalNuevoPrestamo(): void {
    if (!clienteActual) {
        alert('No se encontró información del cliente');
        return;
    }
    const modal = crearModalNuevoPrestamo();
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

// Función para crear modal de nuevo préstamo
function crearModalNuevoPrestamo(): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'cuenta-modal';
    modal.id = 'modal-prestamo-nuevo';
    
    // Fecha actual en formato YYYY-MM-DD para el input date
    const fechaActual = new Date().toISOString().split('T')[0];
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Nuevo Préstamo</h3>
                <button class="close-modal-btn" id="close-nuevo-prestamo-modal">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="form-group">
                    <label for="nuevo-prestamo-fecha">Fecha de Préstamo:</label>
                    <input type="date" id="nuevo-prestamo-fecha" value="${fechaActual}" required>
                </div>

                <div class="form-group">
                    <label for="nuevo-prestamo-monto">Monto Prestado (Bs.):</label>
                    <input type="number" id="nuevo-prestamo-monto" value="0" step="0.01" min="0" required>
                </div>
                
                <div class="form-group">
                    <label for="nuevo-prestamo-tasa">Tasa de Interés (%):</label>
                    <input type="number" id="nuevo-prestamo-tasa" value="0" step="0.01" min="0" max="100" required>
                </div>
                
                <div class="form-group">
                    <label for="nuevo-prestamo-meses">Meses:</label>
                    <input type="number" id="nuevo-prestamo-meses" value="12" min="1" required>
                </div>

                <div class="form-group">
                    <label for="nuevo-prestamo-cuota">Cuota Mensual (Bs.):</label>
                    <input type="number" id="nuevo-prestamo-cuota" value="0.00" step="0.01" min="0" required readonly>
                    <small style="color: #999; font-size: 12px;">Se calcula automáticamente basado en monto, tasa de interés y plazo</small>
                </div>
            </div>
            
            <div class="modal-footer">
                <button id="cancel-nuevo-prestamo-btn" class="btn btn-secondary">Cancelar</button>
                <button id="save-nuevo-prestamo-btn" class="btn btn-primary">Crear Préstamo</button>
            </div>
        </div>
    `;

    // Event listeners para actualizar la cuota automáticamente
    const montoInput = modal.querySelector('#nuevo-prestamo-monto') as HTMLInputElement;
    const tasaInput = modal.querySelector('#nuevo-prestamo-tasa') as HTMLInputElement;
    const mesesInput = modal.querySelector('#nuevo-prestamo-meses') as HTMLInputElement;
    const cuotaInput = modal.querySelector('#nuevo-prestamo-cuota') as HTMLInputElement;

    const actualizarCuota = () => {
        const monto = parseFloat(montoInput.value) || 0;
        const tasa = parseFloat(tasaInput.value) || 0;
        const meses = parseInt(mesesInput.value) || 1;
        const cuota = calcularCuotaMensual(monto, tasa, meses);
        cuotaInput.value = cuota.toFixed(2);
    };

    montoInput.addEventListener('input', actualizarCuota);
    tasaInput.addEventListener('input', actualizarCuota);
    mesesInput.addEventListener('input', actualizarCuota);

    // Event listeners para botones
    const closeBtn = modal.querySelector('#close-nuevo-prestamo-modal');
    const cancelBtn = modal.querySelector('#cancel-nuevo-prestamo-btn');
    const saveBtn = modal.querySelector('#save-nuevo-prestamo-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.remove());
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => modal.remove());
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const fechaInput = (modal.querySelector('#nuevo-prestamo-fecha') as HTMLInputElement).value;
            const monto = parseFloat((modal.querySelector('#nuevo-prestamo-monto') as HTMLInputElement).value);
            const tasa = parseFloat((modal.querySelector('#nuevo-prestamo-tasa') as HTMLInputElement).value);
            const meses = parseInt((modal.querySelector('#nuevo-prestamo-meses') as HTMLInputElement).value);

            if (!fechaInput || !monto || meses < 1 || tasa === undefined) {
                alert('Por favor complete todos los campos obligatorios');
                return;
            }

            if (!clienteActual) {
                alert('No se encontró información del cliente');
                modal.remove();
                return;
            }

            // Calcular fecha de vencimiento (fecha préstamo + meses)
            const fechaPrestamo = new Date(fechaInput);
            const fechaVencimiento = new Date(fechaPrestamo);
            fechaVencimiento.setMonth(fechaVencimiento.getMonth() + meses);

            const formData: CreatePrestamoDto = {
                id_cliente: clienteActual.id_cliente,
                monto_prestado: monto,
                tasa_interes: tasa,
                plazo_meses: meses,
                fecha_prestamo: fechaPrestamo.toISOString(),
                fecha_vencimiento: fechaVencimiento.toISOString(),
                isActive: true,
            };

            await crearPrestamoFn(formData);
            modal.remove();
        });
    }

    return modal;
}

// Función para crear préstamo
async function crearPrestamoFn(prestamoData: CreatePrestamoDto): Promise<void> {
    try {
        const response = await crearPrestamo(prestamoData);
        if (response.success) {
            alert('Préstamo creado exitosamente');
            if (clienteActual) {
                await cargarPrestamosCliente(clienteActual.id_cliente);
            }
        } else {
            alert(`Error: ${response.error}`);
        }
    } catch (error) {
        console.error('Error al crear préstamo:', error);
        alert('Error al crear el préstamo');
    }
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
