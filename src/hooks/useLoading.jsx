import { createContext, useContext, useState } from "react";
import styles from "@/assets/styles/components/loading.module.scss";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const value = {
    loading,
    setLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      <div className={`${styles.loadingWrapper} ${loading ? styles.show : ''}`}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p>載入中...</p>
        </div>
      </div>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }

  return context;
}