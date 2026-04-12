const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Error de servidor' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

// ── Empresa ──
export const empresaApi = {
  getAll: () => fetchAPI<any[]>('/empresas'),
  getOne: (id: string) => fetchAPI<any>(`/empresas/${id}`),
  getStats: (id: string) => fetchAPI<any>(`/empresas/${id}/stats`),
  create: (data: any) => fetchAPI<any>('/empresas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/empresas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<void>(`/empresas/${id}`, { method: 'DELETE' }),
};

// ── Producto ──
export const productoApi = {
  getAll: (idEmpresa?: string) => fetchAPI<any[]>(`/productos${idEmpresa ? `?idEmpresa=${idEmpresa}` : ''}`),
  getOne: (id: string) => fetchAPI<any>(`/productos/${id}`),
  create: (data: any) => fetchAPI<any>('/productos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<void>(`/productos/${id}`, { method: 'DELETE' }),
  toggleActive: (id: string) => fetchAPI<any>(`/productos/${id}/toggle-active`, { method: 'PATCH' }),
};

// ── Categoría ──
export const categoriaApi = {
  getAll: (idEmpresa?: string) => fetchAPI<any[]>(`/categorias${idEmpresa ? `?idEmpresa=${idEmpresa}` : ''}`),
  getOne: (id: string) => fetchAPI<any>(`/categorias/${id}`),
  create: (data: any) => fetchAPI<any>('/categorias', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<void>(`/categorias/${id}`, { method: 'DELETE' }),
};

// ── Sucursal ──
export const sucursalApi = {
  getAll: (idEmpresa?: string) => fetchAPI<any[]>(`/sucursales${idEmpresa ? `?idEmpresa=${idEmpresa}` : ''}`),
  getOne: (id: string) => fetchAPI<any>(`/sucursales/${id}`),
  create: (data: any) => fetchAPI<any>('/sucursales', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/sucursales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<void>(`/sucursales/${id}`, { method: 'DELETE' }),
};

// ── Proveedor ──
export const proveedorApi = {
  getAll: (idEmpresa?: string) => fetchAPI<any[]>(`/proveedores${idEmpresa ? `?idEmpresa=${idEmpresa}` : ''}`),
  getOne: (id: string) => fetchAPI<any>(`/proveedores/${id}`),
  create: (data: any) => fetchAPI<any>('/proveedores', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<void>(`/proveedores/${id}`, { method: 'DELETE' }),
};

// ── Cliente ──
export const clienteApi = {
  getAll: (idEmpresa?: string) => fetchAPI<any[]>(`/clientes${idEmpresa ? `?idEmpresa=${idEmpresa}` : ''}`),
  getOne: (id: string) => fetchAPI<any>(`/clientes/${id}`),
  create: (data: any) => fetchAPI<any>('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<void>(`/clientes/${id}`, { method: 'DELETE' }),
};

// ── Empleado ──
export const empleadoApi = {
  getAll: (idEmpresa?: string) => fetchAPI<any[]>(`/empleados${idEmpresa ? `?idEmpresa=${idEmpresa}` : ''}`),
  getOne: (id: string) => fetchAPI<any>(`/empleados/${id}`),
  create: (data: any) => fetchAPI<any>('/empleados', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/empleados/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<void>(`/empleados/${id}`, { method: 'DELETE' }),
};

// ── Stock ──
export const stockApi = {
  getAll: (idSucursal?: string) => fetchAPI<any[]>(`/stock${idSucursal ? `?idSucursal=${idSucursal}` : ''}`),
  getByProducto: (idProducto: string) => fetchAPI<any[]>(`/stock/producto/${idProducto}`),
  getLowStock: () => fetchAPI<any[]>('/stock/low'),
  create: (data: any) => fetchAPI<any>('/stock', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/stock/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  aumentar: (id: string, cantidad: number) => fetchAPI<any>(`/stock/${id}/aumentar`, { method: 'PATCH', body: JSON.stringify({ cantidad }) }),
  reducir: (id: string, cantidad: number) => fetchAPI<any>(`/stock/${id}/reducir`, { method: 'PATCH', body: JSON.stringify({ cantidad }) }),
};

// ── Venta ──
export const ventaApi = {
  getAll: (idEmpresa?: string) => fetchAPI<any[]>(`/ventas${idEmpresa ? `?idEmpresa=${idEmpresa}` : ''}`),
  getResumen: (idEmpresa: string) => fetchAPI<any>(`/ventas/resumen/${idEmpresa}`),
};
