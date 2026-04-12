'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { empresaApi } from '@/lib/api';

interface Empresa {
  idEmpresa: string;
  rnc: string;
  nombre: string;
}

interface EmpresaContextType {
  empresas: Empresa[];
  empresaActual: Empresa | null;
  setEmpresaActual: (e: Empresa) => void;
  loading: boolean;
  reload: () => void;
}

const EmpresaContext = createContext<EmpresaContextType>({
  empresas: [],
  empresaActual: null,
  setEmpresaActual: () => {},
  loading: true,
  reload: () => {},
});

export function EmpresaProvider({ children }: { children: React.ReactNode }) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaActual, setEmpresaActual] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  const loadEmpresas = useCallback(async () => {
    try {
      const data = await empresaApi.getAll();
      setEmpresas(data);
      if (data.length > 0 && !empresaActual) {
        setEmpresaActual(data[0]);
      }
    } catch (err) {
      console.error('Error cargando empresas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEmpresas(); }, [loadEmpresas]);

  return (
    <EmpresaContext.Provider value={{ empresas, empresaActual, setEmpresaActual, loading, reload: loadEmpresas }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export const useEmpresa = () => useContext(EmpresaContext);
