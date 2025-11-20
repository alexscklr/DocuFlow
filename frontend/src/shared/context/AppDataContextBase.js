import { createContext, useContext } from 'react';

const AppDataContext = createContext(null);
export default AppDataContext;

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
