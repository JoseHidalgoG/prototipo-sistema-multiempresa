'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEmpresa } from '@/lib/EmpresaContext';
import { stockApi, sucursalApi, productoApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import PageHeader from '@/components/ui/PageHeader';
import Modal from '@/components/ui/Modal';

export default function StockPage() {
  const { empresaActual } = useEmpresa();
  const { toast } = useToast();
  const [stock, setStock] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSucursal, setFilterSucursal] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [adjustModal, setAdjustModal] = useState<any>(null);
  const [adjustQty, setAdjustQty] = useState(1);
  const [form, setForm] = useState({ idSucursal: '', idProducto: '', cantidadDisponible: 0, cantidadMinima: 5 });

  const load = useCallback(async () => {
    if (!empresaActual) return;
    setLoading(true);
    try {
      const [stk, sucs, prods] = await Promise.all([
        stockApi.getAll(),
        sucursalApi.getAll(empresaActual.idEmpresa),
        productoApi.getAll(empresaActual.idEmpresa),
      ]);
      setSucursales(sucs);
      setProductos(prods);
      // Filter stock to only show items from this empresa's sucursales
      const sucIds = new Set(sucs.map((s: any) => s.idSucursal));
      setStock(stk.filter((s: any) => sucIds.has(s.idSucursal)));
    } catch { toast('Error cargando inventario', 'error'); }
    finally { setLoading(false); }
  }, [empresaActual]);

  useEffect(() => { load(); }, [load]);

  const filtered = filterSucursal ? stock.filter((s) => s.idSucursal === filterSucursal) : stock;

  const handleCreate = async () => {
    try {
      await stockApi.create(form);
      toast('Stock creado');
      setModalOpen(false);
      load();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const handleAdjust = async (type: 'aumentar' | 'reducir') => {
    if (!adjustModal || adjustQty <= 0) return;
    try {
      if (type === 'aumentar') await stockApi.aumentar(adjustModal.idStock, adjustQty);
      else await stockApi.reducir(adjustModal.idStock, adjustQty);
      toast(`Stock ${type === 'aumentar' ? 'aumentado' : 'reducido'} en ${adjustQty} unidades`);
      setAdjustModal(null);
      load();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Inventario / Stock"
        subtitle={`${filtered.length} registros de stock`}
        action={
          <button className="btn-primary" onClick={() => { setForm({ idSucursal: '', idProducto: '', cantidadDisponible: 0, cantidadMinima: 5 }); setModalOpen(true); }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Nuevo Stock
          </button>
        }
      />

      {/* Filter */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">Filtrar por sucursal:</span>
          <select className="form-select max-w-xs" value={filterSucursal} onChange={(e) => setFilterSucursal(e.target.value)}>
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => <option key={s.idSucursal} value={s.idSucursal}>{s.nombre}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <div className="inline-block w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Sucursal</th>
                  <th className="text-right">Disponible</th>
                  <th className="text-right">Mínimo</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const isLow = s.cantidadDisponible <= s.cantidadMinima;
                  const isOut = s.cantidadDisponible === 0;
                  return (
                    <tr key={s.idStock}>
                      <td className="font-semibold text-surface-800">{s.producto?.nombre || s.idProducto}</td>
                      <td className="text-gray-600">{s.sucursal?.nombre || s.idSucursal}</td>
                      <td className={`text-right font-bold font-mono ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-surface-800'}`}>{s.cantidadDisponible}</td>
                      <td className="text-right text-gray-500 font-mono">{s.cantidadMinima}</td>
                      <td>
                        <span className={`badge ${isOut ? 'badge-red' : isLow ? 'badge-amber' : 'badge-green'}`}>
                          {isOut ? 'Agotado' : isLow ? 'Bajo' : 'Normal'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button className="btn-ghost btn-sm rounded-lg text-emerald-600 hover:bg-emerald-50" onClick={() => { setAdjustModal(s); setAdjustQty(1); }} title="Ajustar stock">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Stock Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Registro de Stock">
        <div className="space-y-4">
          <div>
            <label className="form-label">Sucursal *</label>
            <select className="form-select" value={form.idSucursal} onChange={(e) => setForm({ ...form, idSucursal: e.target.value })}>
              <option value="">Seleccionar sucursal</option>
              {sucursales.map((s) => <option key={s.idSucursal} value={s.idSucursal}>{s.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Producto *</label>
            <select className="form-select" value={form.idProducto} onChange={(e) => setForm({ ...form, idProducto: e.target.value })}>
              <option value="">Seleccionar producto</option>
              {productos.map((p) => <option key={p.idProducto} value={p.idProducto}>{p.nombre} ({p.codigo})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Cantidad Disponible</label>
              <input type="number" min="0" className="form-input" value={form.cantidadDisponible} onChange={(e) => setForm({ ...form, cantidadDisponible: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="form-label">Cantidad Mínima</label>
              <input type="number" min="0" className="form-input" value={form.cantidadMinima} onChange={(e) => setForm({ ...form, cantidadMinima: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
          <button className="btn-primary" onClick={handleCreate}>Crear</button>
        </div>
      </Modal>

      {/* Adjust Stock Modal */}
      <Modal open={!!adjustModal} onClose={() => setAdjustModal(null)} title="Ajustar Stock" size="sm">
        {adjustModal && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Producto</p>
              <p className="font-bold text-surface-800">{adjustModal.producto?.nombre}</p>
              <p className="text-sm text-gray-500 mt-1">{adjustModal.sucursal?.nombre}</p>
              <p className="text-sm mt-2">Stock actual: <span className="font-bold font-mono">{adjustModal.cantidadDisponible}</span></p>
            </div>
            <div>
              <label className="form-label">Cantidad</label>
              <input type="number" min="1" className="form-input" value={adjustQty} onChange={(e) => setAdjustQty(parseInt(e.target.value) || 1)} />
            </div>
            <div className="flex gap-3">
              <button className="btn flex-1 bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => handleAdjust('aumentar')}>
                + Aumentar
              </button>
              <button className="btn flex-1 bg-red-600 text-white hover:bg-red-700" onClick={() => handleAdjust('reducir')}>
                − Reducir
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
