'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEmpresa } from '@/lib/EmpresaContext';
import { productoApi, categoriaApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import PageHeader from '@/components/ui/PageHeader';
import Modal from '@/components/ui/Modal';

interface Producto {
  idProducto: string;
  nombre: string;
  tipo: string;
  codigo: string;
  precioVenta: number;
  marca: string;
  activo: boolean;
  idEmpresa: string;
  idCategoria: string | null;
  categoriaRel?: { idCategoria: string; categoria: string } | null;
}

interface Categoria {
  idCategoria: string;
  categoria: string;
}

const emptyForm = {
  nombre: '',
  tipo: '',
  codigo: '',
  precioVenta: 0,
  marca: '',
  activo: true,
  idCategoria: '',
};

export default function ProductosPage() {
  const { empresaActual } = useEmpresa();
  const { toast } = useToast();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    if (!empresaActual) return;
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productoApi.getAll(empresaActual.idEmpresa),
        categoriaApi.getAll(empresaActual.idEmpresa),
      ]);
      setProductos(prods);
      setCategorias(cats);
    } catch (err: any) {
      toast(err.message || 'Error cargando productos', 'error');
    } finally {
      setLoading(false);
    }
  }, [empresaActual]);

  useEffect(() => { loadData(); }, [loadData]);

  // Filter logic
  const filtered = productos.filter((p) => {
    const matchSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.codigo.toLowerCase().includes(search.toLowerCase()) ||
      p.marca?.toLowerCase().includes(search.toLowerCase());
    const matchActive =
      filterActive === 'all' || (filterActive === 'active' ? p.activo : !p.activo);
    return matchSearch && matchActive;
  });

  // Validate form
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = 'Nombre es requerido';
    if (!form.tipo.trim()) e.tipo = 'Tipo es requerido';
    if (!form.codigo.trim()) e.codigo = 'Código es requerido';
    if (form.precioVenta <= 0) e.precioVenta = 'Precio debe ser mayor a 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Open create modal
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  // Open edit modal
  const openEdit = (p: Producto) => {
    setEditingId(p.idProducto);
    setForm({
      nombre: p.nombre,
      tipo: p.tipo,
      codigo: p.codigo,
      precioVenta: p.precioVenta,
      marca: p.marca || '',
      activo: p.activo,
      idCategoria: p.idCategoria || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  // Open detail modal
  const openDetail = async (p: Producto) => {
    try {
      const full = await productoApi.getOne(p.idProducto);
      setSelectedProducto(full);
      setDetailOpen(true);
    } catch {
      toast('Error cargando detalle', 'error');
    }
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!validate() || !empresaActual) return;
    setSaving(true);
    try {
      if (editingId) {
        await productoApi.update(editingId, form);
        toast('Producto actualizado correctamente');
      } else {
        await productoApi.create({ ...form, idEmpresa: empresaActual.idEmpresa });
        toast('Producto creado correctamente');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      toast(err.message || 'Error guardando producto', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await productoApi.delete(id);
      toast('Producto eliminado');
      setDeleteConfirm(null);
      loadData();
    } catch (err: any) {
      toast(err.message || 'Error eliminando producto', 'error');
    }
  };

  // Toggle active
  const handleToggle = async (p: Producto) => {
    try {
      await productoApi.toggleActive(p.idProducto);
      toast(`Producto ${p.activo ? 'desactivado' : 'activado'}`);
      loadData();
    } catch {
      toast('Error cambiando estado', 'error');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Productos"
        subtitle={`${filtered.length} producto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
        action={
          <button className="btn-primary" onClick={openCreate}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Nuevo Producto
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              className="form-input pl-10"
              placeholder="Buscar por nombre, código o marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                className={`btn-sm ${filterActive === f ? 'bg-brand-600 text-white' : 'btn-ghost'} rounded-lg`}
                onClick={() => setFilterActive(f)}
              >
                {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <div className="inline-block w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
            <p className="mt-3 text-sm">Cargando productos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <p className="font-medium">No se encontraron productos</p>
            <p className="text-sm mt-1">Intenta ajustar los filtros o crea un producto nuevo</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th className="text-right">Precio</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.idProducto}>
                    <td>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{p.codigo}</code>
                    </td>
                    <td>
                      <button className="font-semibold text-brand-700 hover:text-brand-900 hover:underline text-left" onClick={() => openDetail(p)}>
                        {p.nombre}
                      </button>
                    </td>
                    <td className="text-gray-600">{p.tipo}</td>
                    <td className="text-gray-600">{p.categoriaRel?.categoria || '—'}</td>
                    <td className="text-gray-600">{p.marca || '—'}</td>
                    <td className="text-right font-semibold text-surface-800 font-mono">
                      RD${p.precioVenta.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <button onClick={() => handleToggle(p)} className="cursor-pointer">
                        <span className={`badge ${p.activo ? 'badge-green' : 'badge-red'}`}>
                          {p.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn-ghost btn-sm rounded-lg" onClick={() => openDetail(p)} title="Ver detalle">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button className="btn-ghost btn-sm rounded-lg" onClick={() => openEdit(p)} title="Editar">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button className="btn-ghost btn-sm rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteConfirm(p.idProducto)} title="Eliminar">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="form-label">Nombre *</label>
            <input className={`form-input ${errors.nombre ? 'border-red-400 ring-1 ring-red-200' : ''}`} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Televisor LED 55 pulgadas" />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
          </div>
          <div>
            <label className="form-label">Código *</label>
            <input className={`form-input ${errors.codigo ? 'border-red-400 ring-1 ring-red-200' : ''}`} value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })} placeholder="Ej: TV-LED-55" />
            {errors.codigo && <p className="text-xs text-red-500 mt-1">{errors.codigo}</p>}
          </div>
          <div>
            <label className="form-label">Tipo *</label>
            <input className={`form-input ${errors.tipo ? 'border-red-400 ring-1 ring-red-200' : ''}`} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} placeholder="Ej: Electrónico" />
            {errors.tipo && <p className="text-xs text-red-500 mt-1">{errors.tipo}</p>}
          </div>
          <div>
            <label className="form-label">Precio de Venta (RD$) *</label>
            <input type="number" step="0.01" min="0" className={`form-input ${errors.precioVenta ? 'border-red-400 ring-1 ring-red-200' : ''}`} value={form.precioVenta || ''} onChange={(e) => setForm({ ...form, precioVenta: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
            {errors.precioVenta && <p className="text-xs text-red-500 mt-1">{errors.precioVenta}</p>}
          </div>
          <div>
            <label className="form-label">Marca</label>
            <input className="form-input" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} placeholder="Ej: Samsung" />
          </div>
          <div>
            <label className="form-label">Categoría</label>
            <select className="form-select" value={form.idCategoria} onChange={(e) => setForm({ ...form, idCategoria: e.target.value })}>
              <option value="">— Sin categoría —</option>
              {categorias.map((c) => (
                <option key={c.idCategoria} value={c.idCategoria}>{c.categoria}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 pt-5">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-brand-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
            </label>
            <span className="text-sm font-medium text-gray-700">Producto activo</span>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...</>
            ) : (
              editingId ? 'Guardar Cambios' : 'Crear Producto'
            )}
          </button>
        </div>
      </Modal>

      {/* DETAIL MODAL */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Detalle del Producto" size="lg">
        {selectedProducto && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-surface-900">{selectedProducto.nombre}</h3>
                <code className="text-sm bg-gray-100 px-2.5 py-1 rounded font-mono text-gray-600 mt-1 inline-block">{selectedProducto.codigo}</code>
              </div>
              <span className={`badge ${selectedProducto.activo ? 'badge-green' : 'badge-red'} text-sm`}>
                {selectedProducto.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-1">Tipo</p>
                <p className="font-semibold text-surface-800">{selectedProducto.tipo}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-1">Marca</p>
                <p className="font-semibold text-surface-800">{selectedProducto.marca || '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-1">Categoría</p>
                <p className="font-semibold text-surface-800">{selectedProducto.categoriaRel?.categoria || 'Sin categoría'}</p>
              </div>
              <div className="bg-brand-50 rounded-xl p-4 ring-1 ring-brand-200">
                <p className="text-xs text-brand-600 font-medium mb-1">Precio de Venta</p>
                <p className="font-bold text-brand-800 text-lg font-mono">RD${selectedProducto.precioVenta.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            {/* Stock info if available */}
            {selectedProducto.stocks && selectedProducto.stocks.length > 0 && (
              <div>
                <h4 className="font-display font-bold text-surface-800 mb-2">Stock por Sucursal</h4>
                <table className="data-table">
                  <thead><tr><th>Sucursal</th><th className="text-right">Disponible</th><th className="text-right">Mínimo</th></tr></thead>
                  <tbody>
                    {selectedProducto.stocks.map((s: any) => (
                      <tr key={s.idStock}>
                        <td>{s.sucursal?.nombre || s.idSucursal}</td>
                        <td className="text-right font-semibold">{s.cantidadDisponible}</td>
                        <td className="text-right text-gray-500">{s.cantidadMinima}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button className="btn-secondary" onClick={() => { setDetailOpen(false); openEdit(selectedProducto); }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Editar
              </button>
              <button className="btn-ghost" onClick={() => setDetailOpen(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE CONFIRMATION */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar Eliminación" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          </div>
          <p className="text-surface-800 font-medium mb-1">¿Estás seguro de eliminar este producto?</p>
          <p className="text-sm text-gray-500 mb-5">Esta acción no se puede deshacer.</p>
          <div className="flex gap-3 justify-center">
            <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
            <button className="btn-danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Eliminar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
