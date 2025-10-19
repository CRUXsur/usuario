// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to get auth token
function getAuthToken(): string | null {
    return localStorage.getItem('token');
}

// Interface for Device Check Response
interface DeviceCheckResponse {
    success: boolean;
    deviceId: string | null;
    reason?: string;
    message?: string;
    cliente?: any;
    hasActiveLoans?: boolean;
    activeLoans?: any[];
}

// Interface for Cliente Data (según validaciones del backend)
export interface ClienteData {
    nombrecompleto: string;
    ci: string;
    celular?: string;
    fijo?: string;
    isActive?: boolean;
    device_id?: string;
    fecha_vto_tarjeta?: string; // Formato ISO string para Date
    sector?: string;
    codigo?: string;
    banco?: string;
    numero_cuenta?: string;
    moneda?: string;
    garante?: string;
    celular_garante?: string;
    observaciones?: string;
}

// Interface for API Response
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// Interface for Cliente con datos relacionados
export interface ClienteConDatos {
    id_cliente: string;
    codigo: string;
    device_id: string;
    nombrecompleto: string;
    isActive: boolean;
    ci: string;
    celular: string;
    sector: string;
    monto_prestado?: number;
    monto_cuota?: number;
    prestamos?: any[];
}

// Interface for Cliente completo con todos los detalles
export interface ClienteDetalle {
    id_cliente: string;
    nombrecompleto: string;
    ci: string;
    celular: string | null;
    fijo: string | null;
    isActive: boolean;
    device_id: string;
    fecha_vto_tarjeta: string | null;
    sector: string;
    codigo: string;
    banco: string | null;
    numero_cuenta: string | null;
    moneda: string | null;
    garante: string | null;
    celular_garante: string | null;
    observaciones: string | null;
    created_at: string;
    updated_at: string;
}

// Interface for Banco Cliente
export interface BancoClienteData {
    id_banco_cliente?: string;
    banco: string;
    noCta: string;
    nombre: string;
    moneda: string;
    usuario?: string;
    key?: string;
    isActive?: boolean;
    created_at?: string;
    updated_at?: string;
}

// Interface for Create Banco Cliente DTO
export interface CreateBancoClienteDto {
    clienteId: string;
    banco: string;
    noCta: string;
    nombre: string;
    moneda: string;
    usuario?: string;
    key?: string;
    isActive?: boolean;
}

// Interface for Prestamo
export interface PrestamoData {
    id_prestamo: string;
    cliente?: ClienteDetalle;
    monto_prestado: number;
    tasa_interes: number;
    plazo_meses: number;
    fecha_prestamo: string;
    fecha_vencimiento: string;
    isActive: boolean;
    cuota_mensual?: number; // Campo calculado
    created_at?: string;
    updated_at?: string;
}

// Interface for Create Prestamo DTO
export interface CreatePrestamoDto {
    id_cliente: string;
    monto_prestado?: number;
    tasa_interes?: number;
    plazo_meses?: number;
    fecha_prestamo?: Date | string;
    fecha_vencimiento?: Date | string;
    isActive?: boolean;
    images?: string[];
}

// Interface for Update Prestamo DTO
export interface UpdatePrestamoDto {
    monto_prestado?: number;
    tasa_interes?: number;
    plazo_meses?: number;
    fecha_prestamo?: Date | string;
    fecha_vencimiento?: Date | string;
    isActive?: boolean;
    images?: string[];
}

// Function to call the check-device-id API
export async function checkDeviceId(): Promise<DeviceCheckResponse> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                deviceId: null,
                reason: 'No authentication token found. Please login first.',
            };
        }

        console.log('📡 Llamando a API:', `${API_BASE_URL}/automation/check-device-id`);

        const response = await fetch(`${API_BASE_URL}/automation/check-device-id`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: DeviceCheckResponse = await response.json();
        console.log('📥 Respuesta de API:', data);
        return data;
    } catch (error) {
        console.error('Error calling check-device-id API:', error);
        return {
            success: false,
            deviceId: null,
            reason: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Function to create a new cliente
export async function createCliente(clienteData: ClienteData): Promise<ApiResponse> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log('📡 Enviando datos del cliente al backend:', clienteData);

        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(clienteData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error en la respuesta del servidor:', data);
            return {
                success: false,
                error: data.message || data.error || `Error HTTP: ${response.status}`,
            };
        }

        console.log('✅ Cliente creado exitosamente:', data);
        return {
            success: true,
            message: data.message || 'Cliente creado exitosamente',
            data: data,
        };

    } catch (error) {
        console.error('💥 Error al crear cliente:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al crear cliente',
        };
    }
}

