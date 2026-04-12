'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEmpresa } from '@/lib/EmpresaContext';
import { clienteApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import CrudPage from '@/components/ui/CrudPage';

export default function ClientesPage() {
  const { empresaActual } = useEmpresa();
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!empresaActual) return;
    setLoading(true);
    try { setData(await clienteApi.getAll(empresaActual.idEmpresa)); }
    catch { toast('Error cargando clientes', 'error'); }
    finally { setLoading(false); }
  }, [empresaActual]);

  useEffect(() => { load(); }, [load]);

  return (
    <CrudPage
      title="Clientes"
      data={data}
      loading={loading}
      idKey="idCliente"
      searchKeys={['nombre', 'apellido', 'cedula', 'email']}
      columns={[
        { key: 'nombre', label: 'Nombre', render: (i) => <span className="font-semibold text-surface-800">{i.nombre} {i.apellido}</span> },
        { key: 'cedula', label: 'Cédula', render: (i) => <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{i.cedula || '—'}</code> },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'email', label: 'Email' },
        { key: 'limiteCredito', label: 'Límite Crédito', render: (i) => <span className="font-mono font-semibold">RD${(i.limiteCredito || 0).toLocaleString('es-DO')}</span> },
      ]}
      fields={[
        { key: 'nombre', label: 'Nombre', required: true, placeholder: 'Nombre' },
        { key: 'apellido', label: 'Apellido', required: true, placeholder: 'Apellido' },
        { key: 'cedula', label: 'Cédula', placeholder: '000-0000000-0' },
        { key: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '809-000-0000' },
        { key: 'email', label: 'Email', type: 'email', placeholder: 'cliente@mail.com' },
        { key: 'limiteCredito', label: 'Límite de Crédito (RD$)', type: 'number', placeholder: '0' },
        { key: 'direccion', label: 'Dirección', placeholder: 'Dirección', colSpan: 2 },
      ]}
      onSave={async (form, id) => {
        try {
          if (id) { await clienteApi.update(id, form); toast('Cliente actualizado'); }
          else { await clienteApi.create({ ...form, idEmpresa: empresaActual!.idEmpresa }); toast('Cliente creado'); }
          load();
        } catch (e: any) { toast(e.message, 'error'); throw e; }
      }}
      onDelete={async (id) => {
        try { await clienteApi.delete(id); toast('Cliente eliminado'); load(); }
        catch (e: any) { toast(e.message, 'error'); }
      }}
    />
  );
}
