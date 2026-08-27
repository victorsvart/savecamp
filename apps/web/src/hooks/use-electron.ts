import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("focus", callback);
  return () => window.removeEventListener("focus", callback);
}

function getSnapshot() {
  return typeof window !== "undefined" && window.electron !== undefined;
}

function getServerSnapshot() {
  return false;
}

export function useElectron() {
  const isAvailable = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return {
    isAvailable,
    api: isAvailable ? window.electron! : null,
  };
}
