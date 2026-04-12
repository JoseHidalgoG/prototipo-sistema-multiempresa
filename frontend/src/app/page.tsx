'use client';

import { useEffect, useState } from 'react';
import { useEmpresa } from '@/lib/EmpresaContext';
import { empresaApi, ventaApi, stockApi } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';

interface Stats {
  empresa: string;
  sucursales: number;
  productos: number;
  categorias: number;
  proveedores: number;
  clientes: number;
  empleados: number;
}

interface VentaResumen {
  totalVentas: number;
  montoTotal: number;
  ventasCompletadas: number;
}

export default function DashboardPage() {
  const { empresaActual, loading: empLoading } = useEmpresa();
  const [stats, setStats] = useState<Stats | null>(null);
  const [ventas, setVentas] = useState<VentaResumen | null>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresaActual) return;
    setLoading(true);
    Promise.all([
      empresaApi.getStats(empresaActual.idEmpresa),
      ventaApi.getResumen(empresaActual.idEmpresa),
      stockApi.getLowStock(),
    ])
      .then(([s, v, ls]) => {
        setStats(s);
        setVentas(v);
        setLowStock(ls);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [empresaActual]);

  if (empLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card p-5 h-28 animate-pulse bg-gray-50" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: 'Sucursales', value: stats.sucursales, color: 'text-blue-600', bg: 'bg-blue-50', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { label: 'Productos', value: stats.productos, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { label: 'Categorías', value: stats.categorias, color: 'text-violet-600', bg: 'bg-violet-50', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
        { label: 'Proveedores', value: stats.proveedores, color: 'text-amber-600', bg: 'bg-amber-50', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
        { label: 'Clientes', value: stats.clientes, color: 'text-pink-600', bg: 'bg-pink-50', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
        { label: 'Empleados', value: stats.empleados, color: 'text-teal-600', bg: 'bg-teal-50', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { label: 'Ventas Totales', value: ventas?.totalVentas || 0, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { label: 'Monto Ventas', value: `RD$${(ventas?.montoTotal || 0).toLocaleString('es-DO')}`, color: 'text-green-600', bg: 'bg-green-50', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      ]
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Dashboard — ${empresaActual?.nombre}`}
        subtitle="Resumen general del sistema"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="card p-5 hover:shadow-md transition-shadow" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                <svg className={`w-5 h-5 ${card.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                <p className="text-xl font-bold text-surface-800 font-display">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-display font-bold text-surface-800">Alertas de Stock Bajo</h3>
            <span className="badge badge-amber">{lowStock.length} productos</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Sucursal</th>
                  <th>Disponible</th>
                  <th>Mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((s) => (
                  <tr key={s.idStock}>
                    <td className="font-medium text-surface-800">{s.producto?.nombre}</td>
                    <td className="text-gray-600">{s.sucursal?.nombre}</td>
                    <td className="font-semibold text-red-600">{s.cantidadDisponible}</td>
                    <td className="text-gray-500">{s.cantidadMinima}</td>
                    <td>
                      <span className={`badge ${s.cantidadDisponible === 0 ? 'badge-red' : 'badge-amber'}`}>
                        {s.cantidadDisponible === 0 ? 'Agotado' : 'Bajo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