// Function to get all clientes with related data
export async function obtenerClientes(): Promise<ApiResponse<ClienteConDatos[]>> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log('📡 Obteniendo lista de clientes...');

        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const clientes = await response.json();
        console.log('📥 Clientes obtenidos:', clientes);

        return {
            success: true,
            data: clientes,
        };

    } catch (error) {
        console.error('💥 Error al obtener clientes:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al obtener clientes',
        };
    }
}

// Function to get a specific cliente by ID
export async function obtenerClientePorId(clienteId: string): Promise<ApiResponse<ClienteDetalle>> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log(`📡 Obteniendo datos del cliente ${clienteId}...`);

        const response = await fetch(`${API_BASE_URL}/clientes/${clienteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cliente = await response.json();
        console.log('📥 Cliente obtenido:', cliente);

        return {
            success: true,
            data: cliente,
        };

    } catch (error) {
        console.error('💥 Error al obtener cliente:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al obtener cliente',
        };
    }
}

// Function to toggle cliente active status
export async function toggleClienteEstado(clienteId: string, nuevoEstado: boolean): Promise<ApiResponse> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log(`📡 Actualizando estado del cliente ${clienteId} a ${nuevoEstado ? 'Activo' : 'Inactivo'}...`);

        const response = await fetch(`${API_BASE_URL}/clientes/${clienteId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive: nuevoEstado }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error en la respuesta del servidor:', data);
            return {
                success: false,
                error: data.message || data.error || `Error HTTP: ${response.status}`,
            };
        }

        console.log('✅ Estado del cliente actualizado:', data);
        return {
            success: true,
            message: `Cliente ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`,
            data: data,
        };

    } catch (error) {
        console.error('💥 Error al actualizar estado del cliente:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al actualizar estado',
        };
    }
}

// Function to get bancos by cliente ID
export async function obtenerBancosCliente(clienteId: string): Promise<ApiResponse<BancoClienteData[]>> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log(`📡 Obteniendo bancos del cliente ${clienteId}...`);

        const response = await fetch(`${API_BASE_URL}/banco-cliente/cliente/${clienteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const bancos = await response.json();
        console.log('📥 Bancos obtenidos:', bancos);

        return {
            success: true,
            data: bancos,
        };

    } catch (error) {
        console.error('💥 Error al obtener bancos del cliente:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al obtener bancos',
        };
    }
}

// Function to create banco cliente
export async function crearBancoCliente(bancoData: CreateBancoClienteDto): Promise<ApiResponse<BancoClienteData>> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log('📡 Creando banco del cliente...', bancoData);

        const response = await fetch(`${API_BASE_URL}/banco-cliente`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(bancoData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error en la respuesta del servidor:', data);
            return {
                success: false,
                error: data.message || data.error || `Error HTTP: ${response.status}`,
            };
        }

        console.log('✅ Banco del cliente creado exitosamente:', data);
        return {
            success: true,
            message: 'Banco creado exitosamente',
            data: data,
        };

    } catch (error) {
        console.error('💥 Error al crear banco del cliente:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al crear banco',
        };
    }
}

// Function to update banco cliente
export async function actualizarBancoCliente(bancoId: string, bancoData: Partial<CreateBancoClienteDto>): Promise<ApiResponse<BancoClienteData>> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log(`📡 Actualizando banco ${bancoId}...`, bancoData);

        const response = await fetch(`${API_BASE_URL}/banco-cliente/${bancoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(bancoData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error en la respuesta del servidor:', data);
            return {
                success: false,
                error: data.message || data.error || `Error HTTP: ${response.status}`,
            };
        }

        console.log('✅ Banco del cliente actualizado exitosamente:', data);
        return {
            success: true,
            message: 'Banco actualizado exitosamente',
            data: data,
        };

    } catch (error) {
        console.error('💥 Error al actualizar banco del cliente:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al actualizar banco',
        };
    }
}

