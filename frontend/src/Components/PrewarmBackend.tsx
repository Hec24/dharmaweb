// src/components/PrewarmBackend.tsx
import { useEffect } from "react";
import { api } from "../lib/api";

export default function PrewarmBackend() {
  useEffect(() => {
    const ping = async () => {
      try { await api.get("/health"); } catch (error) {
        // Error intentionally ignored during prewarm
      }
    };
    ping();
  }, []);
  return null;
}
