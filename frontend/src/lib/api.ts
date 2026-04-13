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

// ── Producto ──
export const productoApi = {
  getAll: () => fetchAPI<any[]>('/productos'),
  getOne: (id: string) => fetchAPI<any>(`/productos/${id}`),
  create: (data: any) => fetchAPI<any>('/productos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<void>(`/productos/${id}`, { method: 'DELETE' }),
  toggleActive: (id: string) => fetchAPI<any>(`/productos/${id}/toggle-active`, { method: 'PATCH' }),
};