// Function to delete banco cliente
export async function eliminarBancoCliente(bancoId: string): Promise<ApiResponse> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log(`📡 Eliminando banco ${bancoId}...`);

        const response = await fetch(`${API_BASE_URL}/banco-cliente/${bancoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error en la respuesta del servidor:', data);
            return {
                success: false,
                error: data.message || data.error || `Error HTTP: ${response.status}`,
            };
        }

        console.log('✅ Banco del cliente eliminado exitosamente:', data);
        return {
            success: true,
            message: 'Banco eliminado exitosamente',
        };

    } catch (error) {
        console.error('💥 Error al eliminar banco del cliente:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al eliminar banco',
        };
    }
}

// Function to get all prestamos
export async function obtenerPrestamos(): Promise<ApiResponse<PrestamoData[]>> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log('📡 Obteniendo lista de préstamos...');

        const response = await fetch(`${API_BASE_URL}/prestamos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const prestamos = await response.json();
        console.log('📥 Préstamos obtenidos:', prestamos);

        return {
            success: true,
            data: prestamos,
        };

    } catch (error) {
        console.error('💥 Error al obtener préstamos:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al obtener préstamos',
        };
    }
}

// Function to get prestamos by cliente ID
export async function obtenerPrestamosPorCliente(clienteId: string): Promise<ApiResponse<PrestamoData[]>> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log(`📡 Obteniendo préstamos del cliente ${clienteId}...`);

        // Obtenemos todos los préstamos y filtramos por cliente
        const response = await fetch(`${API_BASE_URL}/prestamos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const prestamos = await response.json();
        
        // Filtrar préstamos por cliente
        const prestamosFiltrados = prestamos.filter((p: PrestamoData) => 
            p.cliente?.id_cliente === clienteId
        );

        console.log('📥 Préstamos del cliente obtenidos:', prestamosFiltrados);

        return {
            success: true,
            data: prestamosFiltrados,
        };

    } catch (error) {
        console.error('💥 Error al obtener préstamos del cliente:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al obtener préstamos',
        };
    }
}

// Function to create prestamo
export async function crearPrestamo(prestamoData: CreatePrestamoDto): Promise<ApiResponse<PrestamoData>> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log('📡 Creando préstamo...', prestamoData);

        const response = await fetch(`${API_BASE_URL}/prestamos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(prestamoData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error en la respuesta del servidor:', data);
            return {
                success: false,
                error: data.message || data.error || `Error HTTP: ${response.status}`,
            };
        }

        console.log('✅ Préstamo creado exitosamente:', data);
        return {
            success: true,
            message: 'Préstamo creado exitosamente',
            data: data,
        };

    } catch (error) {
        console.error('💥 Error al crear préstamo:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al crear préstamo',
        };
    }
}

// Function to update prestamo
export async function actualizarPrestamo(prestamoId: string, prestamoData: UpdatePrestamoDto): Promise<ApiResponse<PrestamoData>> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log(`📡 Actualizando préstamo ${prestamoId}...`, prestamoData);

        const response = await fetch(`${API_BASE_URL}/prestamos/${prestamoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(prestamoData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error en la respuesta del servidor:', data);
            return {
                success: false,
                error: data.message || data.error || `Error HTTP: ${response.status}`,
            };
        }

        console.log('✅ Préstamo actualizado exitosamente:', data);
        return {
            success: true,
            message: 'Préstamo actualizado exitosamente',
            data: data,
        };

    } catch (error) {
        console.error('💥 Error al actualizar préstamo:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al actualizar préstamo',
        };
    }
}

// Function to delete prestamo
export async function eliminarPrestamo(prestamoId: string): Promise<ApiResponse> {
    try {
        const token = getAuthToken();
        if (!token) {
            return {
                success: false,
                error: 'No se encontró token de autenticación. Por favor, inicie sesión.',
            };
        }

        console.log(`📡 Eliminando préstamo ${prestamoId}...`);

        const response = await fetch(`${API_BASE_URL}/prestamos/${prestamoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error en la respuesta del servidor:', data);
            return {
                success: false,
                error: data.message || data.error || `Error HTTP: ${response.status}`,
            };
        }

        console.log('✅ Préstamo eliminado exitosamente:', data);
        return {
            success: true,
            message: 'Préstamo eliminado exitosamente',
        };

    } catch (error) {
        console.error('💥 Error al eliminar préstamo:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido al eliminar préstamo',
        };
    }
}
