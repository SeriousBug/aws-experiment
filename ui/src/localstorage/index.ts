import React, { useContext, useEffect } from "react";

type LocalData = {
  cache: {
    [key: string]: string | undefined;
  };
};

const LocalStorageContext = React.createContext<LocalData>({ cache: {} });
LocalStorageContext.displayName = "LocalStorageContext";
const LocalStorageProvider = LocalStorageContext.Provider;

export { LocalStorageProvider };

export function useLocalStorage() {
  const localData = useContext(LocalStorageContext);
  // Set up an event listener, which will update the cache if another window
  // changes the data in the cache.
  useEffect(() => {
    function localStorageListener(event: StorageEvent) {
      const { key, newValue } = event;
      if (!key) return;
      if (!newValue) {
        delete localData.cache[key];
      } else {
        localData.cache[key] = newValue;
      }
    }
    window.addEventListener("storage", localStorageListener);
    // cleanup function
    return () => {
      window.removeEventListener("storage", localStorageListener);
    };
  }, [localData.cache]);
  return [
    function getLocalData(key: string) {
      if (localData.cache[key]) {
        return localData.cache[key];
      }

      return window.localStorage.getItem(key);
    },
    function setLocalData(key: string, value: string) {
      window.localStorage.setItem(key, value);
    },
  ];
}
