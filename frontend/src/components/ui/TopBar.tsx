'use client';

import { useEmpresa } from '@/lib/EmpresaContext';

export default function TopBar() {
  const { empresas, empresaActual, setEmpresaActual, loading } = useEmpresa();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 font-medium">Empresa activa:</span>
        {loading ? (
          <div className="h-9 w-56 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <select
            className="form-select text-sm font-semibold text-surface-800 min-w-[220px]"
            value={empresaActual?.idEmpresa || ''}
            onChange={(e) => {
              const emp = empresas.find((x) => x.idEmpresa === e.target.value);
              if (emp) setEmpresaActual(emp);
            }}
          >
            {empresas.map((e) => (
              <option key={e.idEmpresa} value={e.idEmpresa}>
                {e.nombre}
              </option>
            ))}
          </select>
        )}
        {empresaActual && (
          <span className="badge badge-blue">RNC: {empresaActual.rnc}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </header>
  );
}
