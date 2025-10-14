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
