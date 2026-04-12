'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEmpresa } from '@/lib/EmpresaContext';
import { proveedorApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import CrudPage from '@/components/ui/CrudPage';

export default function ProveedoresPage() {
  const { empresaActual } = useEmpresa();
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!empresaActual) return;
    setLoading(true);
    try { setData(await proveedorApi.getAll(empresaActual.idEmpresa)); }
    catch { toast('Error cargando proveedores', 'error'); }
    finally { setLoading(false); }
  }, [empresaActual]);

  useEffect(() => { load(); }, [load]);

  return (
    <CrudPage
      title="Proveedores"
      data={data}
      loading={loading}
      idKey="idProveedor"
      searchKeys={['nombre', 'rnc', 'email']}
      columns={[
        { key: 'nombre', label: 'Nombre', render: (i) => <span className="font-semibold text-surface-800">{i.nombre}</span> },
        { key: 'rnc', label: 'RNC', render: (i) => <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{i.rnc}</code> },
        { key: 'email', label: 'Email' },
        { key: 'telefono', label: 'Teléfono' },
      ]}
      fields={[
        { key: 'nombre', label: 'Nombre', required: true, placeholder: 'Nombre del proveedor', colSpan: 2 },
        { key: 'rnc', label: 'RNC', required: true, placeholder: '000-00000-0' },
        { key: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '809-000-0000' },
        { key: 'email', label: 'Email', type: 'email', placeholder: 'contacto@proveedor.com' },
        { key: 'direccion', label: 'Dirección', placeholder: 'Dirección completa' },
      ]}
      onSave={async (form, id) => {
        try {
          if (id) { await proveedorApi.update(id, form); toast('Proveedor actualizado'); }
          else { await proveedorApi.create({ ...form, idEmpresa: empresaActual!.idEmpresa }); toast('Proveedor creado'); }
          load();
        } catch (e: any) { toast(e.message, 'error'); throw e; }
      }}
      onDelete={async (id) => {
        try { await proveedorApi.delete(id); toast('Proveedor eliminado'); load(); }
        catch (e: any) { toast(e.message, 'error'); }
      }}
    />
  );
}
