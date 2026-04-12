'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEmpresa } from '@/lib/EmpresaContext';
import { sucursalApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import CrudPage from '@/components/ui/CrudPage';

export default function SucursalesPage() {
  const { empresaActual } = useEmpresa();
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!empresaActual) return;
    setLoading(true);
    try { setData(await sucursalApi.getAll(empresaActual.idEmpresa)); }
    catch { toast('Error cargando sucursales', 'error'); }
    finally { setLoading(false); }
  }, [empresaActual]);

  useEffect(() => { load(); }, [load]);

  return (
    <CrudPage
      title="Sucursales"
      data={data}
      loading={loading}
      idKey="idSucursal"
      searchKeys={['nombre', 'direccion', 'telefono']}
      columns={[
        { key: 'nombre', label: 'Nombre', render: (i) => <span className="font-semibold text-surface-800">{i.nombre}</span> },
        { key: 'direccion', label: 'Dirección' },
        { key: 'telefono', label: 'Teléfono' },
      ]}
      fields={[
        { key: 'nombre', label: 'Nombre', required: true, placeholder: 'Ej: Sede Central', colSpan: 2 },
        { key: 'direccion', label: 'Dirección', required: true, placeholder: 'Ej: Av. Principal #100', colSpan: 2 },
        { key: 'telefono', label: 'Teléfono', required: true, type: 'tel', placeholder: '809-555-0000' },
      ]}
      onSave={async (form, id) => {
        try {
          if (id) { await sucursalApi.update(id, form); toast('Sucursal actualizada'); }
          else { await sucursalApi.create({ ...form, idEmpresa: empresaActual!.idEmpresa }); toast('Sucursal creada'); }
          load();
        } catch (e: any) { toast(e.message, 'error'); throw e; }
      }}
      onDelete={async (id) => {
        try { await sucursalApi.delete(id); toast('Sucursal eliminada'); load(); }
        catch (e: any) { toast(e.message, 'error'); }
      }}
    />
  );
}
