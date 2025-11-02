import { createContext, useContext } from "react";

const LocalStorageContext = createContext(null);

export function LocalStorageProvider({ children }) {
  const value = {};

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
}

export function useLocalStorage() {
  const context = useContext(LocalStorageContext);

  if (!context) {
    throw new Error("useLocalStorage must be used within LocalStorageProvider");
  }

  return context;
}

