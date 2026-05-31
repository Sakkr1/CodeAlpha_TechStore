import { createContext, useContext, useEffect, useState } from "react";
import { subscribe } from "../lib/loadingManager";

const LoadingCtx = createContext(false);
export const useGlobalLoading = () => useContext(LoadingCtx);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => subscribe(setLoading), []);

  return (
    <LoadingCtx.Provider value={loading}>
      {children}
    </LoadingCtx.Provider>
  );
}
