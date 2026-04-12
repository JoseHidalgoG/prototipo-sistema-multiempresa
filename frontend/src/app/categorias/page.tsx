'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEmpresa } from '@/lib/EmpresaContext';
import { categoriaApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import CrudPage from '@/components/ui/CrudPage';

export default function CategoriasPage() {
  const { empresaActual } = useEmpresa();
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!empresaActual) return;
    setLoading(true);
    try { setData(await categoriaApi.getAll(empresaActual.idEmpresa)); }
    catch { toast('Error cargando categorías', 'error'); }
    finally { setLoading(false); }
  }, [empresaActual]);

  useEffect(() => { load(); }, [load]);

  return (
    <CrudPage
      title="Categorías"
      data={data}
      loading={loading}
      idKey="idCategoria"
      searchKeys={['categoria']}
      columns={[
        { key: 'categoria', label: 'Categoría', render: (i) => <span className="font-semibold text-surface-800">{i.categoria}</span> },
      ]}
      fields={[
        { key: 'categoria', label: 'Nombre de Categoría', required: true, placeholder: 'Ej: Electrónica', colSpan: 2 },
      ]}
      onSave={async (form, id) => {
        try {
          if (id) { await categoriaApi.update(id, form); toast('Categoría actualizada'); }
          else { await categoriaApi.create({ ...form, idEmpresa: empresaActual!.idEmpresa }); toast('Categoría creada'); }
          load();
        } catch (e: any) { toast(e.message, 'error'); throw e; }
      }}
      onDelete={async (id) => {
        try { await categoriaApi.delete(id); toast('Categoría eliminada'); load(); }
        catch (e: any) { toast(e.message, 'error'); }
      }}
    />
  );
}
