'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEmpresa } from '@/lib/EmpresaContext';
import { empresaApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import CrudPage from '@/components/ui/CrudPage';

export default function EmpresasPage() {
  const { empresas, reload } = useEmpresa();
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await empresaApi.getAll()); }
    catch { toast('Error cargando empresas', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <CrudPage
      title="Empresas"
      data={data}
      loading={loading}
      idKey="idEmpresa"
      searchKeys={['nombre', 'rnc']}
      columns={[
        { key: 'nombre', label: 'Nombre', render: (i) => <span className="font-semibold text-surface-800">{i.nombre}</span> },
        { key: 'rnc', label: 'RNC', render: (i) => <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{i.rnc}</code> },
        { key: 'sucursales', label: 'Sucursales', render: (i) => <span className="badge badge-blue">{i.sucursales?.length || 0}</span> },
      ]}
      fields={[
        { key: 'nombre', label: 'Nombre de la Empresa', required: true, placeholder: 'Ej: Mi Empresa SRL', colSpan: 2 },
        { key: 'rnc', label: 'RNC', required: true, placeholder: '000-00000-0' },
      ]}
      onSave={async (form, id) => {
        try {
          if (id) { await empresaApi.update(id, form); toast('Empresa actualizada'); }
          else { await empresaApi.create(form); toast('Empresa creada'); }
          load();
          reload();
        } catch (e: any) { toast(e.message, 'error'); throw e; }
      }}
      onDelete={async (id) => {
        try { await empresaApi.delete(id); toast('Empresa eliminada'); load(); reload(); }
        catch (e: any) { toast(e.message, 'error'); }
      }}
    />
  );
}
