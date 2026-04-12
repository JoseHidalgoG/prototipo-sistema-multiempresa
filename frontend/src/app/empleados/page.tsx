'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEmpresa } from '@/lib/EmpresaContext';
import { empleadoApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import CrudPage from '@/components/ui/CrudPage';

export default function EmpleadosPage() {
  const { empresaActual } = useEmpresa();
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!empresaActual) return;
    setLoading(true);
    try { setData(await empleadoApi.getAll(empresaActual.idEmpresa)); }
    catch { toast('Error cargando empleados', 'error'); }
    finally { setLoading(false); }
  }, [empresaActual]);

  useEffect(() => { load(); }, [load]);

  return (
    <CrudPage
      title="Empleados"
      data={data}
      loading={loading}
      idKey="idEmpleado"
      searchKeys={['nombre', 'cargo']}
      columns={[
        { key: 'nombre', label: 'Nombre', render: (i) => <span className="font-semibold text-surface-800">{i.nombre}</span> },
        { key: 'cargo', label: 'Cargo', render: (i) => i.cargo ? <span className="badge badge-blue">{i.cargo}</span> : '—' },
      ]}
      fields={[
        { key: 'nombre', label: 'Nombre completo', required: true, placeholder: 'Nombre del empleado', colSpan: 2 },
        { key: 'cargo', label: 'Cargo', placeholder: 'Ej: Cajero, Gerente, Vendedor' },
      ]}
      onSave={async (form, id) => {
        try {
          if (id) { await empleadoApi.update(id, form); toast('Empleado actualizado'); }
          else { await empleadoApi.create({ ...form, idEmpresa: empresaActual!.idEmpresa }); toast('Empleado creado'); }
          load();
        } catch (e: any) { toast(e.message, 'error'); throw e; }
      }}
      onDelete={async (id) => {
        try { await empleadoApi.delete(id); toast('Empleado eliminado'); load(); }
        catch (e: any) { toast(e.message, 'error'); }
      }}
    />
  );
}
